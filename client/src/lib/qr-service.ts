import QRCode from 'qrcode';

// Brand icon URLs for company logos (using data URLs for inline icons)
const brandIconMap: Record<string, string> = {
  'facebook': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzE4NzdGMiIvPgogIDxwYXRoIGQ9Ik0xNi41IDdIMTRjLS44OSAwLTEgLjM2LTEgMS4xVjEwaDNsLS41IDNIMTN2NmgtM3YtNkg4VjEwaDJWOGMwLTIuNDg1IDEuMjktNCA0LTRoMi41djN6IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  'instagram': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iaWciIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmRkNzM1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMjUlIiBzdG9wLWNvbG9yPSIjZmM0YTFhIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjZTE0ZGRlIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNzUlIiBzdG9wLWNvbG9yPSIjYzEzNTg0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzgxMzQ5NCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgcnk9IjQiIGZpbGw9InVybCgjaWcpIi8+CiAgPHJlY3QgeD0iNSIgeT0iNSIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiByeD0iNCIgcnk9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxjaXJjbGUgY3g9IjE2LjUiIGN5PSI3LjUiIHI9IjEiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
  'twitter-bird': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzFkOWJmMCIvPgogIDxwYXRoIGQ9Ik0xOCA2LjVjLS42Mi4yNy0xLjI4LjQ1LTEuOTguNTMuNzEtLjQzIDEuMjYtMS4xIDEuNTEtMS45MS0uNjcuNC0xLjQuNjktMi4xOC44NC0uNjMtLjY3LTEuNTItMS4wOC0yLjUxLTEuMDgtMS45IDAtMy40NCAxLjU0LTMuNDQgMy40NCAwIC4yNy4wMy41My4wOC43OEM3LjY5IDguMiA1LjY3IDcuMSA0LjMzIDUuMzNjLS4zLjUxLS40NyAxLjEtLjQ3IDEuNzQgMCAxLjE5LjYxIDIuMjUgMS41MyAyLjg2LS41Ni0uMDItMS4wOS0uMTctMS41NC0uNDN2LjA0YzAgMS42NyAxLjE4IDMuMDYgMi43NSAzLjM4LS4yOS4wOC0uNTkuMTItLjkuMTItLjIyIDAtLjQzLS4wMi0uNjQtLjA2LjQzIDEuMzUgMS42OSAyLjMzIDMuMTggMi4zNi0xLjE3LjkxLTIuNjUgMS40Ni00LjI1IDEuNDYtLjI4IDAtLjU1LS4wMi0uODItLjA1IDEuNTIuOTcgMy4zMyAxLjU0IDUuMjcgMS41NCA2LjMzIDAgOS44LTUuMjQgOS44LTkuNzggMC0uMTUgMC0uMy0uMDEtLjQ0LjY3LS40OSAxLjI1LTEuMDkgMS43MS0xLjc4eiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
  'twitter-x': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzAwMDAwMCIvPgogIDxwYXRoIGQ9Ik0xOC45MDEgMS4xNTNoMy42OGwtOC4wNCA5LjE5TDI0IDIyLjg0NmgtNy40MDZsLTUuOC03LjU4NC02LjYzOCA3LjU4NEguNDc0bDguNi05LjgzTDAgMS4xNTRoNy41OTRsNS4yNDMgNi45MzJaTTE3LjYxIDIwLjY0NGgyLjAzOUw2LjQ4NiAzLjI0SDQuMjk4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
  'twitter': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzFkOWJmMCIvPgogIDxwYXRoIGQ9Ik0xOCA2LjVjLS42Mi4yNy0xLjI4LjQ1LTEuOTguNTMuNzEtLjQzIDEuMjYtMS4xIDEuNTEtMS45MS0uNjcuNC0xLjQuNjktMi4xOC44NC0uNjMtLjY3LTEuNTItMS4wOC0yLjUxLTEuMDgtMS45IDAtMy40NCAxLjU0LTMuNDQgMy40NCAwIC4yNy4wMy41My4wOC43OEM3LjY5IDguMiA1LjY3IDcuMSA0LjMzIDUuMzNjLS4zLjUxLS40NyAxLjEtLjQ3IDEuNzQgMCAxLjE5LjYxIDIuMjUgMS41MyAyLjg2LS41Ni0uMDItMS4wOS0uMTctMS41NC0uNDN2LjA0YzAgMS42NyAxLjE4IDMuMDYgMi43NSAzLjM4LS4yOS4wOC0uNTkuMTItLjkuMTItLjIyIDAtLjQzLS4wMi0uNjQtLjA2LjQzIDEuMzUgMS42OSAyLjMzIDMuMTggMi4zNi0xLjE3LjkxLTIuNjUgMS40Ni00LjI1IDEuNDYtLjI4IDAtLjU1LS4wMi0uODItLjA1IDEuNTIuOTcgMy4zMyAxLjU0IDUuMjcgMS41NCA2LjMzIDAgOS44LTUuMjQgOS44LTkuNzggMC0uMTUgMC0uMy0uMDEtLjQ0LjY3LS40OSAxLjI1LTEuMDkgMS43MS0xLjc4eiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
  'linkedin': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzAwN2NiNyIvPgogIDx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPmluPC90ZXh0Pgo8L3N2Zz4K',
  'youtube': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iI2ZmMDAwMCIvPgogIDxyZWN0IHg9IjQiIHk9IjciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxMCIgcng9IjIiIHJ5PSIyIiBmaWxsPSJ3aGl0ZSIvPgogIDxwb2x5Z29uIHBvaW50cz0iMTAsMTAgMTUsMTIuNSAxMCwxNSIgZmlsbD0iI2ZmMDAwMCIvPgo8L3N2Zz4K',
  'paypal': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI1IiBmaWxsPSIjMDAzMDg3Ii8+PHBhdGggZD0iTTkgNmg0YzIuMiAwIDMuOCAxLjMgMy44IDMuNCAwIDIuNC0xLjYgNC0zLjggNGgtMi4zbC0uNyA1LjZINy41bDEuOS0xM0g5em0xLjMgMi41bC0uNyA0aDJjMS4xIDAgMS45LS43IDEuOS0yIDAtMS0uNy0yLTEuOS0yaC0xLjN6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  'zoom': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzI5ODJmZiIvPgogIDxyZWN0IHg9IjUiIHk9IjgiIHdpZHRoPSIxMCIgaGVpZ2h0PSI3IiByeD0iMiIgcnk9IjIiIGZpbGw9IndoaXRlIi8+CiAgPHBvbHlnb24gcG9pbnRzPSIxNSwxMCAyMCw3IDIwLDE3IDE1LDE0IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  'wifi': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIE91dGVybW9zdCBXaUZpIHNpZ25hbCBhcmMgLS0+CiAgPHBhdGggZD0iTTIgOC41YzUuNS01LjUgMTQuNS01LjUgMjAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjBBNUZBIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDwhLS0gTWlkZGxlIFdpRmkgc2lnbmFsIGFyYyAtLT4KICA8cGF0aCBkPSJNNSAxMS41YzQtNCAxMC00IDE0IDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYwQTVGQSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8IS0tIElubmVyIFdpRmkgc2lnbmFsIGFyYyAtLT4KICA8cGF0aCBkPSJNOC41IDE1YzIuNS0yLjUgNC41LTIuNSA3IDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYwQTVGQSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8IS0tIFdpRmkgc2lnbmFsIGRvdCAtLT4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE5IiByPSIyIiBmaWxsPSIjNjBBNUZBIi8+Cjwvc3ZnPgo=',
  'whatsapp': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI1IiByeT0iNSIgZmlsbD0iIzI1RDM2NiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMiAzLjVjLTQuNjkgMC04LjUgMy44MS04LjUgOC41IDAgMS40OC4zOCAyLjg3IDEuMDYgNC4wOGwtMS4xIDQuMDQgNC4xNS0xLjA5YzEuMTcuNjQgMi41MSAxLjAxIDMuOTQgMS4wMSA0LjY5IDAgOC41LTMuODEgOC41LTguNVMxNi42OSAzLjUgMTIgMy41eiIvPjxwYXRoIGZpbGw9IiMyNUQzNjYiIGQ9Ik0xNi43NSAxNC40M2MtLjI3LS4xNS0xLjU4LS43OC0xLjgzLS44Ny0uMjQtLjA5LS40Mi0uMTMtLjU5LjEzLS4xOC4yNy0uNjguODctLjgzIDEuMDUtLjE2LjE4LS4zMS4yLS41OC4wNy0uMjctLjEzLTEuMTMtLjQyLTIuMTYtMS4zMy0uOC0uNzEtMS4zNC0xLjU5LTEuNS0xLjg2LS4xNi0uMjctLjAyLS40MS4xMi0uNTQuMTItLjEyLjI3LS4zMS40LS40Ny4xNC0uMTYuMTktLjI3LjI4LS40NS4wOS0uMTguMDUtLjM0LS4wMi0uNDctLjA3LS4xMy0uNTktMS40Mi0uODEtMS45NS0uMjEtLjUxLS40My0uNDQtLjU5LS40NS0uMTUgMC0uMzMtLjAxLS41MS0uMDEtLjE4IDAtLjQ3LjA3LS43Mi4zNC0uMjUuMjctLjk1LjkzLS45NSAyLjI3cy45NyAyLjYzIDEuMTEgMi44MWMuMTMuMTggMS44OCAyLjg3IDQuNTYgNC4wMiAyLjY3IDEuMTUgMi42Ny43NyAzLjE1LjcyLjQ4LS4wNSAxLjU4LS42NSAxLjgtMS4yNy4yMi0uNjIuMjItMS4xNi4xNi0xLjI3LS4wNy0uMTEtLjI1LS4xOC0uNTItLjMxeiIvPjwvc3ZnPg==',
  'download': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzFFODhFNSIvPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLDEyKSBzY2FsZSgxLjIpIHRyYW5zbGF0ZSgtMTIsLTEyKSI+CiAgICA8cmVjdCB4PSIxMSIgeT0iNyIgd2lkdGg9IjIiIGhlaWdodD0iNiIgZmlsbD0id2hpdGUiLz4KICAgIDxwYXRoIGQ9Ik04IDEzIEwxMiAxNyBMMTYgMTMgWiIgZmlsbD0id2hpdGUiLz4KICA8L2c+CiAgPHJlY3QgeD0iNyIgeT0iMTciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxLjUiIHJ4PSIwLjc1IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4='
};

