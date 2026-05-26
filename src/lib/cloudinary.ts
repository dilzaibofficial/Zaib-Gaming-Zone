// Cloudinary configuration & helpers

export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'zaib_gaming';

// Build optimized Cloudinary URL with transformations
export function cloudinaryUrl(
  publicIdOrUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
    gravity?: string;
  } = {}
): string {
  // If already a full URL (not a public_id), return as-is
  if (publicIdOrUrl.startsWith('http')) return publicIdOrUrl;

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  const transforms: string[] = [
    `f_${format}`,
    `q_${quality}`,
  ];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (gravity && (crop === 'fill' || crop === 'crop')) transforms.push(`g_${gravity}`);

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms.join(',')}/${publicIdOrUrl}`;
}

// Upload a file to Cloudinary using unsigned upload preset
export async function uploadToCloudinary(
  file: File,
  folder: string = 'zaib-gaming'
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Cloudinary upload failed');
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
}
