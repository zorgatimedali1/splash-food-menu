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

// Process and upload image - Workers don't have Sharp, so we upload once
// and return the same URL for all variants. Cloudflare Image Resizing
// can transform the image at the CDN edge via URL params if needed.
export const processAndUploadImage = async (
  env: Env,
  file: File,
  prefix: 'products' | 'categories'
): Promise<ImageVariants> => {
  const arrayBuffer = await file.arrayBuffer();
  const baseName = file.name || 'image';
  const contentType = file.type || 'image/jpeg';

  // Upload a single file and reuse the URL for all three variant slots
  const key = generateFilename(prefix, baseName, 'web');
  const url = await uploadToR2(env.R2, env.R2_PUBLIC_URL, key, arrayBuffer, contentType);

  return { original: url, web: url, thumbnail: url };
};

export const deleteImageFromR2 = async (r2: R2Bucket, r2PublicUrl: string, imageUrl: string): Promise<void> => {
  try {
    const key = imageUrl.replace(`${r2PublicUrl}/`, '');
    await r2.delete(key);
  } catch {
    // Silently fail on delete errors
  }
};
