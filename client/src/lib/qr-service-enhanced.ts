import QRCodeStyling from 'qr-code-styling';

export type DotType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';

// Helper function to check if a string is a valid image URL or data URL
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  // Check if it's a data URL (base64 encoded image)
  if (url.startsWith('data:image/')) return true;
  // Check if it's an HTTP(S) URL
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  // Check if it's a relative path (starts with / or ./)
  if (url.startsWith('/') || url.startsWith('./')) return true;
  // Reject identifier strings like 'link', 'facebook', etc.
  return false;
}

export interface EnhancedQROptions {
  data: string;
  size?: number;
  margin?: number;
  dotsType?: DotType;
  cornerSquareType?: CornerSquareType;
  cornerDotType?: CornerDotType;
  color?: {
    dark: string;
    light: string;
    innerEye?: string;
    outerEye?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  design?: {
    logo?: string;
    logoSize?: number;
    logoOpacity?: number;
    logoBackgroundColor?: string;
    removeLogoBackground?: boolean;
  };
}

export const generateEnhancedQRCode = async (options: EnhancedQROptions): Promise<string> => {
  const {
    data,
    size = 300,
    margin = 4,
    dotsType = 'square',
    cornerSquareType = 'square',
    cornerDotType = 'square',
    color = { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel = 'M',
    design
  } = options;

  return new Promise((resolve, reject) => {
    try {
      if (!data || !data.trim()) {
        reject(new Error('QR code data cannot be empty'));
        return;
      }

      const hasValidLogo = design?.logo && design.logo !== 'none' && isValidImageUrl(design.logo);
      
      const qrCodeOptions: any = {
        width: size,
        height: size,
        type: 'canvas',
        data: data.trim(),
        margin: margin,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: errorCorrectionLevel
        },
        dotsOptions: {
          color: color.dark,
          type: dotsType
        },
        backgroundOptions: {
          color: color.light,
        },
        cornersSquareOptions: {
          color: color.outerEye || color.dark,
          type: cornerSquareType
        },
        cornersDotOptions: {
          color: color.innerEye || color.dark,
          type: cornerDotType
        }
      };

      if (hasValidLogo) {
        qrCodeOptions.image = design.logo;
        qrCodeOptions.imageOptions = {
          hideBackgroundDots: true,
          imageSize: (design.logoSize || 20) / 100,
          margin: 5,
          crossOrigin: 'anonymous',
        };
      }

      const qrCode = new QRCodeStyling(qrCodeOptions);

      qrCode.getRawData('png').then(data => {
        if (!data) {
          console.error('QR Code getRawData returned null/undefined');
          reject(new Error('Failed to generate QR code: getRawData returned null'));
          return;
        }

        const blob = data instanceof Blob ? data : new Blob([data], { type: 'image/png' });
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(new Error('Failed to read QR code data'));
        };
        reader.readAsDataURL(blob);
      }).catch(error => {
        console.error('Enhanced QR generation error:', error);
        reject(error);
      });

    } catch (error) {
      console.error('Enhanced QR Code creation error:', error);
      reject(error);
    }
  });
};

export const downloadEnhancedQRCode = (qrCode: QRCodeStyling, fileName: string = 'qr-code.png') => {
  qrCode.download({ name: fileName, extension: 'png' });
};

export const getQRCodeAsBlob = async (qrCode: QRCodeStyling, type: 'png' | 'svg' = 'png'): Promise<Blob | null> => {
  const data = await qrCode.getRawData(type);
  if (!data) return null;
  if (data instanceof Blob) return data;
  return new Blob([data], { type: type === 'png' ? 'image/png' : 'image/svg+xml' });
};

export const availableDotStyles: { value: DotType; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '⬛' },
  { value: 'rounded', label: 'Rounded', preview: '⬜' },
  { value: 'dots', label: 'Dots', preview: '●' },
  { value: 'classy', label: 'Classy', preview: '◆' },
  { value: 'classy-rounded', label: 'Classy Rounded', preview: '◈' },
  { value: 'extra-rounded', label: 'Extra Rounded', preview: '◉' }
];

export const availableCornerStyles: { value: CornerSquareType; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '▪' },
  { value: 'dot', label: 'Dot', preview: '●' },
  { value: 'extra-rounded', label: 'Extra Rounded', preview: '◉' }
];

export const availableCornerDotStyles: { value: CornerDotType; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '▪' },
  { value: 'dot', label: 'Dot', preview: '●' }
];