// Brand colors for company logos
const brandColorMap: Record<string, string> = {
  'facebook': '#1877F2',
  'instagram': '#E4405F',
  'twitter-bird': '#1DA1F2',
  'twitter-x': '#000000',
  'twitter': '#1DA1F2',
  'linkedin': '#007cb7',
  'youtube': '#FF0000',
  'paypal': '#003087',
  'zoom': '#2D8CFF',
  'wifi': '#60A5FA',
  'whatsapp': '#25D366',
  'download': '#1E88E5'
};

// Cache for loaded brand icons
const iconCache = new Map<string, HTMLImageElement>();

export type QROptions = {
  data: string;
  size?: number;
  margin?: number;
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
    gradient?: boolean;
    removeBackground?: boolean;
  };
};

export const generateQRCode = async ({
  data,
  size = 300,
  margin = 4,
  color = { dark: '#000000', light: '#ffffff' },
  errorCorrectionLevel = 'M',
  design
}: QROptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Use setTimeout to prevent UI blocking
    setTimeout(async () => {
      try {
        // Clean the input data to ensure it's valid
        const cleanData = data.trim();
        
        if (!cleanData) {
          throw new Error('QR code data cannot be empty');
        }
        
        // For image data, convert it to a more scannable format
        let finalData = cleanData;
        if (cleanData.startsWith('data:image/')) {
          finalData = await convertImageToScannable(cleanData);
        }
        
        // Generate base QR code with appropriate error correction
        const qrOptions: any = {
          width: size,
          margin: margin,
          color: color,
          errorCorrectionLevel: errorCorrectionLevel,
        };
        
        // Automatically set error correction to H when logo is present
        if (design && design.logo && design.logo !== 'none') {
          qrOptions.errorCorrectionLevel = 'H';
        }
        
        // Generate QR code with custom eye colors support and logo masking
        let qrDataUrl: string;
        
        // Check if custom eye colors are provided or logo needs masking
        if (color.innerEye || color.outerEye || (design && design.logo && design.logo !== 'none')) {
          qrDataUrl = await generateQRCodeWithCustomEyesAndLogo(finalData, qrOptions, color, design);
        } else {
          qrDataUrl = await QRCode.toDataURL(finalData, qrOptions);
        }
        
        // Apply design features using canvas manipulation (logo only now)
        if (design) {
          qrDataUrl = await applyDesignFeatures(qrDataUrl, design, size, color);
        }
        
        resolve(qrDataUrl);
      } catch (error) {
        // Error generating QR code
        
        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.message.includes('too big') || error.message.includes('data is too big')) {
            reject(new Error('Data is too large for QR code. Please use smaller content or reduce image size.'));
            return;
          }
        }
        
        reject(new Error('Failed to generate QR code. Please try with smaller content.'));
      }
    }, 0);
  });
};

