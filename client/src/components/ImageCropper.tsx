import { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crop, X } from 'lucide-react';

interface ImageCropperProps {
  imageDataUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageDataUrl: string) => void;
}

interface CropArea {
  x: number;
  y: number;
  size: number;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | null;

export const ImageCropper = ({ imageDataUrl, isOpen, onClose, onCropComplete }: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, size: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  // Load image
  useEffect(() => {
    if (!imageDataUrl) return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      
      // Calculate initial scale to fit canvas
      const canvasSize = 400;
      const scale = Math.min(canvasSize / img.width, canvasSize / img.height);
      setImageScale(scale);
      
      // Center image
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      setImageOffset({
        x: (canvasSize - scaledWidth) / 2,
        y: (canvasSize - scaledHeight) / 2
      });
      
      // Set initial crop area to center, limited by smaller dimension
      const maxCropSize = Math.min(scaledWidth, scaledHeight);
      const initialSize = Math.min(200, maxCropSize);
      setCropArea({
        x: (canvasSize - initialSize) / 2,
        y: (canvasSize - initialSize) / 2,
        size: initialSize
      });
    };
    img.src = imageDataUrl;
  }, [imageDataUrl]);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(
      image,
      imageOffset.x,
      imageOffset.y,
      image.width * imageScale,
      image.height * imageScale
    );

    // Draw overlay (darken area outside crop)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, cropArea.y);
    ctx.fillRect(0, cropArea.y, cropArea.x, cropArea.size);
    ctx.fillRect(cropArea.x + cropArea.size, cropArea.y, canvas.width - cropArea.x - cropArea.size, cropArea.size);
    ctx.fillRect(0, cropArea.y + cropArea.size, canvas.width, canvas.height - cropArea.y - cropArea.size);

    // Draw crop area border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.size, cropArea.size);

    // Draw corner handles
    const handleSize = 12;
    const corners = [
      { x: cropArea.x, y: cropArea.y }, // nw
      { x: cropArea.x + cropArea.size, y: cropArea.y }, // ne
      { x: cropArea.x, y: cropArea.y + cropArea.size }, // sw
      { x: cropArea.x + cropArea.size, y: cropArea.y + cropArea.size } // se
    ];

