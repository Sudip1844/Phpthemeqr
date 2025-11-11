import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { generateQRCode, generateQRCodeSVG, QROptions, createUrlQR, createEmailQR, createPhoneQR, createTextQR, createSMSQR, createWhatsAppQR, createWiFiQR, createVCardQR, createEventQR, createImageQR, createPayPalQR, createEnhancedVCardQR, createZoomQR, availableDotStyles, availableCornerStyles, availableCornerDotStyles, DotType, CornerSquareType, CornerDotType } from '@/lib/qr-service';
import { Download, Share2, Copy, Check, Loader2, ChevronDown, Link, QrCode, FileText } from 'lucide-react';
import { WhatsAppIcon, FacebookIcon, InstagramIcon, XIcon, TwitterBirdIcon, LinkedInIcon, YouTubeIcon, PayPalIcon, ZoomIcon, WifiIcon, DownloadIcon, ImageUploadIcon, ImageIcon } from '@/components/CustomIcons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ColorSelector } from "@/components/ColorSelector";
import { ImageUpload } from "@/components/ImageUpload";
import { generatorToast } from '@/lib/toast-utils';
import QRCodeStyling from 'qr-code-styling';

const previewCache = new Map<string, string>();

const ShapeStylePreview = ({ dotStyle, color }: { dotStyle: DotType, color: string }) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cacheKey = `${dotStyle}-${color}-v2`;
    
    if (previewCache.has(cacheKey)) {
      setPreviewUrl(previewCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }

    const generatePreview = async () => {
      try {
        setIsLoading(true);
        const qrCode = new QRCodeStyling({
          width: 200,
          height: 200,
          data: 'https://example.com',
          margin: 0,
          qrOptions: {
            errorCorrectionLevel: 'M'
          },
          dotsOptions: {
            type: dotStyle,
            color: color
          },
          backgroundOptions: {
            color: '#ffffff'
          },
          cornersSquareOptions: {
            type: 'square',
            color: color
          },
          cornersDotOptions: {
            type: 'square',
            color: color
          }
        });

        const tempContainer = document.createElement('div');
        qrCode.append(tempContainer);
        
        await new Promise(resolve => setTimeout(resolve, 150));

        const renderedCanvas = tempContainer.querySelector('canvas');
        if (!renderedCanvas) {
          setIsLoading(false);
          return;
        }

        const cropSize = 70;
        const centerX = renderedCanvas.width / 2;
        const centerY = renderedCanvas.height / 2;
        const sourceX = centerX + 15;
        const sourceY = centerY - cropSize / 2;

        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = cropSize;
        outputCanvas.height = cropSize;
        const outputCtx = outputCanvas.getContext('2d');
        
        if (outputCtx) {
          outputCtx.drawImage(
            renderedCanvas,
            sourceX,
            sourceY,
            cropSize,
            cropSize,
            0,
            0,
            cropSize,
            cropSize
          );
          
          const dataUrl = outputCanvas.toDataURL('image/png');
          previewCache.set(cacheKey, dataUrl);
          setPreviewUrl(dataUrl);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating QR preview:', error);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(generatePreview, 50);
    return () => clearTimeout(timer);
  }, [dotStyle, color]);

  if (isLoading || !previewUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <img 
      src={previewUrl} 
      alt={`${dotStyle} style preview`}
      className="w-full h-full object-contain"
    />
  );
};

const brandColors: { [key: string]: string } = {
  'facebook': '#1877F2', 
  'instagram': '#E4405F',
  'twitter-bird': '#1DA1F2',
  'twitter-x': '#000000',
  'twitter': '#1DA1F2',
  'linkedin': '#0A66C2',
  'youtube': '#FF0000',
  'paypal': '#0070BA',
  'zoom': '#2D8CFF',
  'link': '#3B82F6',
  'location': '#FBBF24',
  'email': '#6B7280',
  'phone': '#10B981',
  'wifi': '#8B5CF6',
  'whatsapp': '#25D366',
  'download': '#1E88E5',
  'vcard': '#F59E0B',
  'enhanced-vcard': '#A855F7'
};

const logoOptions = [
  { value: 'none', label: 'None', preview: '❌', type: 'main' },
  { value: 'custom-logo', label: 'Custom Logo', icon: ImageUploadIcon, type: 'main' },
  { value: 'custom-emoji', label: 'Custom Emoji', preview: '😀', type: 'main' },
  { value: 'link', preview: '🔗', type: 'social' },
  { value: 'location', preview: '📍', type: 'social' },
  { value: 'email', preview: '✉️', type: 'social' },
  { value: 'phone', preview: '📞', type: 'social' },
  { value: 'whatsapp', icon: WhatsAppIcon, type: 'social' },
  { value: 'facebook', icon: FacebookIcon, type: 'social' },
  { value: 'instagram', icon: InstagramIcon, type: 'social' },
  { value: 'twitter-bird', icon: TwitterBirdIcon, type: 'social' },
  { value: 'twitter-x', icon: XIcon, type: 'social' },
  { value: 'linkedin', icon: LinkedInIcon, type: 'social' },
  { value: 'youtube', icon: YouTubeIcon, type: 'social' },
  { value: 'paypal', icon: PayPalIcon, type: 'social' },
  { value: 'zoom', icon: ZoomIcon, type: 'social' },
  { value: 'wifi', icon: WifiIcon, type: 'social' },
  { value: 'download', icon: DownloadIcon, type: 'social' },
  { value: 'vcard', preview: '👤', type: 'social' },
  { value: 'enhanced-vcard', preview: '🪪', type: 'social' }
];

const contentTypes = [
  { value: 'url', label: 'Link', icon: '🔗' },
  { value: 'text', label: 'Text', icon: FileText, iconColor: 'text-blue-600' },
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'phone', label: 'Phone', icon: '📞' },
  { value: 'sms', label: 'SMS', icon: '💬' },
  { value: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, iconColor: 'text-green-600' },
  { value: 'zoom', label: 'Zoom', icon: ZoomIcon, iconColor: 'text-blue-600' },
  { value: 'paypal', label: 'PayPal', icon: PayPalIcon, iconColor: 'text-blue-600' },
  { value: 'wifi', label: 'WiFi', icon: WifiIcon, iconColor: 'text-purple-600' },
  { value: 'vcard', label: 'Contact', icon: '👤' },
  { value: 'enhanced-vcard', label: 'V-card', icon: '🪪', iconColor: 'text-purple-600' },
  { value: 'event', label: 'Event', icon: '📅' },
  { value: 'image', label: 'Image', icon: ImageIcon, iconColor: 'text-indigo-600' }
];