// Generate SVG QR Code
export const generateQRCodeSVG = async ({
  data,
  size = 300,
  margin = 4,
  color = { dark: '#000000', light: '#ffffff' },
  errorCorrectionLevel = 'M'
}: QROptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        // Clean the input data to ensure it's valid
        const cleanData = data.trim();
        
        if (!cleanData) {
          throw new Error('QR code data cannot be empty');
        }
        
        // For image data, convert it to a more scannable format
        let finalData = cleanData;
        if (cleanData.startsWith('data:image/')) {
          finalData = await convertImageToScannable(cleanData);
        }
        
        // Generate SVG QR code with specified options
        const qrOptions: any = {
          type: 'svg',
          width: size,
          margin: margin,
          color: color,
          errorCorrectionLevel: errorCorrectionLevel,
        };
        
        // Generate SVG string
        const svgString = await QRCode.toString(finalData, qrOptions);
        
        // Convert SVG string to data URL
        const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
        
        resolve(svgDataUrl);
      } catch (error) {
        // Error generating SVG QR code
        
        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.message.includes('too big') || error.message.includes('data is too big')) {
            reject(new Error('Data is too large for QR code. Please use smaller content or reduce image size.'));
            return;
          }
        }
        
        reject(new Error('Failed to generate SVG QR code. Please try with smaller content.'));
      }
    }, 0);
  });
};

