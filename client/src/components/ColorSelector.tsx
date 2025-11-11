import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onColorSelect: (color: string) => void;
  title?: string;
}

// Utility functions for HSV color conversion
const hexToHsv = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6;
    else if (max === g) h = (b - r) / diff + 2;
    else h = (r - g) / diff + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  
  const s = max === 0 ? 0 : diff / max;
  const v = max;
  
  return [h, Math.round(s * 100), Math.round(v * 100)];
};

const hsvToHex = (h: number, s: number, v: number): string => {
  h = h / 360;
  s = s / 100;
  v = v / 100;
  
  const c = v * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = v - c;
  
  let r = 0, g = 0, b = 0;
  
  if (h < 1/6) [r, g, b] = [c, x, 0];
  else if (h < 2/6) [r, g, b] = [x, c, 0];
  else if (h < 3/6) [r, g, b] = [0, c, x];
  else if (h < 4/6) [r, g, b] = [0, x, c];
  else if (h < 5/6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  isOpen,
  onClose,
  currentColor,
  onColorSelect,
  title = "Select color"
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [showAdvancedColorPicker, setShowAdvancedColorPicker] = useState(false);
  const [hsv, setHsv] = useState(() => hexToHsv(currentColor));

  // Update selectedColor when currentColor prop changes (when modal opens with different color)
  useEffect(() => {
    setSelectedColor(currentColor);
    setHsv(hexToHsv(currentColor));
  }, [currentColor]);

  // Comprehensive color palette combining all presets
  const colorPresets = [
    // Basic colors
    '#FF0000', '#00FFFF', '#0000FF', '#00FF00',
    '#FF00FF', '#FFFF00', '#000000', '#FFFFFF',
    
    // Extended palette from frame colors  
    '#FFA500', '#800080', '#008000', '#000080',
    '#808080', '#C0C0C0', '#800000', '#808000',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#FFB6C1', '#87CEEB', '#FF69B4', '#F0E68C',
    '#FA8072', '#20B2AA', '#87CEFA', '#F5DEB3',
    
    // Additional professional colors
    '#333333', '#666666', '#999999', '#1a1a1a',
    '#2d3748', '#4a5568', '#2b6cb0', '#d53f8c',
    '#38b2ac', '#dd6b20', '#9f7aea', '#319795',
    '#e53e3e', '#3182ce', '#805ad5', '#2ecc71',
    '#f39c12', '#e74c3c', '#9b59b6', '#34495e',
    '#16a085', '#27ae60', '#2980b9', '#8e44ad',
    '#2c3e50', '#f1c40f', '#e67e22', '#95a5a6'
  ];

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };


  const handleCustomColorChange = (color: string) => {
    setSelectedColor(color);
    setHsv(hexToHsv(color));
  };
  
  const handleHsvChange = (newHsv: [number, number, number]) => {
    setHsv(newHsv);
    const hexColor = hsvToHex(newHsv[0], newHsv[1], newHsv[2]);
    setSelectedColor(hexColor);
  };
  
  const handleCustomButtonClick = () => {
    setShowAdvancedColorPicker(true);
  };

  const handleSet = () => {
    onColorSelect(selectedColor);
    onClose();
  };

  const handleCancel = () => {
    setSelectedColor(currentColor);
    setHsv(hexToHsv(currentColor));
    setShowAdvancedColorPicker(false);
    onClose();
  };
  
  const handleAdvancedCancel = () => {
    setShowAdvancedColorPicker(false);
    setSelectedColor(currentColor);
    setHsv(hexToHsv(currentColor));
  };
  
  const handleAdvancedSet = () => {
    setShowAdvancedColorPicker(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Color Presets Grid */}
          <div className="grid grid-cols-8 gap-2 p-2">
            {colorPresets.slice(0, 48).map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                  selectedColor === color ? 'border-gray-800 border-4' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
                title={color}
              />
            ))}
          </div>

          {/* Custom Color Section */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button
              variant="outline"
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={handleCustomButtonClick}
            >
              Custom
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Chosen color</span>
              <div 
                className="w-8 h-8 rounded border-2 border-gray-300"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-center gap-4">
          <Button variant="outline" onClick={handleCancel} className="flex-1 max-w-32">
            Cancel
          </Button>
          <Button onClick={handleSet} className="flex-1 max-w-32">
            Set
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Advanced HSV Color Picker Dialog */}
      <Dialog open={showAdvancedColorPicker} onOpenChange={setShowAdvancedColorPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Select color</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Hue Slider */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Hue</Label>
              <div className="relative">
                <div 
                  className="h-4 w-full rounded"
                  style={{
                    background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsv[0]}
                  onChange={(e) => handleHsvChange([parseInt(e.target.value), hsv[1], hsv[2]])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  style={{ background: 'transparent' }}
                />
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-6 bg-blue-600 rounded border-2 border-white shadow-md pointer-events-none z-10"
                  style={{ left: `calc(${(hsv[0] / 360) * 100}% - 8px)` }}
                />
              </div>
            </div>
            
            {/* Saturation Slider */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Saturation</Label>
              <div className="relative">
                <div 
                  className="h-4 w-full rounded"
                  style={{
                    background: `linear-gradient(to right, #ffffff, ${hsvToHex(hsv[0], 100, hsv[2])})`
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsv[1]}
                  onChange={(e) => handleHsvChange([hsv[0], parseInt(e.target.value), hsv[2]])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  style={{ background: 'transparent' }}
                />
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-6 bg-blue-600 rounded border-2 border-white shadow-md pointer-events-none z-10"
                  style={{ left: `calc(${hsv[1]}% - 8px)` }}
                />
              </div>
            </div>
            
            {/* Value/Brightness Slider */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Value</Label>
              <div className="relative">
                <div 
                  className="h-4 w-full rounded"
                  style={{
                    background: `linear-gradient(to right, #000000, ${hsvToHex(hsv[0], hsv[1], 100)})`
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsv[2]}
                  onChange={(e) => handleHsvChange([hsv[0], hsv[1], parseInt(e.target.value)])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  style={{ background: 'transparent' }}
                />
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-6 bg-blue-600 rounded border-2 border-white shadow-md pointer-events-none z-10"
                  style={{ left: `calc(${hsv[2]}% - 8px)` }}
                />
              </div>
            </div>
            
            {/* Color Preview */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-600">Chosen color</span>
              <div 
                className="w-10 h-10 rounded border-2 border-gray-300"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-row justify-center gap-4">
            <Button variant="outline" onClick={handleAdvancedCancel} className="flex-1 max-w-32">
              Cancel
            </Button>
            <Button onClick={handleAdvancedSet} className="flex-1 max-w-32">
              Set
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};