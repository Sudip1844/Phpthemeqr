
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Check, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { validateImageFile } from '@/lib/image-utils';
import { toast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onImageUpload: (imageDataUrl: string) => void;
  onImageRemove: () => void;
  currentImage?: string;
  label?: string;
  maxWidth?: number;
  maxHeight?: number;
  enableCropping?: boolean;
}

interface CropArea {
  x: number;
  y: number;
  size: number;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | null;
type CropState = 'idle' | 'loading' | 'preview' | 'cropping';

export const ImageUpload = ({
  onImageUpload,
  onImageRemove,
  currentImage,
  label = "Upload Image",
  maxWidth = 200,
  maxHeight = 200,
  enableCropping = false
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [cropState, setCropState] = useState<CropState>('idle');
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Canvas and cropping states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, size: 100 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [initialCropState, setInitialCropState] = useState<CropArea | null>(null);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  // Set state based on whether there's a current image
  useEffect(() => {
    if (currentImage && !originalImageUrl && cropState === 'idle') {
      setCropState('preview');
    } else if (!currentImage && !originalImageUrl) {
      setCropState('idle');
    }
  }, [currentImage, originalImageUrl, cropState]);

  const handleFileProcess = useCallback(async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setCropState('loading');
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        if (enableCropping) {
          // Store original image and show preview
          setOriginalImageUrl(dataUrl);
          // Immediately upload the full image for preview
          onImageUpload(dataUrl);
          setCropState('preview');
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
        } else {
          // Direct upload without cropping
          onImageUpload(dataUrl);
          setCropState('preview');
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
        }
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
        setCropState('idle');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
      setCropState('idle');
    }
  }, [onImageUpload, enableCropping]);

  // Open cropping mode
  const handleOpenCropping = () => {
    if (!originalImageUrl) return;
    setCropState('cropping');
  };