// Custom QR generation with eye colors support and logo masking
const generateQRCodeWithCustomEyesAndLogo = async (data: string, qrOptions: any, colorOptions: any, design?: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Feature detection for QRCode.create method
      const createModel = (QRCode as any).create;
      if (!createModel) {
        // QRCode.create not available, falling back to standard generation
        // Fallback to standard QR generation
        QRCode.toDataURL(data, qrOptions)
          .then(resolve)
          .catch(reject);
        return;
      }

      // Generate the QR code matrix
      const qr = createModel(data, { errorCorrectionLevel: qrOptions.errorCorrectionLevel });

      const size = qrOptions.width || 300;
      const marginModules = qrOptions.margin ?? 4;  // Quiet zone in modules
      const moduleCount = qr.modules.size;
      const totalModules = moduleCount + 2 * marginModules;
      const cellSize = Math.floor(size / totalModules);
      const actualSize = cellSize * moduleCount;
      const offset = Math.floor((size - actualSize) / 2);

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Unable to get canvas context'));
        return;
      }

      canvas.width = size;
      canvas.height = size;

      // Fill background
      ctx.fillStyle = colorOptions.light || '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Disable smoothing for crisp pixel edges
      ctx.imageSmoothingEnabled = false;

      // Calculate logo area if logo is present
      let logoArea: {x: number, y: number, width: number, height: number} | null = null;
      if (design && design.logo && design.logo !== 'none') {
        const logoSizePercent = Math.min(design.logoSize || 20, 25); // Default 20%, max 25%
        // Use the same coordinate system as logo drawing (full size, not actualSize)
        const logoPixelSize = (logoSizePercent / 100) * size;
        // Calculate how many modules the logo should span based on pixel size
        const logoModuleSize = Math.round(logoPixelSize / cellSize); // Use Math.round for consistency
        
        // Ensure logo doesn't exceed reasonable bounds
        const maxLogoModules = Math.floor(moduleCount * 0.3); // Max 30% of QR size
        const clampedLogoModuleSize = Math.min(logoModuleSize, maxLogoModules);
        
        // Calculate perfectly centered position using Math.round
        const x0 = Math.round((moduleCount - clampedLogoModuleSize) / 2);
        const y0 = Math.round((moduleCount - clampedLogoModuleSize) / 2);
        
        // Create square logo area (not circular)
        logoArea = {
          x: x0,
          y: y0,
          width: clampedLogoModuleSize,
          height: clampedLogoModuleSize
        };
      }

      // Helper function to check if a position is part of a finder pattern
      const isFinderPattern = (x: number, y: number): 'outer' | 'inner' | false => {
        // Finder patterns are 7x7 squares at (0,0), (moduleCount-7,0), (0,moduleCount-7)
        const finderPositions = [
          { x: 0, y: 0 },
          { x: moduleCount - 7, y: 0 },
          { x: 0, y: moduleCount - 7 }
        ];

        for (const finder of finderPositions) {
          const relX = x - finder.x;
          const relY = y - finder.y;

          if (relX >= 0 && relX < 7 && relY >= 0 && relY < 7) {
            // Check if it's the inner 3x3 square (center of finder pattern)
            if (relX >= 2 && relX <= 4 && relY >= 2 && relY <= 4) {
              return 'inner';
            }
            // Otherwise it's part of the outer ring
            return 'outer';
          }
        }
        return false;
      };

      // Helper function to check if a position is in the logo area
      const isInLogoArea = (x: number, y: number): boolean => {
        if (!logoArea) return false;
        return x >= logoArea.x && 
               x < logoArea.x + logoArea.width && 
               y >= logoArea.y && 
               y < logoArea.y + logoArea.height;
      };

      // Draw QR modules with custom colors and logo masking
      for (let y = 0; y < moduleCount; y++) {
        for (let x = 0; x < moduleCount; x++) {
          // Skip drawing modules in the logo area
          if (isInLogoArea(x, y)) {
            continue;
          }
          
          // Correct matrix access order: modules.get(x, y)
          if (qr.modules.get(x, y)) { // If this module should be dark
            const finderType = isFinderPattern(x, y);
            let fillColor = colorOptions.dark || '#000000'; // Default square color

            if (finderType === 'outer' && colorOptions.outerEye) {
              fillColor = colorOptions.outerEye;
            } else if (finderType === 'inner' && colorOptions.innerEye) {
              fillColor = colorOptions.innerEye;
            }

            ctx.fillStyle = fillColor;
            ctx.fillRect(
              offset + x * cellSize,
              offset + y * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }

      // Convert canvas to data URL
      resolve(canvas.toDataURL());
    } catch (error) {
      // Error in custom QR generation with logo masking, falling back to standard
      // Fallback to standard QR generation
      QRCode.toDataURL(data, qrOptions)
        .then(resolve)
        .catch(reject);
    }
  });
};

// Custom QR generation with eye colors support (legacy function)
const generateQRCodeWithCustomEyes = async (data: string, qrOptions: any, colorOptions: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Feature detection for QRCode.create method
      const createModel = (QRCode as any).create;
      if (!createModel) {
        // QRCode.create not available, falling back to standard generation
        // Fallback to standard QR generation
        QRCode.toDataURL(data, qrOptions)
          .then(resolve)
          .catch(reject);
        return;
      }

      // Generate the QR code matrix
      const qr = createModel(data, { errorCorrectionLevel: qrOptions.errorCorrectionLevel });

      const size = qrOptions.width || 300;
      const marginModules = qrOptions.margin ?? 4;  // Quiet zone in modules
      const moduleCount = qr.modules.size;
      const totalModules = moduleCount + 2 * marginModules;
      const cellSize = Math.floor(size / totalModules);
      const actualSize = cellSize * moduleCount;
      const offset = Math.floor((size - actualSize) / 2);

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Unable to get canvas context'));
        return;
      }

      canvas.width = size;
      canvas.height = size;

      // Fill background
      ctx.fillStyle = colorOptions.light || '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Disable smoothing for crisp pixel edges
      ctx.imageSmoothingEnabled = false;

      // Helper function to check if a position is part of a finder pattern
      const isFinderPattern = (x: number, y: number): 'outer' | 'inner' | false => {
        // Finder patterns are 7x7 squares at (0,0), (moduleCount-7,0), (0,moduleCount-7)
        const finderPositions = [
          { x: 0, y: 0 },
          { x: moduleCount - 7, y: 0 },
          { x: 0, y: moduleCount - 7 }
        ];

        for (const finder of finderPositions) {
          const relX = x - finder.x;
          const relY = y - finder.y;

          if (relX >= 0 && relX < 7 && relY >= 0 && relY < 7) {
            // Check if it's the inner 3x3 square (center of finder pattern)
            if (relX >= 2 && relX <= 4 && relY >= 2 && relY <= 4) {
              return 'inner';
            }
            // Otherwise it's part of the outer ring
            return 'outer';
          }
        }
        return false;
      };

      // Draw QR modules with custom colors
      for (let y = 0; y < moduleCount; y++) {
        for (let x = 0; x < moduleCount; x++) {
          // Correct matrix access order: modules.get(x, y)
          if (qr.modules.get(x, y)) { // If this module should be dark
            const finderType = isFinderPattern(x, y);
            let fillColor = colorOptions.dark || '#000000'; // Default square color

            if (finderType === 'outer' && colorOptions.outerEye) {
              fillColor = colorOptions.outerEye;
            } else if (finderType === 'inner' && colorOptions.innerEye) {
              fillColor = colorOptions.innerEye;
            }

            ctx.fillStyle = fillColor;
            ctx.fillRect(
              offset + x * cellSize,
              offset + y * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }

      // Convert canvas to data URL
      resolve(canvas.toDataURL());
    } catch (error) {
      // Error in custom eye generation, falling back to standard
      // Fallback to standard QR generation
      QRCode.toDataURL(data, qrOptions)
        .then(resolve)
        .catch(reject);
    }
  });
};