    corners.forEach(corner => {
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(corner.x - handleSize / 2, corner.y - handleSize / 2, handleSize, handleSize);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(corner.x - handleSize / 2, corner.y - handleSize / 2, handleSize, handleSize);
    });
  }, [image, cropArea, imageOffset, imageScale]);

  const getResizeHandle = (x: number, y: number): ResizeHandle => {
    const handleSize = 12;
    const tolerance = handleSize;

    if (Math.abs(x - cropArea.x) < tolerance && Math.abs(y - cropArea.y) < tolerance) return 'nw';
    if (Math.abs(x - (cropArea.x + cropArea.size)) < tolerance && Math.abs(y - cropArea.y) < tolerance) return 'ne';
    if (Math.abs(x - cropArea.x) < tolerance && Math.abs(y - (cropArea.y + cropArea.size)) < tolerance) return 'sw';
    if (Math.abs(x - (cropArea.x + cropArea.size)) < tolerance && Math.abs(y - (cropArea.y + cropArea.size)) < tolerance) return 'se';

    return null;
  };

  const isInsideCropArea = (x: number, y: number): boolean => {
    return x >= cropArea.x && x <= cropArea.x + cropArea.size &&
           y >= cropArea.y && y <= cropArea.y + cropArea.size;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const handle = getResizeHandle(x, y);
    if (handle) {
      setIsResizing(handle);
      setDragStart({ x, y });
    } else if (isInsideCropArea(x, y)) {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    } else {
      // Drag the image if clicked outside crop area
      setIsDraggingImage(true);
      setDragStart({ x: x - imageOffset.x, y: y - imageOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate image bounds
    const imgWidth = image.width * imageScale;
    const imgHeight = image.height * imageScale;
    const imgRight = imageOffset.x + imgWidth;
    const imgBottom = imageOffset.y + imgHeight;

    // Update cursor
    const handle = getResizeHandle(x, y);
    if (handle) {
      const cursors = { nw: 'nw-resize', ne: 'ne-resize', sw: 'sw-resize', se: 'se-resize' };
      canvas.style.cursor = cursors[handle];
    } else if (isInsideCropArea(x, y)) {
      canvas.style.cursor = 'move';
    } else {
      canvas.style.cursor = 'grab';
    }

    if (isDraggingImage) {
      // Drag the image (constrained so crop area stays within image)
      let newX = x - dragStart.x;
      let newY = y - dragStart.y;
      
      // Ensure image covers the entire crop area
      // Image left edge must be <= crop left edge
      newX = Math.min(newX, cropArea.x);
      // Image right edge must be >= crop right edge
      newX = Math.max(newX, cropArea.x + cropArea.size - imgWidth);
      // Image top edge must be <= crop top edge
      newY = Math.min(newY, cropArea.y);
      // Image bottom edge must be >= crop bottom edge
      newY = Math.max(newY, cropArea.y + cropArea.size - imgHeight);
      
      setImageOffset({ x: newX, y: newY });
      canvas.style.cursor = 'grabbing';
    } else if (isDragging) {
      // Move crop area (constrained to image bounds)
      let newX = x - dragStart.x;
      let newY = y - dragStart.y;
      
      // Constrain to image bounds
      newX = Math.max(imageOffset.x, Math.min(newX, imgRight - cropArea.size));
      newY = Math.max(imageOffset.y, Math.min(newY, imgBottom - cropArea.size));
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      // Resize from corner (maintain square aspect ratio, constrained to image bounds)
      const maxSize = Math.min(imgWidth, imgHeight);
      let newSize = cropArea.size;
      let newX = cropArea.x;
      let newY = cropArea.y;

      if (isResizing === 'se') {
        // Bottom-right corner
        const maxSizeFromPos = Math.min(
          imgRight - cropArea.x,
          imgBottom - cropArea.y
        );
        newSize = Math.min(x - cropArea.x, y - cropArea.y, maxSizeFromPos);
      } else if (isResizing === 'sw') {
        // Bottom-left corner
        const maxSizeFromPos = Math.min(
          cropArea.x + cropArea.size - imageOffset.x,
          imgBottom - cropArea.y
        );
        const potentialSize = Math.min(cropArea.x + cropArea.size - x, y - cropArea.y, maxSizeFromPos);
        newSize = potentialSize;
        newX = cropArea.x + cropArea.size - newSize;
      } else if (isResizing === 'ne') {
        // Top-right corner
        const maxSizeFromPos = Math.min(
          imgRight - cropArea.x,
          cropArea.y + cropArea.size - imageOffset.y
        );
        const potentialSize = Math.min(x - cropArea.x, cropArea.y + cropArea.size - y, maxSizeFromPos);
        newSize = potentialSize;
        newY = cropArea.y + cropArea.size - newSize;
      } else if (isResizing === 'nw') {
        // Top-left corner
        const maxSizeFromPos = Math.min(
          cropArea.x + cropArea.size - imageOffset.x,
          cropArea.y + cropArea.size - imageOffset.y
        );
        const deltaX = cropArea.x - x;
        const deltaY = cropArea.y - y;
        const potentialSize = Math.min(cropArea.size + Math.min(deltaX, deltaY), maxSizeFromPos);
        newSize = potentialSize;
        newX = cropArea.x + cropArea.size - newSize;
        newY = cropArea.y + cropArea.size - newSize;
      }

      // Ensure minimum size
      newSize = Math.max(50, newSize);

      // Ensure within image bounds
      newX = Math.max(imageOffset.x, Math.min(newX, imgRight - newSize));
      newY = Math.max(imageOffset.y, Math.min(newY, imgBottom - newSize));

      setCropArea({ x: newX, y: newY, size: newSize });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingImage(false);
    setIsResizing(null);
  };

  const handleCrop = () => {
    if (!canvasRef.current || !image) return;

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    // Set canvas size to crop area size
    cropCanvas.width = cropArea.size;
    cropCanvas.height = cropArea.size;

    // Calculate source coordinates on the original image
    const sourceX = (cropArea.x - imageOffset.x) / imageScale;
    const sourceY = (cropArea.y - imageOffset.y) / imageScale;
    const sourceSize = cropArea.size / imageScale;

    // Draw the cropped portion
    cropCtx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      cropArea.size,
      cropArea.size
    );

    // Convert to data URL
    const croppedDataUrl = cropCanvas.toDataURL('image/png', 0.9);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Crop Your Logo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border border-gray-300 rounded bg-white"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>Drag corners</strong> to resize the crop area (maintains square shape)</p>
            <p>• <strong>Drag inside</strong> the crop box to reposition it</p>
            <p>• <strong>Drag outside</strong> the crop box to move the image</p>
            <p>• The cropped portion will be used as your QR code logo</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleCrop} className="bg-blue-600 hover:bg-blue-700">
            <Crop className="h-4 w-4 mr-2" />
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
