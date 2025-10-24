
declare module 'qrcode' {
  export interface QRCodeRenderersOptions {
    margin?: number;
    scale?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }

  export interface QRCodeModule {
    get(x: number, y: number): boolean;
    size: number;
    data: Uint8Array;
  }

  export interface QRCodeObject {
    modules: QRCodeModule;
    version: number;
    errorCorrectionLevel: string;
    maskPattern: number;
    segments: any[];
  }

  export function create(
    text: string,
    options?: { errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' }
  ): QRCodeObject;

  export function toCanvas(
    canvasElement: HTMLCanvasElement,
    text: string,
    options?: QRCodeRenderersOptions
  ): Promise<HTMLCanvasElement>;

  export function toDataURL(
    text: string,
    options?: QRCodeRenderersOptions
  ): Promise<string>;

  export function toString(
    text: string,
    options?: QRCodeRenderersOptions
  ): Promise<string>;
}