// Convert image to a more scannable format
const convertImageToScannable = async (imageData: string): Promise<string> => {
  return new Promise((resolve) => {
    if (!imageData.startsWith('data:image/')) {
      resolve(imageData);
      return;
    }
    
    try {
      // Instead of embedding the entire image, create a web-accessible URL
      // For now, we'll create a highly compressed version that can fit in a QR code
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Use very small dimensions for maximum compatibility
        const maxSize = 24; // Even smaller for better QR compatibility
        let targetWidth = maxSize;
        let targetHeight = maxSize;
        
        // Maintain aspect ratio but keep very small
        const aspectRatio = img.width / img.height;
        if (aspectRatio > 1) {
          targetHeight = Math.round(targetWidth / aspectRatio);
        } else {
          targetWidth = Math.round(targetHeight * aspectRatio);
        }
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        if (ctx) {
          // Use white background for better compression
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          // Draw the image with anti-aliasing disabled for smaller file size
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          
          // Convert to JPEG with very low quality for maximum compression
          const compressed = canvas.toDataURL('image/jpeg', 0.1);
          
          // Check if the result is still too large for QR codes
          const base64Data = compressed.split(',')[1];
          const sizeInBytes = (base64Data.length * 3) / 4;
          
          if (sizeInBytes > 800) { // Very conservative limit
            // Image too large for QR code, using text representation
            const textDescription = `IMAGE:${targetWidth}x${targetHeight}:${Date.now()}`;
            resolve(textDescription);
          } else {
            resolve(compressed);
          }
        } else {
          // Fallback to text representation
          resolve(`IMAGE:UPLOAD:${Date.now()}`);
        }
      };
      
      img.onerror = () => {
        // Failed to load image for QR conversion
        resolve(`IMAGE:ERROR:${Date.now()}`);
      };
      
      img.src = imageData;
    } catch (error) {
      // Error processing image for QR
      resolve(`IMAGE:PROCESSED:${Date.now()}`);
    }
  });
};

const applyDesignFeatures = async (qrDataUrl: string, design: any, size: number, color: any): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(qrDataUrl);
      return;
    }
    
    // Set canvas size to match QR size
    const canvasSize = size;
    const qrOffset = 0;
    
    // Set canvas size
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    const img = new Image();
    img.onload = () => {
      // Fill background
      ctx.fillStyle = color.light;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      
      // Apply gradient background to QR area if enabled
      if (design.gradient) {
        const gradient = ctx.createLinearGradient(qrOffset, qrOffset, qrOffset + size, qrOffset + size);
        gradient.addColorStop(0, color.light);
        gradient.addColorStop(1, adjustColorBrightness(color.light, -20));
        ctx.fillStyle = gradient;
        ctx.fillRect(qrOffset, qrOffset, size, size);
      }
      
      // Draw the base QR code
      ctx.drawImage(img, qrOffset, qrOffset, size, size);
      
      // Draw logo if selected
      if (design.logo && design.logo !== 'none') {
        // Calculate perfectly centered logo position using Math.round
        const centerX = Math.round(canvasSize / 2);
        const centerY = Math.round(canvasSize / 2);
        
        // Check if it's a brand icon first
        if (brandIconMap[design.logo]) {
          const brandIconUrl = brandIconMap[design.logo];
          const brandColor = brandColorMap[design.logo] || '#6B7280';
          
          // Check cache first
          if (iconCache.has(design.logo)) {
            const cachedImg = iconCache.get(design.logo)!;
            drawLogoWithBackground(ctx, cachedImg, centerX, centerY, size, design.logoSize, design.logoOpacity, brandColor, true, design.removeBackground, design.logo);
            resolve(canvas.toDataURL());
          } else {
            // Load brand icon
            const logoImg = new Image();
            // Set explicit dimensions for SVG data URLs to prevent dimension issues
            logoImg.width = 24;
            logoImg.height = 24;
            
            logoImg.onload = () => {
              // Brand icon loaded successfully
              
              // Check if SVG loaded properly with actual dimensions
              if (logoImg.naturalWidth === 0 || logoImg.naturalHeight === 0) {
                // Brand icon has zero natural dimensions, falling back to text logo
                drawLogo(ctx, design.logo, centerX, centerY, size, design.logoSize, design.logoOpacity, design.removeBackground);
                resolve(canvas.toDataURL());
                return;
              }
              
              iconCache.set(design.logo, logoImg);
              drawLogoWithBackground(ctx, logoImg, centerX, centerY, size, design.logoSize, design.logoOpacity, brandColor, true, design.removeBackground, design.logo);
              resolve(canvas.toDataURL());
            };
            logoImg.onerror = (error) => {
              // Brand icon failed to load
              // Fallback to text/emoji rendering
              drawLogo(ctx, design.logo, centerX, centerY, size, design.logoSize, design.logoOpacity, design.removeBackground);
              resolve(canvas.toDataURL());
            };
            // For SVG data URLs, we need to ensure proper loading
            logoImg.crossOrigin = 'anonymous';
            logoImg.src = brandIconUrl;
          }
        }
        // For custom logos (images), we need to handle async loading
        else if (design.logo.startsWith('data:image/')) {
          const logoImg = new Image();
          logoImg.onload = () => {
            drawLogoWithBackground(ctx, logoImg, centerX, centerY, size, design.logoSize, design.logoOpacity, '#ffffff', false, design.removeBackground, 'custom');
            resolve(canvas.toDataURL());
          };
          logoImg.onerror = () => {
            // Fallback if image fails to load
            resolve(canvas.toDataURL());
          };
          logoImg.src = design.logo;
        } else {
          // For emojis and text logos, draw immediately
          drawLogo(ctx, design.logo, centerX, centerY, size, design.logoSize, design.logoOpacity, design.removeBackground);
          resolve(canvas.toDataURL());
        }
      } else {
        resolve(canvas.toDataURL());
      }
    };
    img.src = qrDataUrl;
  });
};