const QRGenerator = () => {
  // Content type and data
  const [contentType, setContentType] = useState('url');
  const [qrData, setQrData] = useState('');
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [copied, setCopied] = useState(false);
  
  // Generation token to handle concurrent requests
  const generationTokenRef = useRef(0);
  
  // Track if user manually toggled remove background option
  const userToggledRemoveBgRef = useRef(false);
  
  // Email specific fields
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // SMS specific fields
  const [smsMessage, setSmsMessage] = useState('');
  
  // WhatsApp specific fields
  const [whatsappMessage, setWhatsappMessage] = useState('');
  
  // WiFi specific fields
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  
  // vCard specific fields
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');
  
  // Event specific fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  
  // Image specific fields
  const [imageData, setImageData] = useState<string | null>(null);

  
  // PayPal specific fields
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalPaymentType, setPaypalPaymentType] = useState('Buy now');
  const [paypalItemName, setPaypalItemName] = useState('');
  const [paypalItemId, setPaypalItemId] = useState('');
  const [paypalPrice, setPaypalPrice] = useState('');
  const [paypalCurrency, setPaypalCurrency] = useState('USD');
  const [paypalShipping, setPaypalShipping] = useState('');
  const [paypalTaxRate, setPaypalTaxRate] = useState('');
  
  // Enhanced V-card specific fields
  const [enhancedVcardVersion, setEnhancedVcardVersion] = useState('3.0');
  const [enhancedVcardTitle, setEnhancedVcardTitle] = useState('');
  const [enhancedVcardFirstName, setEnhancedVcardFirstName] = useState('');
  const [enhancedVcardLastName, setEnhancedVcardLastName] = useState('');
  const [enhancedVcardPhoneHome, setEnhancedVcardPhoneHome] = useState('');
  const [enhancedVcardPhoneMobile, setEnhancedVcardPhoneMobile] = useState('');
  const [enhancedVcardPhoneOffice, setEnhancedVcardPhoneOffice] = useState('');
  const [enhancedVcardFax, setEnhancedVcardFax] = useState('');
  const [enhancedVcardEmail, setEnhancedVcardEmail] = useState('');
  const [enhancedVcardWebsite, setEnhancedVcardWebsite] = useState('');
  const [enhancedVcardCompany, setEnhancedVcardCompany] = useState('');
  const [enhancedVcardJobTitle, setEnhancedVcardJobTitle] = useState('');
  const [enhancedVcardAddress, setEnhancedVcardAddress] = useState('');
  const [enhancedVcardCity, setEnhancedVcardCity] = useState('');
  const [enhancedVcardState, setEnhancedVcardState] = useState('');
  const [enhancedVcardPostalCode, setEnhancedVcardPostalCode] = useState('');
  const [enhancedVcardCountry, setEnhancedVcardCountry] = useState('');

  // Zoom specific fields
  const [zoomMeetingId, setZoomMeetingId] = useState('');
  const [zoomPassword, setZoomPassword] = useState('');

  // Design options state
  const [selectedLogo, setSelectedLogo] = useState('none');
  const [logoSize, setLogoSize] = useState(20);
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [customLogo, setCustomLogo] = useState<string>('');
  const [customEmoji, setCustomEmoji] = useState<string>('');
  const [gradient, setGradient] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  
  const [designActiveTab, setDesignActiveTab] = useState('shape');
  
  // Basic QR options
  const [margin, setMargin] = useState(3);
  const [squareColor, setSquareColor] = useState('#000000');  // Square color (black)
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');  // Background color (white)
  const [innerEyeColor, setInnerEyeColor] = useState('#000000');  // Inner eye color (black)
  const [outerEyeColor, setOuterEyeColor] = useState('#000000');  // Outer eye color (black)
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  
  // Gradient specific options
  const [secondarySquareColor, setSecondarySquareColor] = useState('#15a97c');  // Secondary color for gradient
  const [useRadialGradient, setUseRadialGradient] = useState(false);  // Toggle for radial gradient

  // Color selector states
  const [colorSelectorOpen, setColorSelectorOpen] = useState<'none' | 'square' | 'background' | 'innerEye' | 'outerEye' | 'secondarySquare'>('none');
  const [currentColorForSelection, setCurrentColorForSelection] = useState('');

  // Download settings states
  const [downloadSettingsOpen, setDownloadSettingsOpen] = useState(false);
  const [downloadSize, setDownloadSize] = useState(1000);
  const [downloadFormat, setDownloadFormat] = useState('PNG');
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);

  // QR style options
  const [dotStyle, setDotStyle] = useState<DotType>('square');
  const [cornerSquareStyle, setCornerSquareStyle] = useState<CornerSquareType>('square');
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>('square');


  // Function to get brand colors for social media logos
  const getBrandColor = (logoType: string): string => {
    return brandColors[logoType] || '#6B7280';
  };

  // Helper function to detect if a logo is emoji-based
  const isEmojiLogo = (value: string): boolean => {
    if (value === 'custom-emoji') return true;
    const opt = logoOptions.find(o => o.value === value);
    return !!opt && !('icon' in opt) && !!opt.preview && value !== 'none';
  };
  
  // Reset form when content type changes
  useEffect(() => {
    setQrData('');
    setEmailSubject('');
    setEmailBody('');
    setSmsMessage('');
    setWhatsappMessage('');
    setWifiSSID('');
    setWifiPassword('');
    setVcardName('');
    setVcardPhone('');
    setVcardEmail('');
    setVcardOrg('');
    setEventTitle('');
    setEventLocation('');
    setEventStart('');
    setEventEnd('');
    setImageData(null);
    // Reset PayPal fields
    setPaypalEmail('');
    setPaypalPaymentType('Buy now');
    setPaypalItemName('');
    setPaypalItemId('');
    setPaypalPrice('');
    setPaypalCurrency('USD');
    setPaypalShipping('');
    setPaypalTaxRate('');
    // Reset Enhanced V-card fields
    setEnhancedVcardVersion('3.0');
    setEnhancedVcardTitle('');
    setEnhancedVcardFirstName('');
    setEnhancedVcardLastName('');
    setEnhancedVcardPhoneHome('');
    setEnhancedVcardPhoneMobile('');
    setEnhancedVcardPhoneOffice('');
    setEnhancedVcardFax('');
    setEnhancedVcardEmail('');
    setEnhancedVcardWebsite('');
    setEnhancedVcardCompany('');
    setEnhancedVcardJobTitle('');
    setEnhancedVcardAddress('');
    setEnhancedVcardCity('');
    setEnhancedVcardState('');
    setEnhancedVcardPostalCode('');
    setEnhancedVcardCountry('');
    // Reset Zoom fields
    setZoomMeetingId('');
    setZoomPassword('');
    setQrResult(null); // Reset QR result when content type changes
  }, [contentType]);

  // Auto-enable remove background for emoji logos (unless user has manually toggled it)
  useEffect(() => {
    if (isEmojiLogo(selectedLogo) && !userToggledRemoveBgRef.current) {
      setRemoveBackground(true);
    }
  }, [selectedLogo]);

  // Auto-adjust error correction level when remove background, custom emoji, or custom logo is actively being used
  useEffect(() => {
    const isUsingCustomEmoji = selectedLogo === 'custom-emoji' && !!customEmoji;
    const isUsingCustomLogo = selectedLogo === 'custom-logo' && !!customLogo;
    const shouldUseHighErrorCorrection = removeBackground || isUsingCustomEmoji || isUsingCustomLogo;
    
    if (shouldUseHighErrorCorrection && errorCorrectionLevel !== 'H') {
      setErrorCorrectionLevel('H');
    }
  }, [removeBackground, customEmoji, customLogo, selectedLogo]);

  // Reset QR result when design options change
  useEffect(() => {
    setQrResult(null);
  }, [selectedLogo, logoSize, logoOpacity, gradient, removeBackground, downloadSize, margin, squareColor, backgroundColor, innerEyeColor, outerEyeColor, errorCorrectionLevel, customLogo, customEmoji]);

  // Auto-generation: automatically generate QR code when valid input data changes
  useEffect(() => {
    const autoGenerateQR = async () => {
      // Increment generation token for this request
      const currentToken = ++generationTokenRef.current;
      
      // Check if required fields are filled based on content type
      let isValid = false;
      
      switch (contentType) {
        case 'url':
        case 'text':
        case 'email':
        case 'phone':
        case 'sms':
        case 'whatsapp':
          isValid = qrData.trim().length > 0;
          break;
        case 'wifi':
          isValid = wifiSSID.trim().length > 0;
          break;
        case 'vcard':
          isValid = vcardName.trim().length > 0 && vcardPhone.trim().length > 0;
          break;
        case 'enhanced-vcard':
          isValid = enhancedVcardFirstName.trim().length > 0 || enhancedVcardLastName.trim().length > 0;
          break;
        case 'event':
          isValid = eventTitle.trim().length > 0 && eventLocation.trim().length > 0;
          break;
        case 'image':
          isValid = Boolean(imageData && imageData.trim().length > 0);
          break;
        case 'zoom':
          isValid = zoomMeetingId.trim().length > 0;
          break;
        case 'paypal':
          isValid = paypalEmail.trim().length > 0;
          break;
        default:
          isValid = false;
      }

      if (isValid) {
        // Auto-generate QR code with versioning
        setIsGenerating(true);
        try {
          // Use unified options for consistency with download
          const options = buildQrOptions(downloadSize);
          const qrDataUrl = await generateQRCode(options);
          
          // Only update if this is still the latest request
          if (currentToken === generationTokenRef.current) {
            setQrResult(qrDataUrl);
            setIsGenerating(false);
            
            // Dispatch custom event for dynamic messages
            const event = new CustomEvent('qrCodeGenerated', { 
              detail: { contentType, timestamp: Date.now() } 
            });
            window.dispatchEvent(event);
          }
          // If not the latest, this result is stale - ignore it
        } catch (error) {
          // Only handle error if this is still the latest request
          if (currentToken === generationTokenRef.current) {
            console.error('Error auto-generating QR:', error);
            console.error('Error message:', error instanceof Error ? error.message : String(error));
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            setQrResult(null);
            setIsGenerating(false);
          }
        }
      } else {
        // Clear QR result if data becomes invalid
        setQrResult(null);
        setIsGenerating(false);
      }
    };

    // Add a small delay to avoid too frequent regeneration
    const timeoutId = setTimeout(autoGenerateQR, 300);
    return () => clearTimeout(timeoutId);
  }, [qrData, emailSubject, emailBody, smsMessage, whatsappMessage, wifiSSID, wifiPassword, wifiSecurity, vcardName, vcardPhone, vcardEmail, vcardOrg, eventTitle, eventLocation, eventStart, eventEnd, imageData, customLogo, customEmoji, paypalEmail, paypalPaymentType, paypalItemName, paypalItemId, paypalPrice, paypalCurrency, paypalShipping, paypalTaxRate, enhancedVcardVersion, enhancedVcardTitle, enhancedVcardFirstName, enhancedVcardLastName, enhancedVcardPhoneHome, enhancedVcardPhoneMobile, enhancedVcardPhoneOffice, enhancedVcardFax, enhancedVcardEmail, enhancedVcardWebsite, enhancedVcardCompany, enhancedVcardJobTitle, enhancedVcardAddress, enhancedVcardCity, enhancedVcardState, enhancedVcardPostalCode, enhancedVcardCountry, zoomMeetingId, zoomPassword, selectedLogo, logoSize, logoOpacity, gradient, removeBackground, downloadSize, margin, squareColor, backgroundColor, innerEyeColor, outerEyeColor, errorCorrectionLevel, contentType, dotStyle, cornerSquareStyle, cornerDotStyle]);

  // Emoji validation function
  const validateEmoji = (text: string): boolean => {
    // Simple emoji validation - check if it's a single character that looks like emoji
    if (text.length === 0) return true;
    if (text.length > 4) return false; // Allow for complex emojis with modifiers
    
    // Basic emoji check - if it's not ASCII and has reasonable length, allow it
    return text.trim().length > 0 && text.trim().length <= 4;
  }

  // Handle custom emoji input with validation
  const handleCustomEmojiChange = (value: string) => {
    if (value === '' || validateEmoji(value)) {
      setCustomEmoji(value);
    }
  };

  // Handle custom logo upload
  const handleCustomLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomLogo(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Color selector handlers
  const openColorSelector = (type: 'square' | 'background' | 'innerEye' | 'outerEye' | 'secondarySquare') => {
    let currentColor = '';
    switch (type) {
      case 'square':
        currentColor = squareColor;
        break;
      case 'background':
        currentColor = backgroundColor;
        break;
      case 'innerEye':
        currentColor = innerEyeColor;
        break;
      case 'outerEye':
        currentColor = outerEyeColor;
        break;
      case 'secondarySquare':
        currentColor = secondarySquareColor;
        break;
      default:
        currentColor = squareColor;
    }
    setCurrentColorForSelection(currentColor);
    setColorSelectorOpen(type);
  };

  const handleColorSelect = (color: string) => {
    switch (colorSelectorOpen) {
      case 'square':
        setSquareColor(color);
        break;
      case 'background':
        setBackgroundColor(color);
        break;
      case 'innerEye':
        setInnerEyeColor(color);
        break;
      case 'outerEye':
        setOuterEyeColor(color);
        break;
      case 'secondarySquare':
        setSecondarySquareColor(color);
        break;
    }
    setColorSelectorOpen('none');
  };

  // Listen for QR type selection events from quick links
  useEffect(() => {
    const handleQRTypeSelect = (event: CustomEvent) => {
      const { type } = event.detail;
      setContentType(type);
      // Reset QR result when type changes
      setQrResult(null);
      // Reset form data
      setQrData('');
      setEmailSubject('');
      setEmailBody('');
      setSmsMessage('');
      setWhatsappMessage('');
      setWifiSSID('');
      setWifiPassword('');
      setVcardName('');
      setVcardPhone('');
      setVcardEmail('');
      setVcardOrg('');
      setEventTitle('');
      setEventLocation('');
      setEventStart('');
      setEventEnd('');
      setImageData(null);
    };

    window.addEventListener('qrTypeSelect', handleQRTypeSelect as EventListener);
    return () => {
      window.removeEventListener('qrTypeSelect', handleQRTypeSelect as EventListener);
    };
  }, []);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const generateData = () => {
    switch (contentType) {
      case 'url':
        return createUrlQR(qrData);
      case 'email':
        return createEmailQR(qrData, emailSubject, emailBody);
      case 'phone':
        return createPhoneQR(qrData);
      case 'text':
        return createTextQR(qrData);
      case 'sms':
        return createSMSQR(qrData, smsMessage);
      case 'whatsapp':
        return createWhatsAppQR(qrData, whatsappMessage);
      case 'zoom':
        return createZoomQR(zoomMeetingId, zoomPassword);
      case 'paypal':
        return createPayPalQR(paypalEmail, paypalPaymentType, paypalItemName, paypalItemId, paypalPrice, paypalCurrency, paypalShipping, paypalTaxRate);
      case 'wifi':
        return createWiFiQR(wifiSSID, wifiPassword, wifiSecurity);
      case 'vcard':
        return createVCardQR(vcardName, vcardPhone, vcardEmail, vcardOrg);
      case 'enhanced-vcard':
        return createEnhancedVCardQR(enhancedVcardVersion, enhancedVcardTitle, enhancedVcardFirstName, enhancedVcardLastName, enhancedVcardPhoneHome, enhancedVcardPhoneMobile, enhancedVcardPhoneOffice, enhancedVcardFax, enhancedVcardEmail, enhancedVcardWebsite, enhancedVcardCompany, enhancedVcardJobTitle, enhancedVcardAddress, enhancedVcardCity, enhancedVcardState, enhancedVcardPostalCode, enhancedVcardCountry);
      case 'event':
        return createEventQR(eventTitle, eventLocation, eventDescription, eventStart, eventEnd);
      case 'image':
        return createImageQR(imageData || '');
      default:
        return qrData;
    }
  };

  const generateQR = async () => {
    // Validation based on content type
    if (contentType === 'url' && !qrData) {
      generatorToast.error('Please enter a URL');
      return;
    }
    if (contentType === 'text' && !qrData) {
      generatorToast.error('Please enter text content');
      return;
    }
    if (contentType === 'email' && !qrData) {
      generatorToast.error('Please enter an email address');
      return;
    }
    if (contentType === 'phone' && !qrData) {
      generatorToast.error('Please enter a phone number');
      return;
    }
    if (contentType === 'sms' && !qrData) {
      generatorToast.error('Please enter a phone number');
      return;
    }
    if (contentType === 'whatsapp' && !qrData) {
      generatorToast.error('Please enter a WhatsApp number');
      return;
    }
    if (contentType === 'wifi' && !wifiSSID) {
      generatorToast.error('Please enter WiFi network name (SSID)');
      return;
    }
    if (contentType === 'vcard' && !vcardName) {
      generatorToast.error('Please enter a name for the contact');
      return;
    }
    if (contentType === 'vcard' && !vcardPhone) {
      generatorToast.error('Please enter a phone number for the contact');
      return;
    }
    if (contentType === 'event' && !eventTitle) {
      generatorToast.error('Please enter an event title');
      return;
    }
    if (contentType === 'event' && !eventLocation) {
      generatorToast.error('Please enter a location for the event');
      return;
    }
    if (contentType === 'image' && !imageData) {
      generatorToast.error('Please provide an image URL or upload an image');
      return;
    }
    if (contentType === 'zoom' && !zoomMeetingId) {
      generatorToast.error('Please enter a Zoom Meeting ID');
      return;
    }
    if (contentType === 'paypal' && !paypalEmail) {
      generatorToast.error('Please enter a PayPal email address');
      return;
    }
    if (contentType === 'enhanced-vcard' && !enhancedVcardFirstName && !enhancedVcardLastName) {
      generatorToast.error('Please enter at least first name or last name');
      return;
    }

    setIsGenerating(true);
    try {
      // Use unified options for consistency
      const options = buildQrOptions(downloadSize);
      const qrDataUrl = await generateQRCode(options);
      setQrResult(qrDataUrl);
      generatorToast.success('QR code generated successfully!');
      
      // Dispatch custom event for dynamic messages
      const event = new CustomEvent('qrCodeGenerated', { 
        detail: { contentType, timestamp: Date.now() } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error generating QR:', error);
      generatorToast.error('Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!qrResult) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrResult);
      const blob = await response.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      
      setCopied(true);
      generatorToast.success('QR code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy QR code:', error);
      generatorToast.error('Failed to copy QR code');
    }
  };

  // Helper function to build unified QR options for both preview and download
  const buildQrOptions = (size: number): QROptions => {
    return {
      data: generateData(),
      size: size,
      margin: margin * 20,
      dotsType: dotStyle,
      cornerSquareType: cornerSquareStyle,
      cornerDotType: cornerDotStyle,
      color: { 
        dark: squareColor, 
        light: backgroundColor,
        innerEye: innerEyeColor,
        outerEye: outerEyeColor
      },
      gradient: gradient ? {
        enabled: true,
        secondaryColor: secondarySquareColor,
        type: useRadialGradient ? 'radial' : 'linear'
      } : {
        enabled: false
      },
      errorCorrectionLevel: errorCorrectionLevel,
      design: {
        logo: selectedLogo === 'custom-logo' && customLogo ? customLogo : 
              selectedLogo === 'custom-emoji' && customEmoji ? customEmoji : 
              selectedLogo !== 'none' ? selectedLogo : undefined,
        logoSize: logoSize,
        logoOpacity: logoOpacity,
        removeLogoBackground: removeBackground
      }
    };
  };

  // Helper function to generate a unique 5-character alphanumeric ID
  const generateUniqueId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Helper function to generate filename based on actual format
  const getDownloadFilename = (actualMimeType: string): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const uniqueId = generateUniqueId();
    
    let extension = 'png'; // default fallback
    
    if (actualMimeType.includes('image/jpeg')) {
      extension = 'jpg';
    } else if (actualMimeType.includes('image/webp')) {
      extension = 'webp';
    } else if (actualMimeType.includes('image/svg+xml')) {
      extension = 'svg';
    } else if (actualMimeType.includes('image/png')) {
      extension = 'png';
    }
    
    return `qr-code-${dateStr}-${uniqueId}.${extension}`;
  };

  // Helper function to generate QR code for download with specified settings
  const generateDownloadQR = async (): Promise<{dataUrl: string, mimeType: string} | null> => {
    const content = generateData();
    if (!content) return null;
    
    try {
      // Use unified options for consistency with preview
      const downloadOptions = buildQrOptions(downloadSize);
      
      // Generate the QR code at download size
      const qrDataUrl = await generateQRCode(downloadOptions);
      
      // Handle different formats
      if (downloadFormat === 'PNG') {
        return { dataUrl: qrDataUrl, mimeType: 'image/png' };
      } else if (downloadFormat === 'JPEG') {
        // Convert to JPEG with white background for transparency
        const jpegData = await convertToJPEG(qrDataUrl);
        return { dataUrl: jpegData, mimeType: 'image/jpeg' };
      } else if (downloadFormat === 'WEBP') {
        // Convert to WEBP if browser supports it
        const webpResult = await convertToWEBP(qrDataUrl);
        // Check if WEBP conversion was successful or fell back to PNG
        const actualMimeType = webpResult.startsWith('data:image/webp') ? 'image/webp' : 'image/png';
        if (actualMimeType === 'image/png') {
          generatorToast.warning('WEBP format not supported by this browser. Downloaded as PNG.');
        }
        return { dataUrl: webpResult, mimeType: actualMimeType };
      } else if (downloadFormat === 'SVG') {
        // Check if design features are enabled that aren't supported in SVG
        const hasDesignFeatures = selectedLogo !== 'none' || gradient || removeBackground;
        
        if (hasDesignFeatures) {
          // SVG doesn't support design features, fallback to PNG
          generatorToast.warning('SVG format doesn\'t support logos/gradients/background removal. Downloaded as PNG.');
          return { dataUrl: qrDataUrl, mimeType: 'image/png' };
        }
        
        // Generate SVG format directly for basic QR codes
        const svgDataUrl = await generateQRCodeSVG({
          data: content,
          size: downloadSize,
          margin: margin * 10,
          color: { 
            dark: squareColor, 
            light: backgroundColor
          },
          errorCorrectionLevel: errorCorrectionLevel
        });
        return { dataUrl: svgDataUrl, mimeType: 'image/svg+xml' };
      } else {
        // For unsupported formats, return PNG for now
        generatorToast.warning(`${downloadFormat} format not yet supported. Downloaded as PNG.`);
        return { dataUrl: qrDataUrl, mimeType: 'image/png' };
      }
    } catch (error) {
      console.error('Error generating download QR:', error);
      return null;
    }
  };

  // Helper function to convert QR to JPEG format
  const convertToJPEG = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Handle errors and null context
      if (!ctx) {
        console.warn('Canvas context not available, falling back to original PNG');
        return resolve(dataUrl);
      }
      
      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Fill white background for JPEG (no transparency)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw QR code on top
          ctx.drawImage(img, 0, 0);
          
          // Convert to JPEG
          resolve(canvas.toDataURL('image/jpeg', 0.92));
        } catch (error) {
          console.warn('JPEG conversion failed, falling back to PNG:', error);
          resolve(dataUrl);
        }
      };
      
      img.onerror = (error) => {
        console.warn('Image loading failed for JPEG conversion, falling back to PNG:', error);
        resolve(dataUrl);
      };
      
      // Set timeout to prevent hanging
      setTimeout(() => {
        console.warn('JPEG conversion timeout, falling back to PNG');
        resolve(dataUrl);
      }, 10000);
      
      img.src = dataUrl;
    });
  };

  // Helper function to convert QR to WEBP format
  const convertToWEBP = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Handle errors and null context
      if (!ctx) {
        console.warn('Canvas context not available, falling back to original PNG');
        return resolve(dataUrl);
      }
      
      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Try to convert to WEBP, fallback to PNG if not supported
          const webpData = canvas.toDataURL('image/webp', 0.92);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
          } else {
            console.warn('WEBP format not supported by browser, falling back to PNG');
            resolve(dataUrl); // Fallback to original PNG
          }
        } catch (error) {
          console.warn('WEBP conversion failed, falling back to PNG:', error);
          resolve(dataUrl); // Fallback to original PNG
        }
      };
      
      img.onerror = (error) => {
        console.warn('Image loading failed for WEBP conversion, falling back to PNG:', error);
        resolve(dataUrl);
      };
      
      // Set timeout to prevent hanging
      setTimeout(() => {
        console.warn('WEBP conversion timeout, falling back to PNG');
        resolve(dataUrl);
      }, 10000);
      
      img.src = dataUrl;
    });
  };

  // Helper function to handle embed QR code
  const handleEmbedQR = async () => {
    if (!qrResult) {
      generatorToast.error('Please generate a QR code first');
      return;
    }
    setEmbedDialogOpen(true);
  };

  // Helper function to get embed HTML code
  const getEmbedHTML = async (): Promise<string> => {
    try {
      const downloadData = await generateDownloadQR();
      if (!downloadData) return '';
      
      return `<img src="${downloadData.dataUrl}" alt="QR Code" width="${downloadSize}" height="${downloadSize}" style="max-width: 100%; height: auto;" />`;
    } catch (error) {
      console.error('Error generating embed code:', error);
      return '';
    }
  };

  const downloadQR = async () => {
    if (!qrResult) return;
    
    try {
      // Generate QR code at the specified download size and format
      const downloadData = await generateDownloadQR();
      if (!downloadData) {
        generatorToast.error('Failed to generate QR code for download');
        return;
      }
      
      const link = document.createElement('a');
      link.download = getDownloadFilename(downloadData.mimeType);
      link.href = downloadData.dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show appropriate success message based on actual format
      const actualFormat = downloadData.mimeType.includes('webp') ? 'WEBP' : 
                          downloadData.mimeType.includes('jpeg') ? 'JPEG' : 'PNG';
      generatorToast.success(`QR code downloaded as ${actualFormat}!`);
    } catch (error) {
      console.error('Download error:', error);
      generatorToast.error('Failed to download QR code');
    }
    
    // Dispatch completion event
    const event = new CustomEvent('qrCodeCompleted', { 
      detail: { action: 'download', timestamp: Date.now() } 
    });
    window.dispatchEvent(event);
  };

  const copyQR = async () => {
    if (!qrResult) return;
    
    try {
      const blob = await fetch(qrResult).then(r => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      generatorToast.success('QR code copied to clipboard!');
      
      // Dispatch completion event
      const event = new CustomEvent('qrCodeCompleted', { 
        detail: { action: 'copy', timestamp: Date.now() } 
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error copying:', err);
      generatorToast.error('Failed to copy QR code');
    }
  };

  const shareQR = async () => {
    if (!qrResult) return;
    
    try {
      const blob = await fetch(qrResult).then(r => r.blob());
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'QR Code',
          files: [file]
        });
        generatorToast.success('QR code shared successfully!');
        
        // Dispatch completion event
        const event = new CustomEvent('qrCodeCompleted', { 
          detail: { action: 'share', timestamp: Date.now() } 
        });
        window.dispatchEvent(event);
      } else {
        generatorToast.error('Web Share API not supported on this browser');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      generatorToast.error('Failed to share QR code');
    }
  };

  const getSelectedContentType = () => {
    return contentTypes.find(type => type.value === contentType);
  };

  return (
    <div className="w-full max-w-full sm:max-w-4xl lg:max-w-5xl mx-auto px-1 sm:px-2">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-1 dynamic-neon-title">QR Code Generator</h1>
        <p className="text-muted-foreground text-sm">Create customized QR codes for various content types</p>
      </div>
      
      <Card className="w-full">
        <CardContent className="px-3 py-4 sm:px-4">
          <div className="space-y-4">
            {/* QR Preview Section - Optimized */}
            {qrResult ? (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 relative flex justify-center">
                <img 
                  src={qrResult} 
                  alt="Generated QR Code" 
                  className="max-w-full max-h-80 w-auto h-auto"
                  style={{ maxWidth: '320px', maxHeight: '320px' }}
                />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center justify-center mx-auto">
                <QrCode className="h-20 w-20 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 text-center">QR Code will appear here</p>
              </div>
            )}
            
            {/* Configuration Section */}
            <div className="space-y-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 rounded-lg p-1">
                  <TabsTrigger 
                    value="content" 
                    className="rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-emerald-500 text-white rounded-full text-xs font-bold mr-1">1</span>
                    Content
                  </TabsTrigger>
                  <TabsTrigger 
                    value="design" 
                    className="rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-400 text-white rounded-full text-xs font-bold mr-1">2</span>
                    Design
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4">
                  {/* Content Type Selector */}
                  <div className="space-y-2">
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger className="w-full h-12 bg-emerald-50 border-emerald-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const selectedType = getSelectedContentType();
                            const icon = selectedType?.icon;
                            if (typeof icon === 'string') {
                              return <span className="text-xl">{icon}</span>;
                            } else if (icon) {
                              return React.createElement(icon, { 
                                className: `h-6 w-6 ${selectedType?.iconColor || 'text-emerald-600'}` 
                              });
                            }
                            return null;
                          })()}
                          <div className="flex-1 text-left">
                            <div className="font-medium text-emerald-700">{getSelectedContentType()?.label}</div>
                          </div>
                          <ChevronDown className="h-4 w-4 text-emerald-600" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50 rounded-lg">
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="rounded-md">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">
                                {typeof type.icon === 'string' ? (
                                  type.icon
                                ) : (
                                  React.createElement(type.icon, { 
                                    className: `h-5 w-5 ${type.iconColor || 'text-current'}` 
                                  })
                                )}
                              </span>
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Content Input Fields */}
                  <div className="space-y-3">
                    {contentType === 'url' && (
                      <div className="space-y-1">
                        <Label htmlFor="url" className="text-slate-700 font-medium text-sm">Enter your Link</Label>
                        <Input
                          id="url"
                          placeholder="https://"
                          value={qrData}
                          onChange={(e) => setQrData(e.target.value)}
                          className="h-10"
                        />
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-700 font-medium mb-1">Supported Links:</p>
                          <p className="text-xs text-blue-600">
                            • Website URLs (https://example.com)<br/>
                            • Social Media Profiles (Facebook, Instagram, Twitter, LinkedIn)<br/>
                            • YouTube Channel Links & Video Links<br/>
                            • YouTube Shorts Links<br/>
                            • Any valid web URL or deep link
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {contentType === 'text' && (
                      <div className="space-y-2">
                        <Label htmlFor="text" className="text-slate-700 font-medium">Text Content</Label>
                        <Textarea
                          id="text"
                          placeholder="Enter your text here"
                          value={qrData}
                          onChange={(e) => setQrData(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    )}

                    {contentType === 'email' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                          <Input
                            id="email"
                            placeholder="example@email.com"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emailSubject" className="text-slate-700 font-medium">Subject (Optional)</Label>
                          <Input
                            id="emailSubject"
                            placeholder="Email subject"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emailBody" className="text-slate-700 font-medium">Message (Optional)</Label>
                          <Textarea
                            id="emailBody"
                            placeholder="Email message"
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    )}

                    {contentType === 'phone' && (
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+880123456789"
                          value={qrData}
                          onChange={(e) => setQrData(e.target.value)}
                          className="h-12"
                        />
                      </div>
                    )}

                    {contentType === 'sms' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="smsPhone" className="text-slate-700 font-medium">Phone Number</Label>
                          <Input
                            id="smsPhone"
                            placeholder="+880123456789"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smsMessage" className="text-slate-700 font-medium">SMS Message (Optional)</Label>
                          <Textarea
                            id="smsMessage"
                            placeholder="Your SMS message"
                            value={smsMessage}
                            onChange={(e) => setSmsMessage(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    )}

                    {contentType === 'whatsapp' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="whatsappPhone" className="text-slate-700 font-medium">WhatsApp Number</Label>
                          <Input
                            id="whatsappPhone"
                            placeholder="+880123456789"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="whatsappMessage" className="text-slate-700 font-medium">Pre-filled Message (Optional)</Label>
                          <Textarea
                            id="whatsappMessage"
                            placeholder="Hello! I'm interested in..."
                            value={whatsappMessage}
                            onChange={(e) => setWhatsappMessage(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    )}


                    {contentType === 'zoom' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="zoomMeetingId" className="text-slate-700 font-medium">Meeting ID</Label>
                          <Input
                            id="zoomMeetingId"
                            placeholder="123 456 789"
                            value={zoomMeetingId}
                            onChange={(e) => setZoomMeetingId(e.target.value)}
                            className="h-12"
                            data-testid="input-zoom-meeting-id"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zoomPassword" className="text-slate-700 font-medium">Password (Optional)</Label>
                          <Input
                            id="zoomPassword"
                            placeholder="Meeting password"
                            value={zoomPassword}
                            onChange={(e) => setZoomPassword(e.target.value)}
                            className="h-12"
                            data-testid="input-zoom-password"
                          />
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-700 font-medium mb-1">Zoom Meeting Link:</p>
                          <p className="text-xs text-blue-600">
                            Creates a direct Zoom meeting link that users can click to join your meeting instantly. Works on desktop and mobile devices.
                          </p>
                        </div>
                      </div>
                    )}

                    {contentType === 'paypal' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="paypalEmail" className="text-slate-700 font-medium">PayPal Email Address</Label>
                          <Input
                            id="paypalEmail"
                            placeholder="business@example.com"
                            value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)}
                            className="h-12"
                            data-testid="input-paypal-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Payment Type</Label>
                          <Select value={paypalPaymentType} onValueChange={setPaypalPaymentType}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Buy now">Buy now</SelectItem>
                              <SelectItem value="Donation">Donation</SelectItem>
                              <SelectItem value="Subscription">Subscription</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="paypalItemName" className="text-slate-700 font-medium">Item Name (Optional)</Label>
                            <Input
                              id="paypalItemName"
                              placeholder="Product/Service Name"
                              value={paypalItemName}
                              onChange={(e) => setPaypalItemName(e.target.value)}
                              className="h-12"
                              data-testid="input-paypal-item-name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paypalItemId" className="text-slate-700 font-medium">Item ID (Optional)</Label>
                            <Input
                              id="paypalItemId"
                              placeholder="SKU123"
                              value={paypalItemId}
                              onChange={(e) => setPaypalItemId(e.target.value)}
                              className="h-12"
                              data-testid="input-paypal-item-id"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="paypalPrice" className="text-slate-700 font-medium">Price (Optional)</Label>
                            <Input
                              id="paypalPrice"
                              placeholder="10.00"
                              value={paypalPrice}
                              onChange={(e) => setPaypalPrice(e.target.value)}
                              className="h-12"
                              data-testid="input-paypal-price"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Currency</Label>
                            <Select value={paypalCurrency} onValueChange={setPaypalCurrency}>
                              <SelectTrigger className="h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD - US Dollar</SelectItem>
                                <SelectItem value="EUR">EUR - Euro</SelectItem>
                                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                <SelectItem value="BDT">BDT - Bangladeshi Taka</SelectItem>
                                <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                                <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="paypalShipping" className="text-slate-700 font-medium">Shipping (Optional)</Label>
                            <Input
                              id="paypalShipping"
                              placeholder="5.00"
                              value={paypalShipping}
                              onChange={(e) => setPaypalShipping(e.target.value)}
                              className="h-12"
                              data-testid="input-paypal-shipping"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paypalTaxRate" className="text-slate-700 font-medium">Tax Rate % (Optional)</Label>
                            <Input
                              id="paypalTaxRate"
                              placeholder="8.5"
                              value={paypalTaxRate}
                              onChange={(e) => setPaypalTaxRate(e.target.value)}
                              className="h-12"
                              data-testid="input-paypal-tax-rate"
                            />
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-700 font-medium mb-1">PayPal Payment Link:</p>
                          <p className="text-xs text-blue-600">
                            Creates a direct PayPal payment link that customers can use to pay you instantly. Great for invoices, donations, and online sales.
                          </p>
                        </div>
                      </div>
                    )}

                    {contentType === 'wifi' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="wifiSSID" className="text-slate-700 font-medium">Network Name (SSID)</Label>
                          <Input
                            id="wifiSSID"
                            placeholder="MyWiFiNetwork"
                            value={wifiSSID}
                            onChange={(e) => setWifiSSID(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wifiPassword" className="text-slate-700 font-medium">Password</Label>
                          <Input
                            id="wifiPassword"
                            type="password"
                            placeholder="WiFi password"
                            value={wifiPassword}
                            onChange={(e) => setWifiPassword(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Security Type</Label>
                          <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WPA">WPA/WPA2</SelectItem>
                              <SelectItem value="WEP">WEP</SelectItem>
                              <SelectItem value="nopass">No Password</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                          <p className="text-sm text-teal-700 font-medium mb-1">💡 Quick Tip:</p>
                          <p className="text-xs text-teal-600">
                            Scan this QR code with your mobile phone camera or scanner app to connect to WiFi instantly - no need to type the password!
                          </p>
                        </div>
                      </div>
                    )}

                    {contentType === 'vcard' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="vcardName" className="text-slate-700 font-medium">Full Name</Label>
                          <Input
                            id="vcardName"
                            placeholder="John Doe"
                            value={vcardName}
                            onChange={(e) => setVcardName(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vcardPhone" className="text-slate-700 font-medium">Phone Number</Label>
                          <Input
                            id="vcardPhone"
                            placeholder="+880123456789"
                            value={vcardPhone}
                            onChange={(e) => setVcardPhone(e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vcardEmail" className="text-slate-700 font-medium">Email (Optional)</Label>
                          <Input
                            id="vcardEmail"
                            placeholder="john@example.com"
                            value={vcardEmail}
                            onChange={(e) => setVcardEmail(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vcardOrg" className="text-slate-700 font-medium">Organization (Optional)</Label>
                          <Input
                            id="vcardOrg"
                            placeholder="Company Name"
                            value={vcardOrg}
                            onChange={(e) => setVcardOrg(e.target.value)}
                            className="h-12"
                          />
                        </div>
                      </div>
                    )}

                    {contentType === 'enhanced-vcard' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Version</Label>
                          <Select value={enhancedVcardVersion} onValueChange={setEnhancedVcardVersion}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2.1">V-Card 2.1</SelectItem>
                              <SelectItem value="3.0">V-Card 3.0</SelectItem>
                              <SelectItem value="4.0">V-Card 4.0</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardTitle" className="text-slate-700 font-medium">Title (Optional)</Label>
                            <Input
                              id="enhancedVcardTitle"
                              placeholder="Mr./Ms./Dr."
                              value={enhancedVcardTitle}
                              onChange={(e) => setEnhancedVcardTitle(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardFirstName" className="text-slate-700 font-medium">First Name</Label>
                            <Input
                              id="enhancedVcardFirstName"
                              placeholder="John"
                              value={enhancedVcardFirstName}
                              onChange={(e) => setEnhancedVcardFirstName(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-first-name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardLastName" className="text-slate-700 font-medium">Last Name</Label>
                            <Input
                              id="enhancedVcardLastName"
                              placeholder="Doe"
                              value={enhancedVcardLastName}
                              onChange={(e) => setEnhancedVcardLastName(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-last-name"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardPhoneHome" className="text-slate-700 font-medium">Phone (Home) (Optional)</Label>
                            <Input
                              id="enhancedVcardPhoneHome"
                              placeholder="+1234567890"
                              value={enhancedVcardPhoneHome}
                              onChange={(e) => setEnhancedVcardPhoneHome(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-phone-home"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardPhoneMobile" className="text-slate-700 font-medium">Phone (Mobile) (Optional)</Label>
                            <Input
                              id="enhancedVcardPhoneMobile"
                              placeholder="+1234567890"
                              value={enhancedVcardPhoneMobile}
                              onChange={(e) => setEnhancedVcardPhoneMobile(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-phone-mobile"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardEmail" className="text-slate-700 font-medium">Email (Optional)</Label>
                            <Input
                              id="enhancedVcardEmail"
                              placeholder="john@example.com"
                              value={enhancedVcardEmail}
                              onChange={(e) => setEnhancedVcardEmail(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-email"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardWebsite" className="text-slate-700 font-medium">Website (Optional)</Label>
                            <Input
                              id="enhancedVcardWebsite"
                              placeholder="www.example.com"
                              value={enhancedVcardWebsite}
                              onChange={(e) => setEnhancedVcardWebsite(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-website"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardCompany" className="text-slate-700 font-medium">Company (Optional)</Label>
                            <Input
                              id="enhancedVcardCompany"
                              placeholder="Company Name"
                              value={enhancedVcardCompany}
                              onChange={(e) => setEnhancedVcardCompany(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-company"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardJobTitle" className="text-slate-700 font-medium">Job Title (Optional)</Label>
                            <Input
                              id="enhancedVcardJobTitle"
                              placeholder="Software Engineer"
                              value={enhancedVcardJobTitle}
                              onChange={(e) => setEnhancedVcardJobTitle(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-job-title"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardPhoneOffice" className="text-slate-700 font-medium">Phone (Office) (Optional)</Label>
                            <Input
                              id="enhancedVcardPhoneOffice"
                              placeholder="+1234567890"
                              value={enhancedVcardPhoneOffice}
                              onChange={(e) => setEnhancedVcardPhoneOffice(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-phone-office"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardFax" className="text-slate-700 font-medium">Fax (Optional)</Label>
                            <Input
                              id="enhancedVcardFax"
                              placeholder="+1234567890"
                              value={enhancedVcardFax}
                              onChange={(e) => setEnhancedVcardFax(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-fax"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="enhancedVcardAddress" className="text-slate-700 font-medium">Address (Optional)</Label>
                          <Textarea
                            id="enhancedVcardAddress"
                            placeholder="123 Main Street, Apt 4B"
                            value={enhancedVcardAddress}
                            onChange={(e) => setEnhancedVcardAddress(e.target.value)}
                            className="min-h-[60px]"
                            data-testid="input-enhanced-vcard-address"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardCity" className="text-slate-700 font-medium">City (Optional)</Label>
                            <Input
                              id="enhancedVcardCity"
                              placeholder="New York"
                              value={enhancedVcardCity}
                              onChange={(e) => setEnhancedVcardCity(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-city"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardPostalCode" className="text-slate-700 font-medium">Post Code (Optional)</Label>
                            <Input
                              id="enhancedVcardPostalCode"
                              placeholder="10001"
                              value={enhancedVcardPostalCode}
                              onChange={(e) => setEnhancedVcardPostalCode(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-postal-code"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardState" className="text-slate-700 font-medium">State (Optional)</Label>
                            <Input
                              id="enhancedVcardState"
                              placeholder="NY"
                              value={enhancedVcardState}
                              onChange={(e) => setEnhancedVcardState(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-state"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="enhancedVcardCountry" className="text-slate-700 font-medium">Country (Optional)</Label>
                            <Input
                              id="enhancedVcardCountry"
                              placeholder="United States"
                              value={enhancedVcardCountry}
                              onChange={(e) => setEnhancedVcardCountry(e.target.value)}
                              className="h-12"
                              data-testid="input-enhanced-vcard-country"
                            />
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-700 font-medium mb-1">Enhanced Contact Card:</p>
                          <p className="text-xs text-blue-600">
                            Creates a comprehensive contact card with all professional and personal details. Perfect for business networking and detailed contact sharing.
                          </p>
                        </div>
                      </div>
                    )}

                    {contentType === 'event' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="eventTitle" className="text-slate-700 font-medium">Event Title</Label>
                          <Input
                            id="eventTitle"
                            placeholder="Meeting Title"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventLocation" className="text-slate-700 font-medium">Location</Label>
                          <Input
                            id="eventLocation"
                            placeholder="Conference Room A"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventDescription" className="text-slate-700 font-medium">Description (Optional)</Label>
                          <Textarea
                            id="eventDescription"
                            placeholder="Event description or notes"
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="eventStart" className="text-slate-700 font-medium">Start Date & Time</Label>
                            <Input
                              id="eventStart"
                              type="datetime-local"
                              value={eventStart}
                              onChange={(e) => setEventStart(e.target.value)}
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventEnd" className="text-slate-700 font-medium">End Date & Time</Label>
                            <Input
                              id="eventEnd"
                              type="datetime-local"
                              value={eventEnd}
                              onChange={(e) => setEventEnd(e.target.value)}
                              className="h-12"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {contentType === 'image' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Image URL</Label>
                          <Input
                            placeholder="https://example.com/image.jpg or paste Drive/hosting link"
                            value={imageData || ''}
                            onChange={(e) => setImageData(e.target.value)}
                            className="h-12"
                          />
                          <p className="text-sm text-gray-500">
                            Upload your image to Google Drive, Imgur, or any image hosting service and paste the direct link here.
                          </p>
                        </div>
                        {imageData && (
                          <div className="mt-4">
                            <img 
                              src={imageData} 
                              alt="Preview" 
                              className="max-w-full h-32 object-contain border rounded"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-6">
                  <Tabs value={designActiveTab} onValueChange={setDesignActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="shape" data-testid="tab-shape">Shape</TabsTrigger>
                      <TabsTrigger value="logo" data-testid="tab-logo">Logo</TabsTrigger>
                    </TabsList>


                    <TabsContent value="shape" className="space-y-4">
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-1">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Shape & Color</h3>
                        </div>

                        {/* Shape Style Section */}
                        <div className="space-y-3">
                          <Label className="text-slate-700 dark:text-slate-300 font-medium text-base">Shape Style</Label>
                            
                            {/* Shape options */}
                            <div className="overflow-x-auto">
                              <div className="flex gap-2 pb-2 min-w-max">
                                {availableDotStyles.map((style) => (
                                  <button
                                    key={style.value}
                                    onClick={() => setDotStyle(style.value)}
                                    className={`h-16 w-16 md:h-20 md:w-20 flex items-center justify-center flex-shrink-0 rounded-lg border-2 transition-all overflow-hidden ${
                                      dotStyle === style.value
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-800'
                                    }`}
                                    data-testid={`button-dot-style-${style.value}`}
                                  >
                                    <ShapeStylePreview dotStyle={style.value} color={squareColor} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Shape Color */}
                            <div className="space-y-2">
                              <Label className="text-sm text-slate-600 dark:text-slate-400">Shape color</Label>
                              <div className="flex items-center gap-2">
                                <button
                                  className="w-12 h-10 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: squareColor }}
                                  onClick={() => openColorSelector('square')}
                                  data-testid="button-square-color"
                                />
                                <Input
                                  value={squareColor}
                                  onChange={(e) => setSquareColor(e.target.value)}
                                  placeholder="#000000"
                                  className="flex-1"
                                  data-testid="input-square-color"
                                />
                              </div>
                            </div>

                            {/* Gradient Toggle */}
                            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                              <Switch
                                id="gradient"
                                checked={gradient}
                                onCheckedChange={setGradient}
                                data-testid="switch-gradient"
                              />
                              <Label htmlFor="gradient" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                                Gradient
                              </Label>
                            </div>

                            {/* Gradient Options - Show when gradient is enabled */}
                            {gradient && (
                              <div className="space-y-3 pl-2 border-l-2 border-blue-300 dark:border-blue-600">
                                <div className="space-y-2">
                                  <Label className="text-sm text-slate-600 dark:text-slate-400">Second color</Label>
                                  <div className="flex items-center gap-2">
                                    <button
                                      className="w-12 h-10 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 transition-colors"
                                      style={{ backgroundColor: secondarySquareColor }}
                                      onClick={() => openColorSelector('secondarySquare')}
                                      data-testid="button-secondary-square-color"
                                    />
                                    <Input
                                      value={secondarySquareColor}
                                      onChange={(e) => setSecondarySquareColor(e.target.value)}
                                      placeholder="#15a97c"
                                      className="flex-1"
                                      data-testid="input-secondary-square-color"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded">
                                  <Switch
                                    id="radial-gradient"
                                    checked={useRadialGradient}
                                    onCheckedChange={setUseRadialGradient}
                                    data-testid="switch-radial-gradient"
                                  />
                                  <Label htmlFor="radial-gradient" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                                    Radial Gradient
                                  </Label>
                                </div>
                              </div>
                            )}
                        </div>

                        <Separator className="my-6" data-testid="separator-shape-border" />

                        {/* Border Style Section */}
                        <div className="space-y-3">
                          <Label className="text-slate-700 dark:text-slate-300 font-medium text-base">Border style</Label>
                            
                            {/* Border options */}
                            <div className="overflow-x-auto">
                              <div className="flex gap-2 pb-2 min-w-max">
                                {availableCornerStyles.map((style) => (
                                  <button
                                    key={style.value}
                                    onClick={() => setCornerSquareStyle(style.value)}
                                    className={`h-16 w-16 md:h-20 md:w-20 flex items-center justify-center flex-shrink-0 rounded-lg border-2 transition-all ${
                                      cornerSquareStyle === style.value
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-800'
                                    }`}
                                    data-testid={`button-corner-square-${style.value}`}
                                  >
                                    <svg width="50" height="50" viewBox="0 0 60 60">
                                      {style.value === 'square' && (
                                        <rect x="5" y="5" width="50" height="50" fill="none" stroke={outerEyeColor} strokeWidth="6" />
                                      )}
                                      {style.value === 'dot' && (
                                        <circle cx="30" cy="30" r="25" fill="none" stroke={outerEyeColor} strokeWidth="6" />
                                      )}
                                      {style.value === 'extra-rounded' && (
                                        <rect x="5" y="5" width="50" height="50" rx="15" fill="none" stroke={outerEyeColor} strokeWidth="6" />
                                      )}
                                    </svg>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Border Color (Outer Eye) */}
                            <div className="space-y-2">
                              <Label className="text-sm text-slate-600 dark:text-slate-400">Border color</Label>
                              <div className="flex items-center gap-2">
                                <button
                                  className="w-12 h-10 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: outerEyeColor }}
                                  onClick={() => openColorSelector('outerEye')}
                                  data-testid="button-outer-eye-color"
                                />
                                <Input
                                  value={outerEyeColor}
                                  onChange={(e) => setOuterEyeColor(e.target.value)}
                                  placeholder="#000000"
                                  className="flex-1"
                                  data-testid="input-outer-eye-color"
                                />
                              </div>
                            </div>
                        </div>

                        <Separator className="my-6" data-testid="separator-border-center" />

                        {/* Center Style Section */}
                        <div className="space-y-3">
                          <Label className="text-slate-700 dark:text-slate-300 font-medium text-base">Center style</Label>
                            
                            {/* Center options */}
                            <div className="overflow-x-auto">
                              <div className="flex gap-2 pb-2 min-w-max">
                                {availableCornerDotStyles.map((style) => (
                                  <button
                                    key={style.value}
                                    onClick={() => setCornerDotStyle(style.value)}
                                    className={`h-16 w-16 md:h-20 md:w-20 flex items-center justify-center flex-shrink-0 rounded-lg border-2 transition-all ${
                                      cornerDotStyle === style.value
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-800'
                                    }`}
                                    data-testid={`button-corner-dot-${style.value}`}
                                  >
                                    <svg width="70" height="70" viewBox="0 0 60 60">
                                      {style.value === 'square' && (
                                        <rect x="15" y="15" width="30" height="30" fill={innerEyeColor} />
                                      )}
                                      {style.value === 'dot' && (
                                        <circle cx="30" cy="30" r="15" fill={innerEyeColor} />
                                      )}
                                    </svg>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Center Color (Inner Eye) */}
                            <div className="space-y-2">
                              <Label className="text-sm text-slate-600 dark:text-slate-400">Center color</Label>
                              <div className="flex items-center gap-2">
                                <button
                                  className="w-12 h-10 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: innerEyeColor }}
                                  onClick={() => openColorSelector('innerEye')}
                                  data-testid="button-inner-eye-color"
                                />
                                <Input
                                  value={innerEyeColor}
                                  onChange={(e) => setInnerEyeColor(e.target.value)}
                                  placeholder="#000000"
                                  className="flex-1"
                                  data-testid="input-inner-eye-color"
                                />
                              </div>
                            </div>
                        </div>

                        <Separator className="my-6" data-testid="separator-center-background" />

                        {/* Background Color Section */}
                        <div className="space-y-3">
                          <Label className="text-slate-700 dark:text-slate-300 font-medium text-base">Background</Label>
                            
                            <div className="space-y-2">
                              <Label className="text-sm text-slate-600 dark:text-slate-400">Background color</Label>
                              <div className="flex items-center gap-2">
                                <button
                                  className="w-12 h-10 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: backgroundColor }}
                                  onClick={() => openColorSelector('background')}
                                  data-testid="button-background-color"
                                />
                                <Input
                                  value={backgroundColor}
                                  onChange={(e) => setBackgroundColor(e.target.value)}
                                  placeholder="#ffffff"
                                  className="flex-1"
                                  data-testid="input-background-color"
                                />
                              </div>
                            </div>

                            {/* Transparent Background Toggle */}
                            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                              <Switch
                                id="transparent-background"
                                checked={backgroundColor.toLowerCase() === 'transparent' || backgroundColor === ''}
                                onCheckedChange={(checked) => {
                                  setBackgroundColor(checked ? 'transparent' : '#ffffff');
                                }}
                                data-testid="switch-transparent-background"
                              />
                              <Label htmlFor="transparent-background" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                                Transparent background
                              </Label>
                            </div>
                        </div>

                        {/* Margin Section */}
                        <div className="space-y-2 pt-2">
                          <Label className="text-slate-700 dark:text-slate-300 font-medium">Margin (Border Padding)</Label>
                          <Slider
                            value={[margin]}
                            onValueChange={(value) => setMargin(value[0])}
                            max={10}
                            min={0}
                            step={1}
                            className="w-full"
                            data-testid="slider-margin"
                          />
                          <div className="text-sm text-gray-500 dark:text-gray-400">Level: {margin}</div>
                        </div>

                        {/* Error Correction Level Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-700 font-medium">Error Correction Level</Label>
                            {(() => {
                              const isUsingCustomEmoji = selectedLogo === 'custom-emoji' && !!customEmoji;
                              const isUsingCustomLogo = selectedLogo === 'custom-logo' && !!customLogo;
                              const showAutoIndicator = (removeBackground || isUsingCustomEmoji || isUsingCustomLogo) && errorCorrectionLevel === 'H';
                              
                              return showAutoIndicator && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                        Auto
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Automatically set to High for optimal scanning</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })()}
                          </div>
                          <Select 
                            value={errorCorrectionLevel} 
                            onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setErrorCorrectionLevel(value)}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="L">Low (7%)</SelectItem>
                              <SelectItem value="M">Medium (15%)</SelectItem>
                              <SelectItem value="Q">Quartile (25%)</SelectItem>
                              <SelectItem value="H">High (30%)</SelectItem>
                            </SelectContent>
                          </Select>
                          {(() => {
                            const isUsingCustomEmoji = selectedLogo === 'custom-emoji' && !!customEmoji;
                            const isUsingCustomLogo = selectedLogo === 'custom-logo' && !!customLogo;
                            const features = [];
                            if (removeBackground) features.push("background removal");
                            if (isUsingCustomEmoji) features.push("custom emoji");
                            if (isUsingCustomLogo) features.push("custom logo");
                            
                            return features.length > 0 && (
                              <p className="text-xs text-gray-600">
                                Error correction level was automatically set to High for optimal scanning with {features.join(", ")}
                              </p>
                            );
                          })()}
                        </div>

                        {/* Download Settings */}
                        <div className="space-y-4">
                          <Button
                            variant="outline"
                            onClick={() => setDownloadSettingsOpen(!downloadSettingsOpen)}
                            className="w-full justify-center bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
                            data-testid="button-download-settings"
                          >
                            Download Settings
                            <span className="transform transition-transform duration-200" style={{
                              transform: downloadSettingsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}>
                              ↓
                            </span>
                          </Button>

                          {downloadSettingsOpen && (
                            <div className="space-y-4 border border-blue-200 rounded-lg p-4 bg-blue-50 dark:bg-blue-900 dark:border-blue-700">
                              {/* Download Image Size */}
                              <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Export Resolution: {downloadSize} x {downloadSize} px</Label>
                                <Slider
                                  value={[downloadSize]}
                                  onValueChange={(value) => setDownloadSize(value[0])}
                                  max={2000}
                                  min={200}
                                  step={200}
                                  className="w-full"
                                />
                                <div className="text-xs text-gray-500">
                                  Higher resolution = better quality for printing
                                </div>
                              </div>

                              {/* Download Format Options */}
                              <div className="space-y-3">
                                <Label className="text-slate-700 font-medium">Download as:</Label>
                                
                                {/* Format buttons - showing supported formats */}
                                <div className="grid grid-cols-4 gap-3">
                                  {['PNG', 'JPEG', 'WEBP', 'SVG'].map((format) => (
                                    <Button
                                      key={format}
                                      variant={downloadFormat === format ? "default" : "outline"}
                                      className="h-12 text-sm font-semibold"
                                      onClick={() => setDownloadFormat(format)}
                                      data-testid={`button-format-${format.toLowerCase()}`}
                                    >
                                      {format}
                                    </Button>
                                  ))}
                                </div>

                                {/* JPEG transparency warning - only show when JPEG is selected */}
                                {downloadFormat === 'JPEG' && (
                                  <div className="text-sm text-orange-600 text-center italic font-medium">
                                    ⚠️ *jpeg does not support transparent colors
                                  </div>
                                )}

                                {/* Embed QR Code section */}
                                <div className="space-y-2">
                                  <Label className="text-slate-700 font-medium">Embed QR Code:</Label>
                                  <Button
                                    variant="default"
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                                    onClick={handleEmbedQR}
                                    data-testid="button-embed-qr"
                                  >
                                    Embed QR Code
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="logo" className="space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Logo Type</Label>
                          
                          {/* First row - Main options */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            {logoOptions.filter(option => option.type === 'main').map((option) => (
                              <Button
                                key={option.value}
                                variant={selectedLogo === option.value ? "default" : "outline"}
                                className="h-16 flex flex-col items-center justify-center"
                                onClick={() => setSelectedLogo(option.value)}
                                data-testid={`button-logo-${option.value}`}
                              >
                                {option.icon ? (
                                  <option.icon className="text-lg mb-1" size={24} />
                                ) : (
                                  <span className="text-lg mb-1">{option.preview}</span>
                                )}
                                {option.label && <span className="text-xs">{option.label}</span>}
                              </Button>
                            ))}
                          </div>
                          
                          {/* Second row - Social media icons (scrollable) */}
                          <div className="overflow-x-auto">
                            <div className="flex gap-3 pb-2 min-w-max">
                              {logoOptions.filter(option => option.type === 'social').map((option) => (
                                <Button
                                  key={option.value}
                                  variant="outline"
                                  className={`h-16 w-16 flex flex-col items-center justify-center flex-shrink-0 ${
                                    selectedLogo === option.value 
                                      ? 'border-2 border-blue-500 bg-blue-600 dark:bg-blue-950' 
                                      : 'border border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => setSelectedLogo(option.value)}
                                >
                                  {option.icon ? (
                                    <option.icon 
                                      className="text-lg mb-1" 
                                      style={{ 
                                        color: selectedLogo === option.value ? '#ffffff' : getBrandColor(option.value) 
                                      }} 
                                    />
                                  ) : (
                                    <span className="text-lg mb-1">{option.preview}</span>
                                  )}
                                  {option.label && <span className="text-xs text-center leading-tight">{option.label}</span>}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Custom Logo Upload */}
                        {selectedLogo === 'custom-logo' && (
                          <div className="space-y-4">
                            <ImageUpload
                              label="Upload Custom Logo"
                              currentImage={customLogo}
                              onImageUpload={setCustomLogo}
                              onImageRemove={() => setCustomLogo('')}
                              maxWidth={200}
                              maxHeight={200}
                              enableCropping={true}
                            />
                          </div>
                        )}

                        {/* Custom Emoji Input */}
                        {selectedLogo === 'custom-emoji' && (
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Enter Custom Emoji ( No text allowed)</Label>
                            <Input
                              type="text"
                              placeholder="😀"
                              value={customEmoji}
                              onChange={(e) => handleCustomEmojiChange(e.target.value)}
                              className="h-12 text-2xl text-center"
                              maxLength={2}
                            />
                            {customEmoji && !validateEmoji(customEmoji) && (
                              <p className="text-sm text-red-500">
                                Please enter only one emoji, no text
                              </p>
                            )}
                          </div>
                        )}

                        {selectedLogo !== 'none' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-slate-700 font-medium">Logo Size (%)</Label>
                              <Slider
                                value={[logoSize]}
                                onValueChange={(value) => setLogoSize(value[0])}
                                max={25}
                                min={10}
                                step={5}
                                className="w-full"
                              />
                              <div className="text-sm text-gray-500">{logoSize}%</div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-slate-700 font-medium">Logo Opacity (%)</Label>
                              <Slider
                                value={[logoOpacity]}
                                onValueChange={(value) => setLogoOpacity(value[0])}
                                max={100}
                                min={20}
                                step={10}
                                className="w-full"
                              />
                              <div className="text-sm text-gray-500">{logoOpacity}%</div>
                            </div>
                          </div>
                        )}

                        {selectedLogo !== 'none' && (
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="removeBackground"
                              checked={removeBackground}
                              onCheckedChange={(checked) => {
                                userToggledRemoveBgRef.current = true;
                                setRemoveBackground(checked);
                              }}
                            />
                            <Label htmlFor="removeBackground" className="text-slate-700 font-medium">Remove background</Label>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                  </Tabs>
                </TabsContent>

              </Tabs>
              
              {/* Combined Action Buttons */}
              <div className="mt-4">
                {isGenerating ? (
                  <Button 
                    className="w-full h-12 text-base font-medium bg-gray-400 text-white" 
                    size="lg" 
                    disabled={true}
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating QR Code...
                  </Button>
                ) : qrResult ? (
                  <div className="flex gap-2 w-full">
                    {/* Download Button - Main Action */}
                    <Button 
                      className="flex-1 h-12 text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white" 
                      size="lg" 
                      onClick={downloadQR}
                      data-testid="button-download-qr"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    
                    {/* Copy Button - Compact */}
                    <Button 
                      variant="outline" 
                      className="w-12 h-12 p-0 border-gray-300 hover:bg-gray-100" 
                      onClick={copyQR}
                      title="Copy QR Code"
                      data-testid="button-copy-qr"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    
                    {/* Share Button - Compact */}
                    <Button 
                      variant="outline" 
                      className="w-12 h-12 p-0 border-gray-300 hover:bg-gray-100" 
                      onClick={shareQR}
                      title="Share QR Code"
                      data-testid="button-share-qr"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full">
                    {/* Disabled Download Button - Shows preview */}
                    <Button 
                      className="flex-1 h-12 text-base font-medium bg-gray-200 text-gray-500 cursor-not-allowed" 
                      size="lg" 
                      disabled={true}
                      data-testid="button-download-qr-disabled"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    
                    {/* Disabled Copy Button */}
                    <Button 
                      variant="outline" 
                      className="w-12 h-12 p-0 border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" 
                      disabled={true}
                      title="Copy QR Code (Enter data first)"
                      data-testid="button-copy-qr-disabled"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    {/* Disabled Share Button */}
                    <Button 
                      variant="outline" 
                      className="w-12 h-12 p-0 border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" 
                      disabled={true}
                      title="Share QR Code (Enter data first)"
                      data-testid="button-share-qr-disabled"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Embed QR Code Dialog */}
      <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Embed QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">HTML Code:</Label>
              <div className="relative">
                <Textarea
                  value={qrResult ? `<img src="${qrResult}" alt="QR Code" width="${downloadSize}" height="${downloadSize}" style="max-width: 100%; height: auto;" />` : ''}
                  readOnly
                  className="min-h-[120px] font-mono text-sm"
                  placeholder="Generate a QR code first to see the embed code"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    if (qrResult) {
                      navigator.clipboard.writeText(`<img src="${qrResult}" alt="QR Code" width="${downloadSize}" height="${downloadSize}" style="max-width: 100%; height: auto;" />`);
                      generatorToast.success('Embed code copied to clipboard!');
                    }
                  }}
                  disabled={!qrResult}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview:</Label>
              <div className="border rounded-lg p-4 bg-gray-50 text-center">
                {qrResult ? (
                  <img 
                    src={qrResult} 
                    alt="QR Code Preview" 
                    className="mx-auto"
                    style={{ maxWidth: '200px', height: 'auto' }}
                  />
                ) : (
                  <div className="text-gray-500 py-8">
                    Generate a QR code first to see the preview
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>Note:</strong> The embed code uses the current QR code data. The size will be {downloadSize}×{downloadSize} pixels when embedded.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Unified Color Selector Modal */}
      <ColorSelector
        isOpen={colorSelectorOpen !== 'none'}
        onClose={() => setColorSelectorOpen('none')}
        currentColor={currentColorForSelection}
        onColorSelect={handleColorSelect}
        title={
          colorSelectorOpen === 'square' ? 'Select square color' :
          colorSelectorOpen === 'background' ? 'Select background color' :
          colorSelectorOpen === 'innerEye' ? 'Select inner eye color' :
          colorSelectorOpen === 'outerEye' ? 'Select outer eye color' :
          'Select color'
        }
      />
    </div>
  );
};

export default QRGenerator;