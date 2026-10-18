/**
 * Image helper utility to compress and convert device files to base64 Data URLs
 * optimized for localStorage persistence without blowing quota.
 */
export const compressImageFile = (file, maxWidth = 1280, maxHeight = 1280, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPEG, PNG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file from device.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image from file.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not create canvas context.'));
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with quality
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl,
          width,
          height,
          originalName: file.name,
          approxSizeKb: Math.round((dataUrl.length * 3) / 4 / 1024),
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