// Helper function to adjust color brightness for gradient
const adjustColorBrightness = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};


// Helper function to draw rounded rectangle
const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

// Helper function to create rounded rectangle path
const roundRectPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
};

// Helper function to adjust color opacity
const adjustColorOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};











const drawLogo = (ctx: CanvasRenderingContext2D, logoType: string, x: number, y: number, qrSize: number, customLogoSize?: number, customOpacity?: number, removeBackground: boolean = false) => {
  // Cap logo size to 30% of QR width for scan reliability
  const logoSizePercent = Math.min(customLogoSize || 15, 30);
  const opacity = (customOpacity || 100) / 100;
  const logoSize = (logoSizePercent / 100) * qrSize;
  
  // Draw white background square for logo (only if removeBackground is false)
  ctx.save();
  ctx.globalAlpha = opacity;
  
  if (!removeBackground) {
    ctx.fillStyle = '#ffffff';
    const bgSize = logoSize + 12; // Add padding
    ctx.fillRect(x - bgSize/2, y - bgSize/2, bgSize, bgSize);
    
    // Draw border around logo area
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - bgSize/2, y - bgSize/2, bgSize, bgSize);
  }
  
  // Custom logo images are handled separately in applyDesignFeatures
  if (logoType.startsWith('data:image/')) {
    return; // This will be handled by drawLogoImage function
  }
  
  // Check if it's a custom emoji (not in predefined list and looks like emoji)
  const logoEmojis: { [key: string]: string } = {
    link: '🔗',
    location: '📍',
    email: '✉️',
    phone: '📞',
    wifi: '📶',
    vcard: '👤',
    'enhanced-vcard': '🪪',
    // Social media fallback emojis
    whatsapp: '💬',
    facebook: '📘', 
    instagram: '📷',
    twitter: '🐦',
    linkedin: '💼',
    youtube: '📺',
    paypal: '💳',
    zoom: '🎥'
  };
  
  // Draw logo based on type
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (logoEmojis[logoType]) {
    // Predefined emoji
    ctx.font = `${logoSize * 0.7}px Arial`;
    ctx.fillText(logoEmojis[logoType], x, y);
  } else if (logoType.length <= 4 && logoType.trim().length > 0) {
    // Custom emoji - check if it looks like an emoji
    ctx.font = `${logoSize * 0.7}px Arial`;
    ctx.fillText(logoType, x, y);
  } else {
    // Fallback: show first letter for text logos
    ctx.font = `bold ${logoSize * 0.4}px Arial`;
    ctx.fillText(logoType.charAt(0).toUpperCase(), x, y);
  }
  
  ctx.restore();
};