  // Load image for cropping
  useEffect(() => {
    if (!originalImageUrl || cropState !== 'cropping') return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      
      // Set canvas size to match image aspect ratio, max 600px
      const maxCanvasSize = 600;
      const aspectRatio = img.width / img.height;
      let newCanvasWidth, newCanvasHeight;
      
      if (aspectRatio > 1) {
        // Landscape
        newCanvasWidth = Math.min(maxCanvasSize, img.width);
        newCanvasHeight = newCanvasWidth / aspectRatio;
      } else {
        // Portrait or square
        newCanvasHeight = Math.min(maxCanvasSize, img.height);
        newCanvasWidth = newCanvasHeight * aspectRatio;
      }
      
      setCanvasSize({ width: newCanvasWidth, height: newCanvasHeight });
      
      // Calculate scale to fit image exactly to canvas
      const scale = newCanvasWidth / img.width;
      setImageScale(scale);
      
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      // Image fills entire canvas, no offset needed
      setImageOffset({ x: 0, y: 0 });
      
      // Set initial crop area to center, limited by smaller dimension
      const maxCropSize = Math.min(scaledWidth, scaledHeight);
      const initialSize = Math.min(200, maxCropSize);
      setCropArea({
        x: (scaledWidth - initialSize) / 2,
        y: (scaledHeight - initialSize) / 2,
        size: initialSize
      });
    };
    img.src = originalImageUrl;
  }, [originalImageUrl, cropState]);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current || !image || cropState !== 'cropping') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      imageOffset.x,
      imageOffset.y,
      image.width * imageScale,
      image.height * imageScale
    );

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, cropArea.y);
    ctx.fillRect(0, cropArea.y, cropArea.x, cropArea.size);
    ctx.fillRect(cropArea.x + cropArea.size, cropArea.y, canvas.width - cropArea.x - cropArea.size, cropArea.size);
    ctx.fillRect(0, cropArea.y + cropArea.size, canvas.width, canvas.height - cropArea.y - cropArea.size);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.size, cropArea.size);

    const handleSize = 16;
    const corners = [
      { x: cropArea.x, y: cropArea.y },
      { x: cropArea.x + cropArea.size, y: cropArea.y },
      { x: cropArea.x, y: cropArea.y + cropArea.size },
      { x: cropArea.x + cropArea.size, y: cropArea.y + cropArea.size }
    ];

    corners.forEach(corner => {
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(corner.x - handleSize / 2, corner.y - handleSize / 2, handleSize, handleSize);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(corner.x - handleSize / 2, corner.y - handleSize / 2, handleSize, handleSize);
    });
  }, [image, cropArea, imageOffset, imageScale, cropState]);

  const getResizeHandle = (x: number, y: number): ResizeHandle => {
    const handleSize = 16;
    const tolerance = handleSize + 4;

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
      setInitialCropState({ ...cropArea });
    } else if (isInsideCropArea(x, y)) {
      setIsDraggingCrop(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    } else {
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

    const imgWidth = image.width * imageScale;
    const imgHeight = image.height * imageScale;
    const imgRight = imageOffset.x + imgWidth;
    const imgBottom = imageOffset.y + imgHeight;

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
      let newX = x - dragStart.x;
      let newY = y - dragStart.y;
      
      newX = Math.min(newX, cropArea.x);
      newX = Math.max(newX, cropArea.x + cropArea.size - imgWidth);
      newY = Math.min(newY, cropArea.y);
      newY = Math.max(newY, cropArea.y + cropArea.size - imgHeight);
      
      setImageOffset({ x: newX, y: newY });
      canvas.style.cursor = 'grabbing';
    } else if (isDraggingCrop) {
      let newX = x - dragStart.x;
      let newY = y - dragStart.y;
      
      newX = Math.max(imageOffset.x, Math.min(newX, imgRight - cropArea.size));
      newY = Math.max(imageOffset.y, Math.min(newY, imgBottom - cropArea.size));
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing && initialCropState) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      let newSize = cropArea.size;
      let newX = cropArea.x;
      let newY = cropArea.y;

      if (isResizing === 'se') {
        // Bottom-right: grow to the right and down
        const delta = Math.min(deltaX, deltaY);
        newSize = Math.max(50, initialCropState.size + delta);
        newX = initialCropState.x;
        newY = initialCropState.y;
        
        // Constrain to image bounds
        const maxSizeFromPos = Math.min(imgRight - newX, imgBottom - newY);
        newSize = Math.min(newSize, maxSizeFromPos);
      } else if (isResizing === 'sw') {
        // Bottom-left: grow left and down
        const delta = Math.min(-deltaX, deltaY);
        newSize = Math.max(50, initialCropState.size + delta);
        newX = initialCropState.x + initialCropState.size - newSize;
        newY = initialCropState.y;
        
        // Constrain to image bounds
        newX = Math.max(imageOffset.x, newX);
        const maxSizeFromY = imgBottom - newY;
        newSize = Math.min(newSize, maxSizeFromY, initialCropState.x + initialCropState.size - imageOffset.x);
      } else if (isResizing === 'ne') {
        // Top-right: grow right and up
        const delta = Math.min(deltaX, -deltaY);
        newSize = Math.max(50, initialCropState.size + delta);
        newX = initialCropState.x;
        newY = initialCropState.y + initialCropState.size - newSize;
        
        // Constrain to image bounds
        newY = Math.max(imageOffset.y, newY);
        const maxSizeFromX = imgRight - newX;
        newSize = Math.min(newSize, maxSizeFromX, initialCropState.y + initialCropState.size - imageOffset.y);
      } else if (isResizing === 'nw') {
        // Top-left: grow left and up
        const delta = Math.min(-deltaX, -deltaY);
        newSize = Math.max(50, initialCropState.size + delta);
        newX = initialCropState.x + initialCropState.size - newSize;
        newY = initialCropState.y + initialCropState.size - newSize;
        
        // Constrain to image bounds
        newX = Math.max(imageOffset.x, newX);
        newY = Math.max(imageOffset.y, newY);
        const maxSize = Math.min(
          initialCropState.x + initialCropState.size - imageOffset.x,
          initialCropState.y + initialCropState.size - imageOffset.y
        );
        newSize = Math.min(newSize, maxSize);
      }

      // Final bounds check
      newSize = Math.max(50, newSize);
      newX = Math.max(imageOffset.x, Math.min(newX, imgRight - newSize));
      newY = Math.max(imageOffset.y, Math.min(newY, imgBottom - newSize));

      setCropArea({ x: newX, y: newY, size: newSize });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCrop(false);
    setIsDraggingImage(false);
    setIsResizing(null);
    setInitialCropState(null);
  };

  // Touch event handlers for mobile support with pinch zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    if (e.touches.length === 2) {
      // Pinch zoom with two fingers
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setLastTouchDistance(distance);
      return;
    }

    if (e.touches.length !== 1) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const handle = getResizeHandle(x, y);
    if (handle) {
      setIsResizing(handle);
      setDragStart({ x, y });
      setInitialCropState({ ...cropArea });
    } else if (isInsideCropArea(x, y)) {
      setIsDraggingCrop(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    } else {
      setIsDraggingImage(true);
      setDragStart({ x: x - imageOffset.x, y: y - imageOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    // Handle pinch zoom with two fingers
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scaleDelta = distance / lastTouchDistance;
      const newScale = imageScale * scaleDelta;
      
      // Calculate dynamic minimum scale to ensure image always covers crop area
      const minScaleX = cropArea.size / image.width;
      const minScaleY = cropArea.size / image.height;
      const dynamicMinScale = Math.max(minScaleX, minScaleY);
      
      // Constrain scale between dynamic minimum and 3x
      const clampedScale = Math.max(dynamicMinScale, Math.min(3, newScale));
      
      if (clampedScale !== imageScale) {
        const rect = canvas.getBoundingClientRect();
        const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
        const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
        
        // Adjust offset to zoom toward pinch center
        const scaleRatio = clampedScale / imageScale;
        let newOffsetX = centerX - (centerX - imageOffset.x) * scaleRatio;
        let newOffsetY = centerY - (centerY - imageOffset.y) * scaleRatio;
        
        // Calculate new image dimensions
        const newImgWidth = image.width * clampedScale;
        const newImgHeight = image.height * clampedScale;
        
        // Clamp offset to ensure image covers crop area
        newOffsetX = Math.min(newOffsetX, cropArea.x);
        newOffsetX = Math.max(newOffsetX, cropArea.x + cropArea.size - newImgWidth);
        newOffsetY = Math.min(newOffsetY, cropArea.y);
        newOffsetY = Math.max(newOffsetY, cropArea.y + cropArea.size - newImgHeight);
        
        setImageScale(clampedScale);
        setImageOffset({ x: newOffsetX, y: newOffsetY });
      }
      
      setLastTouchDistance(distance);
      return;
    }

    if (e.touches.length !== 1) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const imgWidth = image.width * imageScale;
    const imgHeight = image.height * imageScale;
    const imgRight = imageOffset.x + imgWidth;
    const imgBottom = imageOffset.y + imgHeight;

    if (isDraggingImage) {
      let newX = x - dragStart.x;
      let newY = y - dragStart.y;
      
      newX = Math.min(newX, cropArea.x);
      newX = Math.max(newX, cropArea.x + cropArea.size - imgWidth);
      newY = Math.min(newY, cropArea.y);
      newY = Math.max(newY, cropArea.y + cropArea.size - imgHeight);
      
      setImageOffset({ x: newX, y: newY });
    } else if (isDraggingCrop) {
      let newX = x - dragStart.x;
      let newY = y - dragStart.y;
      
      newX = Math.max(imageOffset.x, Math.min(newX, imgRight - cropArea.size));
      newY = Math.max(imageOffset.y, Math.min(newY, imgBottom - cropArea.size));
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing && initialCropState) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      let newSize = cropArea.size;
      let newX = cropArea.x;
      let newY = cropArea.y;

      if (isResizing === 'se') {
        const delta = Math.min(deltaX, deltaY);
        newSize = Math.max(50, initialCropState.size + delta);
        newX = initialCropState.x;
        newY = initialCropState.y;
        const maxSizeFromPos = Math.min(imgRight - newX, imgBottom - newY);
        newSize = Math.min(newSize, maxSizeFromPos);
      } else if (isResizing === 'sw') {
        const delta = Math.min(-deltaX, deltaY);
        newSize = Math.max(50, initialCropState.size + delta);
        newX = initialCropState.x + initialCropState.size - newSize;
        newY = initialCropState.y;
        newX = Math.max(imageOffset.x, newX);
        const maxSizeFromY = imgBottom - newY;
        newSize = Math.min(newSize, maxSizeFromY, initialCropState.x + initialCropState.size - imageOffset.x);
      } else if (isResizing === 'ne') {
        const delta = Math.min(deltaX, -deltaY);
        newSize = Math.max(50, initialCropState.size + delta);
        newX = initialCropState.x;
        newY = initialCropState.y + initialCropState.size - newSize;
        newY = Math.max(imageOffset.y, newY);
        const maxSizeFromX = imgRight - newX;
        newSize = Math.min(newSize, maxSizeFromX, initialCropState.y + initialCropState.size - imageOffset.y);
      } else if (isResizing === 'nw') {
        const delta = Math.min(-deltaX, -deltaY);
        newSize = Math.max(50, initialCropState.size + delta);
        newX = initialCropState.x + initialCropState.size - newSize;
        newY = initialCropState.y + initialCropState.size - newSize;
        newX = Math.max(imageOffset.x, newX);
        newY = Math.max(imageOffset.y, newY);
        const maxSize = Math.min(
          initialCropState.x + initialCropState.size - imageOffset.x,
          initialCropState.y + initialCropState.size - imageOffset.y
        );
        newSize = Math.min(newSize, maxSize);
      }

      newSize = Math.max(50, newSize);
      newX = Math.max(imageOffset.x, Math.min(newX, imgRight - newSize));
      newY = Math.max(imageOffset.y, Math.min(newY, imgBottom - newSize));

      setCropArea({ x: newX, y: newY, size: newSize });
    }
  };

  const handleTouchEnd = () => {
    setIsDraggingCrop(false);
    setIsDraggingImage(false);
    setIsResizing(null);
    setInitialCropState(null);
    setLastTouchDistance(null);
  };

  const handleCrop = () => {
    if (!canvasRef.current || !image) return;

    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    const sourceX = (cropArea.x - imageOffset.x) / imageScale;
    const sourceY = (cropArea.y - imageOffset.y) / imageScale;
    const sourceSize = cropArea.size / imageScale;

    // Calculate final dimensions respecting maxWidth/maxHeight
    let finalWidth = cropArea.size;
    let finalHeight = cropArea.size;
    
    if (enableCropping && (maxWidth || maxHeight)) {
      const targetSize = Math.min(maxWidth, maxHeight);
      if (cropArea.size > targetSize) {
        finalWidth = targetSize;
        finalHeight = targetSize;
      }
    }

    cropCanvas.width = finalWidth;
    cropCanvas.height = finalHeight;

    cropCtx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      finalWidth,
      finalHeight
    );

    const croppedDataUrl = cropCanvas.toDataURL('image/png', 0.9);
    onImageUpload(croppedDataUrl);
    toast({
      title: "Success",
      description: "Logo cropped and uploaded successfully",
    });
    setImage(null);
    setCropState('preview');
  };

  const handleCancelCrop = () => {
    setImage(null);
    setCropState('preview');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (cropState === 'idle') {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    onImageRemove();
    setOriginalImageUrl('');
    setImage(null);
    setCropState('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label className="block text-slate-700" data-testid="label-image-upload">{label}</Label>
      
      {/* Idle State - Upload Dropzone */}
      {cropState === 'idle' && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          data-testid="container-upload-dropzone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="input-file"
          />
          
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-500">
              <span className="font-medium">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-gray-400">
              PNG, JPG, GIF up to 5MB
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {cropState === 'loading' && (
        <div className="border-2 border-gray-200 rounded-lg p-6 text-center bg-gray-50" data-testid="container-loading">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <span className="text-sm text-gray-500">Processing...</span>
          </div>
        </div>
      )}

      {/* Unified Container - Preview & Cropping both happen here */}
      {(cropState === 'preview' || cropState === 'cropping') && currentImage && (
        <div className={`border-2 rounded-lg bg-gray-50 transition-colors ${
          cropState === 'cropping' ? 'border-blue-500' : 'border-gray-200'
        }`} data-testid={cropState === 'cropping' ? 'container-cropping' : 'container-preview'}>
          <div className="relative p-4">
            {/* Preview Mode - Show uploaded image */}
            {cropState === 'preview' && (
              <>
                <img 
                  src={currentImage} 
                  alt="Uploaded" 
                  className="max-w-full h-auto max-h-48 mx-auto rounded"
                  data-testid="img-uploaded-preview"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemove}
                  data-testid="button-remove-image"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}
            
            {/* Cropping Mode - Show canvas in same container */}
            {cropState === 'cropping' && (
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="border-2 border-blue-400 rounded bg-white touch-none max-w-full"
                  style={{ maxHeight: '600px', objectFit: 'contain' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  data-testid="canvas-crop"
                />
              </div>
            )}
          </div>
          
          {/* Buttons - Outside content area but inside container */}
          <div className="px-4 pb-4">
            {cropState === 'preview' && enableCropping && originalImageUrl && (
              <div className="flex justify-center">
                <Button
                  onClick={handleOpenCropping}
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="button-select-crop-area"
                >
                  <Scissors className="h-4 w-4 mr-2" />
                  Select Crop Area
                </Button>
              </div>
            )}
            
            {cropState === 'cropping' && (
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleCancelCrop}
                  data-testid="button-cancel-crop"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleCrop} 
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="button-apply-crop"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply Crop
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
