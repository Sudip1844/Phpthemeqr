
export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
  backgroundColor?: string;
}

export const processImage = async (
  file: File,
  options: ImageProcessingOptions = {}
): Promise<string> => {
  const {
    maxWidth = 200,
    maxHeight = 200,
    quality = 0.9,
    format = 'png',
    backgroundColor = 'transparent'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Use setTimeout to prevent UI blocking for large images
      setTimeout(() => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          // Set background color if not transparent
          if (backgroundColor !== 'transparent') {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);
          }

          // Use requestAnimationFrame for smooth rendering
          requestAnimationFrame(() => {
            // Draw the image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to data URL
            const mimeType = format === 'png' ? 'image/png' : `image/${format}`;
            const dataUrl = canvas.toDataURL(mimeType, quality);
            
            // Clean up object URL to prevent memory leaks
            URL.revokeObjectURL(img.src);
            resolve(dataUrl);
          });
        } catch (error) {
          URL.revokeObjectURL(img.src);
          reject(error);
        }
      }, 0);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (PNG, JPG, GIF, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image file size must be less than 5MB'
    };
  }

  return { valid: true };
};