// Enhanced function to handle logo images with proper background
const drawLogoWithBackground = (
  ctx: CanvasRenderingContext2D, 
  logoImg: HTMLImageElement, 
  x: number, 
  y: number, 
  qrSize: number, 
  customLogoSize?: number, 
  customOpacity?: number,
  backgroundColor: string = '#ffffff',
  isBrandIcon: boolean = false,
  removeBackground: boolean = false,
  logoId?: string
) => {
  // Cap logo size to 30% of QR width for scan reliability
  const logoSizePercent = Math.min(customLogoSize || 20, 30); // Default 20%, max 30%
  const opacity = (customOpacity || 100) / 100;
  const logoSize = (logoSizePercent / 100) * qrSize;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  
  // For brand SVG icons, ALWAYS use rounded corners regardless of removeBackground setting
  const useBrandRoundedStyle = isBrandIcon;
  const cornerRadius = useBrandRoundedStyle ? Math.round(logoSize * 0.22) : 0;
  
  // Draw background and border for brand icons (always rounded) or non-brand when removeBackground is false
  if (useBrandRoundedStyle || !removeBackground) {
    const bgSize = logoSize + 8; // Add padding
    const innerBgSize = logoSize + 4;
    
    if (useBrandRoundedStyle) {
      // Brand icons: Always draw rounded background
      // Draw white background with rounded corners
      ctx.fillStyle = '#ffffff';
      roundRectPath(ctx, x - bgSize/2, y - bgSize/2, bgSize, bgSize, cornerRadius);
      ctx.fill();
      
      // Draw colored background for brand icons (skip for stroke-only icons like WiFi)
      if (backgroundColor !== '#ffffff' && logoId !== 'wifi') {
        ctx.fillStyle = backgroundColor;
        roundRectPath(ctx, x - innerBgSize/2, y - innerBgSize/2, innerBgSize, innerBgSize, cornerRadius * 0.9);
        ctx.fill();
      }
      
      // Draw subtle border with rounded corners
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      roundRectPath(ctx, x - bgSize/2, y - bgSize/2, bgSize, bgSize, cornerRadius);
      ctx.stroke();
    } else {
      // Non-brand icons: Draw square background when removeBackground is false
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - bgSize/2, y - bgSize/2, bgSize, bgSize);
      
      // Draw subtle border
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - bgSize/2, y - bgSize/2, bgSize, bgSize);
    }
  }
  
  // Create clipping path for the logo (rounded for brand icons, square for others)
  if (useBrandRoundedStyle) {
    roundRectPath(ctx, x - logoSize/2, y - logoSize/2, logoSize, logoSize, cornerRadius);
  } else {
    ctx.beginPath();
    ctx.rect(x - logoSize/2, y - logoSize/2, logoSize, logoSize);
  }
  ctx.clip();
  
  // Draw the logo image
  const imgSize = logoSize - 2; // Slightly smaller for padding
  ctx.drawImage(logoImg, x - imgSize/2, y - imgSize/2, imgSize, imgSize);
  ctx.restore();
};

// Backward compatibility function
const drawLogoImage = (ctx: CanvasRenderingContext2D, logoImg: HTMLImageElement, x: number, y: number, qrSize: number, customLogoSize?: number, customOpacity?: number) => {
  drawLogoWithBackground(ctx, logoImg, x, y, qrSize, customLogoSize, customOpacity, '#ffffff', false, false, 'legacy');
};

export const createUrlQR = (url: string): string => {
  // Accept all types of URLs and links without strict validation
  // This includes social media profiles, YouTube links, etc.
  if (!url) return '';
  
  // Clean and normalize the URL
  let cleanUrl = url.trim();
  
  // If no protocol is specified, add https://
  if (!/^[a-zA-Z][a-zA-Z\d+\.-]*:/.test(cleanUrl)) {
    cleanUrl = `https://${cleanUrl}`;
  }
  
  return cleanUrl;
};

export const createEmailQR = (email: string, subject?: string, body?: string): string => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return '';
  }
  
  // Don't encode the email in the main mailto part
  let mailtoLink = `mailto:${email}`;
  
  const params: string[] = [];
  if (subject && subject.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`);
  if (body && body.trim()) params.push(`body=${encodeURIComponent(body.trim())}`);
  
  if (params.length > 0) {
    mailtoLink += '?' + params.join('&');
  }
  
  return mailtoLink;
};

export const createPhoneQR = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Keep the phone number format more flexible, just remove spaces and special chars except + and -
  const cleaned = phoneNumber.replace(/[^\d+\-]/g, '');
  
  if (!cleaned) {
    return '';
  }
  
  return `tel:${cleaned}`;
};

export const createTextQR = (text: string): string => {
  return text;
};

export const createSMSQR = (phoneNumber: string, message?: string): string => {
  if (!phoneNumber) return '';
  
  // Keep the phone number format more flexible
  const cleaned = phoneNumber.replace(/[^\d+\-]/g, '');
  
  if (!cleaned) {
    return '';
  }
  
  // Use SMS format that opens app directly without permission prompts
  if (message && message.trim()) {
    return `sms:${cleaned}?body=${encodeURIComponent(message.trim())}`;
  }
  return `sms:${cleaned}`;
};

export const createWhatsAppQR = (phoneNumber: string, message?: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digits except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Remove + from the beginning if present, as wa.me expects number without +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  if (!cleaned) {
    return '';
  }
  
  let whatsappUrl = `https://wa.me/${cleaned}`;
  if (message && message.trim()) {
    whatsappUrl += `?text=${encodeURIComponent(message.trim())}`;
  }
  
  return whatsappUrl;
};

