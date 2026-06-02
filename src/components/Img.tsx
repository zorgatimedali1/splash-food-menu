import { useState, type ImgHTMLAttributes } from 'react';

function webpSrc(src: string): string {
  return src.replace(/\.(jpe?g|png)(\?.*)?$/i, '.webp');
}

export default function Img({ src, alt, className, loading, decoding, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  if (!src) return null;

  const objMatch = className?.match(/object-\S+/);
  const objClass = objMatch ? objMatch[0] : 'object-cover';
  const wrapperClass = className?.replace(/object-\S+/g, '') || '';

  return (
    <div className={`relative overflow-hidden ${wrapperClass}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100/80 animate-pulse" />
      )}
      <picture>
        <source srcSet={webpSrc(src)} type="image/webp" />
        <img
          src={src}
          alt={alt || ''}
          className={`absolute inset-0 w-full h-full ${objClass}`}
          loading={loading || 'lazy'}
          decoding={decoding || 'async'}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
          {...rest}
        />
      </picture>
    </div>
  );
}
