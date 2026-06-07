import type { Env } from '../types/index.js';

export interface ImageVariants {
  original: string;
  web: string;
  thumbnail: string;
}

// Generate a unique filename
const generateFilename = (prefix: string, originalName: string, variant: string): string => {
  const ext = 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const clean = originalName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20);
  return `${prefix}/${clean}-${timestamp}-${random}-${variant}.${ext}`;
};

// Upload buffer to R2 and return public URL
const uploadToR2 = async (
  r2: R2Bucket,
  r2PublicUrl: string,
  key: string,
  data: ArrayBuffer,
  contentType: string
): Promise<string> => {
  await r2.put(key, data, {
    httpMetadata: { contentType },
    customMetadata: { uploadedAt: new Date().toISOString() },
  });
  return `${r2PublicUrl}/${key}`;
};

// Process and upload image - Workers don't have Sharp, so we upload as-is
// In production, use a Cloudflare Images transform or an Image Resizing Worker
export const processAndUploadImage = async (
  env: Env,
  file: File,
  prefix: 'products' | 'categories'
): Promise<ImageVariants> => {
  const arrayBuffer = await file.arrayBuffer();
  const baseName = file.name || 'image';

  // Upload all variants as the same image (Workers don't have native sharp)
  // The R2 public URL + Cloudflare Image Resizing handles transformation
  const [originalKey, webKey, thumbKey] = [
    generateFilename(prefix, baseName, 'original'),
    generateFilename(prefix, baseName, 'web'),
    generateFilename(prefix, baseName, 'thumb'),
  ];

  const [original, web, thumbnail] = await Promise.all([
    uploadToR2(env.R2, env.R2_PUBLIC_URL, originalKey, arrayBuffer, file.type || 'image/jpeg'),
    uploadToR2(env.R2, env.R2_PUBLIC_URL, webKey, arrayBuffer, file.type || 'image/jpeg'),
    uploadToR2(env.R2, env.R2_PUBLIC_URL, thumbKey, arrayBuffer, file.type || 'image/jpeg'),
  ]);

  return { original, web, thumbnail };
};

export const deleteImageFromR2 = async (r2: R2Bucket, r2PublicUrl: string, imageUrl: string): Promise<void> => {
  try {
    const key = imageUrl.replace(`${r2PublicUrl}/`, '');
    await r2.delete(key);
  } catch {
    // Silently fail on delete errors
  }
};