export const createWiFiQR = (ssid: string, password: string, security: string = 'WPA'): string => {
  if (!ssid || !ssid.trim()) {
    return '';
  }
  
  // Escape special characters in SSID and password
  const escapedSSID = ssid.replace(/([;,:"\\])/g, '\\$1');
  const escapedPassword = password ? password.replace(/([;,:"\\])/g, '\\$1') : '';
  
  return `WIFI:T:${security};S:${escapedSSID};P:${escapedPassword};;`;
};

export const createVCardQR = (name: string, phone?: string, email?: string, organization?: string): string => {
  if (!name || !name.trim()) {
    return '';
  }
  
  let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name.trim()}`;
  
  if (phone && phone.trim()) {
    vcard += `\nTEL:${phone.trim()}`;
  }
  if (email && email.trim()) {
    vcard += `\nEMAIL:${email.trim()}`;
  }
  if (organization && organization.trim()) {
    vcard += `\nORG:${organization.trim()}`;
  }
  
  vcard += '\nEND:VCARD';
  
  return vcard;
};

export const createEventQR = (title: string, location?: string, description?: string, startDate?: string, endDate?: string): string => {
  if (!title || !title.trim()) {
    return '';
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const params = new URLSearchParams();
  params.append('text', title.trim());
  
  if (location && location.trim()) {
    params.append('location', location.trim());
  }
  if (description && description.trim()) {
    params.append('details', description.trim());
  }
  if (startDate) {
    params.append('dates', `${formatDate(startDate)}/${endDate ? formatDate(endDate) : formatDate(startDate)}`);
  }
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
};

export const createImageQR = (imageData: string): string => {
  if (!imageData) {
    return '';
  }
  
  // Return the image data directly - it will be processed in generateQRCode
  return imageData;
};


export const createPayPalQR = (
  email: string,
  paymentType: string = 'Buy now',
  itemName?: string,
  itemId?: string,
  price?: string,
  currency: string = 'USD',
  shipping?: string,
  taxRate?: string
): string => {
  if (!email || !email.trim()) {
    return '';
  }
  
  // Create PayPal payment URL
  const baseUrl = 'https://www.paypal.com/cgi-bin/webscr';
  const params = new URLSearchParams();
  
  params.append('cmd', '_xclick');
  params.append('business', email.trim());
  
  if (itemName && itemName.trim()) {
    params.append('item_name', itemName.trim());
  }
  
  if (itemId && itemId.trim()) {
    params.append('item_number', itemId.trim());
  }
  
  if (price && price.trim()) {
    params.append('amount', price.trim());
  }
  
  params.append('currency_code', currency);
  
  if (shipping && shipping.trim()) {
    params.append('shipping', shipping.trim());
  }
  
  if (taxRate && taxRate.trim()) {
    params.append('tax_rate', taxRate.trim());
  }
  
  return `${baseUrl}?${params.toString()}`;
};

export const createEnhancedVCardQR = (
  version: string = '3.0',
  title?: string,
  firstName?: string,
  lastName?: string,
  phoneHome?: string,
  phoneMobile?: string,
  phoneOffice?: string,
  fax?: string,
  email?: string,
  website?: string,
  company?: string,
  jobTitle?: string,
  address?: string,
  city?: string,
  state?: string,
  postalCode?: string,
  country?: string
): string => {
  // At least first name or last name is required
  if ((!firstName || !firstName.trim()) && (!lastName || !lastName.trim())) {
    return '';
  }
  
  let vcard = `BEGIN:VCARD\nVERSION:${version}`;
  
  // Full name
  const fullName = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(' ');
  if (fullName) {
    vcard += `\nFN:${fullName}`;
  }
  
  // Name components
  if (lastName?.trim() || firstName?.trim()) {
    vcard += `\nN:${lastName?.trim() || ''};${firstName?.trim() || ''};;;`;
  }
  
  // Title
  if (title && title.trim()) {
    vcard += `\nTITLE:${title.trim()}`;
  }
  
  // Phone numbers
  if (phoneHome && phoneHome.trim()) {
    vcard += `\nTEL;TYPE=HOME:${phoneHome.trim()}`;
  }
  if (phoneMobile && phoneMobile.trim()) {
    vcard += `\nTEL;TYPE=CELL:${phoneMobile.trim()}`;
  }
  if (phoneOffice && phoneOffice.trim()) {
    vcard += `\nTEL;TYPE=WORK:${phoneOffice.trim()}`;
  }
  if (fax && fax.trim()) {
    vcard += `\nTEL;TYPE=FAX:${fax.trim()}`;
  }
  
  // Email
  if (email && email.trim()) {
    vcard += `\nEMAIL:${email.trim()}`;
  }
  
  // Website
  if (website && website.trim()) {
    let cleanWebsite = website.trim();
    if (!/^[a-zA-Z][a-zA-Z\d+\.-]*:/.test(cleanWebsite)) {
      cleanWebsite = `https://${cleanWebsite}`;
    }
    vcard += `\nURL:${cleanWebsite}`;
  }
  
  // Organization and job title
  if (company && company.trim()) {
    vcard += `\nORG:${company.trim()}`;
  }
  if (jobTitle && jobTitle.trim()) {
    vcard += `\nTITLE:${jobTitle.trim()}`;
  }
  
  // Address
  if (address || city || state || postalCode || country) {
    const addressParts = [
      '', // Post office box (empty)
      '', // Extended address (empty)
      address?.trim() || '',
      city?.trim() || '',
      state?.trim() || '',
      postalCode?.trim() || '',
      country?.trim() || ''
    ];
    vcard += `\nADR:${addressParts.join(';')}`;
  }
  
  vcard += '\nEND:VCARD';
  
  return vcard;
};

export const createZoomQR = (meetingId: string, password?: string): string => {
  if (!meetingId || !meetingId.trim()) {
    return '';
  }
  
  const cleanMeetingId = meetingId.trim().replace(/\s+/g, '');
  
  // Create Zoom meeting URL
  let zoomUrl = `https://zoom.us/j/${cleanMeetingId}`;
  
  if (password && password.trim()) {
    zoomUrl += `?pwd=${password.trim()}`;
  }
  
  return zoomUrl;
};
