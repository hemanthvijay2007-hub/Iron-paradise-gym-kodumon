import { getSupabaseClient, isCloudConfigured } from './supabaseClient';
import { compressImageFile } from '../utils/imageUtils';

export const STORAGE_BUCKET = 'gym-images';

/**
 * Converts a base64 Data URL to a Blob
 */
export const dataUrlToBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Uploads an image file or DataURL to Supabase Cloud Storage.
 * Returns the permanent public CDN URL.
 */
export const uploadImageToCloudStorage = async (fileOrDataUrl, folder = 'general') => {
  const supabase = getSupabaseClient();

  if (!supabase || !isCloudConfigured()) {
    throw new Error(
      'Cloud storage is not configured. Please set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in Vercel or configure in the Admin panel.'
    );
  }

  let blobToUpload;
  let fileName = '';

  if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
    // It's a Data URL
    blobToUpload = dataUrlToBlob(fileOrDataUrl);
    fileName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
  } else if (fileOrDataUrl instanceof File) {
    // Compress first for fast web delivery
    try {
      const compressed = await compressImageFile(fileOrDataUrl, 1600, 1600, 0.85);
      blobToUpload = dataUrlToBlob(compressed.dataUrl);
      const cleanBaseName = fileOrDataUrl.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      fileName = `${folder}_${Date.now()}_${cleanBaseName}`;
    } catch (e) {
      console.warn('Compression failed, uploading original file:', e);
      blobToUpload = fileOrDataUrl;
      fileName = `${folder}_${Date.now()}_${fileOrDataUrl.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    }
  } else if (fileOrDataUrl instanceof Blob) {
    blobToUpload = fileOrDataUrl;
    fileName = `${folder}_${Date.now()}.jpg`;
  } else {
    throw new Error('Invalid file type provided for cloud upload.');
  }

  const filePath = `${folder}/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, blobToUpload, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    // Check if bucket not found
    if (uploadError.message?.toLowerCase().includes('not found') || uploadError.error === 'Bucket not found') {
      throw new Error(
        `Supabase Storage bucket "${STORAGE_BUCKET}" not found. Please create a public bucket named "${STORAGE_BUCKET}" in your Supabase dashboard.`
      );
    }
    throw new Error(`Cloud upload failed: ${uploadError.message}`);
  }

  // Retrieve public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error('Failed to generate public URL for uploaded image.');
  }

  // Append a cache-busting timestamp query param so other devices immediately see the fresh image
  const publicUrlWithCacheBust = `${urlData.publicUrl}?t=${Date.now()}`;

  return {
    publicUrl: publicUrlWithCacheBust,
    storagePath: filePath,
    rawUrl: urlData.publicUrl,
  };
};

/**
 * Deletes an image from cloud storage if needed
 */
export const deleteImageFromCloudStorage = async (filePath) => {
  const supabase = getSupabaseClient();
  if (!supabase || !filePath) return false;

  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
    if (error) {
      console.warn('Could not delete image from cloud:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Error deleting cloud image:', e);
    return false;
  }
};
