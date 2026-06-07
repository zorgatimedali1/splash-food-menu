import { useRef, useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { imageUrl } from '../lib/imageUrl';

interface Props {
  value?: string | null;
  onChange: (file: File | null) => void;
  label?: string;
}

const MAX_DIM = 1920;
const QUALITY = 0.92;

async function compressImage(file: File): Promise<File> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });

  let { width, height } = img;
  if (width > MAX_DIM || height > MAX_DIM) {
    const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', QUALITY)
  );

  const ext = file.name.replace(/.*\./, '');
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return new File([blob || file], `${baseName}.webp`, { type: 'image/webp' });
}

export default function ImageUpload({ value, onChange, label = 'Image' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setRemoved(false);

    if (file.size > 50_000) {
      setCompressing(true);
      const compressed = await compressImage(file);
      setCompressing(false);
      onChange(compressed);
    } else {
      onChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setRemoved(true);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displaySrc = removed ? null : (preview || (value ? imageUrl(value) : null));

  return (
    <div>
      <label className="label">{label}</label>
      {displaySrc ? (
        <div className="relative inline-block">
          <img src={displaySrc} alt="preview" loading="lazy" className="w-32 h-32 object-cover rounded-xl border border-splash-border" />
          {compressing && (
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <span className="text-white text-xs font-medium">Compression…</span>
            </div>
          )}
          <button
            type="button" onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <FiX size={12} />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragging ? 'border-black bg-splash-light-gray' : 'border-splash-border hover:border-black hover:bg-splash-light-gray/50'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <FiUpload size={20} className="mx-auto mb-2 text-splash-gray" />
          <p className="text-sm text-splash-gray">Glissez une image ou <span className="text-black font-medium">parcourez</span></p>
          <p className="text-xs text-splash-gray mt-1">PNG, JPG, WEBP &bull; compressé en WebP</p>
        </div>
      )}
      <input
        ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
