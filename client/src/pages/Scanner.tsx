import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Image, Copy, QrCode, Share2, Eye, Zap, Shield, CheckCircle, Smartphone, MousePointer, Upload, Download, ArrowUp, AlertCircle, CheckCircle2, XCircle, Trash2, ScanLine, ExternalLink, Calendar, DollarSign, Video, Mail, Phone, MessageSquare, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Html5Qrcode } from "html5-qrcode";
import Header from "@/components/Header";
import ScannerMessages from "@/components/ScannerMessages";
import { scannerToast } from "@/lib/toast-utils";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { getSEOByRoute, updatePageSEO } from "@/lib/seo-config";
import { detectQRCodeType, QRCodeInfo } from "@/lib/qr-detector";
import { usePrefetch } from "@/hooks/usePrefetch";
import ShareButton from "@/components/ShareButton";

const Scanner = () => {
  const navigate = useNavigate();
  
  // Get SEO config for headings
  const seoConfig = getSEOByRoute('/scanner');
  const h1Text = seoConfig.headings?.h1 || "Scan & Decode QR Codes";
  const h2List = seoConfig.headings?.h2 || [];
  
  usePrefetch({ currentPage: 'scanner', delay: 1000 });
  
  // Update SEO for Scanner page
  useEffect(() => {
    updatePageSEO(seoConfig);
  }, []);
  interface ScanResult {
    id: string;
    data: string;
    imageUrl?: string;
    timestamp: number;
  }
  
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [activeMode, setActiveMode] = useState<"default" | "camera" | "image">("default");
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const isMountedRef = useRef(true);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const [processingImages, setProcessingImages] = useState<boolean>(false);
  const [stickyHeaderEnabled, setStickyHeaderEnabled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showShareButton, setShowShareButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create refs for all sections
  const scannerSectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howToUseRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    sectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const onScanSuccess = useCallback((decodedText: string) => {
    const newResult: ScanResult = {
      id: Date.now().toString(),
      data: decodedText,
      timestamp: Date.now()
    };
    setScanResults([newResult]);
    stopScanning();
    setActiveMode("default");
    
    // Trigger scanning success event for dynamic messages
    const event = new CustomEvent('qrCodeScanned');
    window.dispatchEvent(event);
  }, []);

  const onScanFailure = useCallback((error: string) => {
    // Throttle logging to avoid spam
    const now = Date.now();
    const lastLog = (window as any).__lastScanFailLog || 0;
    if (now - lastLog > 5000) { // Log at most once every 5 seconds
      // Scan failed
      (window as any).__lastScanFailLog = now;
    }
  }, []);

  const waitForVideoReady = (videoElement: HTMLVideoElement): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
        resolve();
        return;
      }
      
      let timeoutId: number | undefined;
      const cleanup = () => {
        videoElement.removeEventListener('loadeddata', onReady);
        videoElement.removeEventListener('canplay', onReady);
        if (timeoutId) clearTimeout(timeoutId);
      };
      
      const onReady = () => {
        cleanup();
        resolve();
      };
      
      videoElement.addEventListener('loadeddata', onReady);
      videoElement.addEventListener('canplay', onReady);
      
      // Timeout after 5 seconds
      timeoutId = window.setTimeout(() => {
        cleanup();
        reject(new Error('Video did not load within timeout'));
      }, 5000);
    });
  };

  const startCameraScanning = useCallback(async () => {
    // Prevent concurrent starts or if unmounted
    if (isStartingCamera || isScanning || !isMountedRef.current) {
      return;
    }
    
    setIsStartingCamera(true);
    let instance: Html5Qrcode | null = null;
    
    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this device");
      }

      // Quick permission check (and immediately stop to avoid leak)
      const testStream = await navigator.mediaDevices.getUserMedia({ video: true });
      testStream.getTracks().forEach(track => track.stop());
      
      // Ensure DOM element exists and is visible
      const scannerElement = document.getElementById("scanner-area");
      if (!scannerElement) {
        throw new Error("Scanner element not found");
      }

      // Dynamically import Html5Qrcode to reduce initial bundle size
      const { Html5Qrcode } = await import("html5-qrcode");
      instance = new Html5Qrcode("scanner-area");
      
      // Start scanner with optimized settings for Replit environment
      await instance.start(
        { facingMode: "environment" },
        {
          fps: 5, // Reduce FPS for better performance in cloud environment
          qrbox: { width: 200, height: 200 },
          aspectRatio: 1.0,
          disableFlip: false
        },
        onScanSuccess,
        onScanFailure
      );
      
      // Set state only after successful start
      setHtml5QrCode(instance);
      
      // Wait for video to be ready before setting isScanning
      const videoElement = document.querySelector("#scanner-area video") as HTMLVideoElement;
      if (videoElement && isMountedRef.current) {
        try {
          await waitForVideoReady(videoElement);
          if (isMountedRef.current) setIsScanning(true);
        } catch (videoErr) {
          // Video readiness timeout
          // Try to continue anyway, but show warning
          if (isMountedRef.current) {
            setIsScanning(true);
            scannerToast.warning("Camera may take a moment to initialize", {
              icon: <Camera className="h-4 w-4" />
            });
          }
        }
      } else if (isMountedRef.current) {
        setIsScanning(true);
      }
      
    } catch (err) {
      // Camera scanning failed
      
      // Cleanup the instance created in this scope
      if (instance) {
        try {
          try { await instance.stop(); } catch (stopErr) { /* ignore */ }
          try { await instance.clear(); } catch (clearErr) { /* ignore */ }
        } catch (cleanupErr) {
          // Cleanup error occurred
        }
      }
      
      if (!isMountedRef.current) return;
      
      let errorMessage = "Unable to access camera. Please check permissions.";
      
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.message.includes("Permission denied")) {
          errorMessage = "Camera permission denied. Please allow camera access and try again.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found on this device.";
        } else if (err.name === "NotSupportedError") {
          errorMessage = "Camera not supported on this browser.";
        } else if (err.name === "NotReadableError" || err.message.includes("Could not start video source")) {
          errorMessage = "Camera is busy or unavailable. Please try again in a moment.";
        } else if (err.message.includes("not found")) {
          errorMessage = "Scanner initialization failed. Please try again.";
        }
      }
      
      scannerToast.error(errorMessage, {
        icon: <Camera className="h-4 w-4" />
      });
      setActiveMode("default");
      setIsScanning(false);
      setHtml5QrCode(null);
    } finally {
      if (isMountedRef.current) setIsStartingCamera(false);
    }
  }, [isStartingCamera, isScanning, onScanSuccess, onScanFailure]);

  // Set activeMode to camera when starting camera scanning
  const handleStartCamera = useCallback(() => {
    setActiveMode("camera");
  }, []);

  const stopScanning = useCallback(async () => {
    if (html5QrCode) {
      try {
        // Attempt to stop unconditionally for robust cleanup
        try {
          await html5QrCode.stop();
        } catch (stopErr) {
          // Ignore if already stopped or in invalid state
        }
        
        // Await clear to ensure DOM cleanup is complete
        await html5QrCode.clear();
        
        // Clean up any remaining video streams
        const videoElement = document.querySelector("#scanner-area video");
        if (videoElement) {
          const stream = (videoElement as HTMLVideoElement).srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        }
        
        // Reset states only after full cleanup
        if (isMountedRef.current) {
          setIsScanning(false);
          setHtml5QrCode(null);
        }
        
      } catch (err) {
        // Failed to stop scanning
        // Force reset states even if stopping fails
        if (isMountedRef.current) {
          setIsScanning(false);
          setHtml5QrCode(null);
        }
      }
    }
  }, [html5QrCode, isScanning]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Calculate how many more images we can add
    const remainingSlots = 10 - uploadedImageUrls.length;
    const totalSelected = files.length;
    
    // Early guard for when no slots available
    if (remainingSlots <= 0) {
      scannerToast.warning("Maximum 10 images reached", {
        description: "Please clear some images before adding new ones.",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 4000
      });
      // Reset file input
      event.target.value = '';
      return;
    }
    
    // Handle selection overflow
    if (totalSelected > remainingSlots) {
      scannerToast.warning(`Selected ${totalSelected} images, adding first ${remainingSlots}`, {
        description: `Maximum 10 images allowed. You already have ${uploadedImageUrls.length} image(s).`,
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 4000
      });
    }

    // Limit to remaining slots
    const limitedFiles = files.slice(0, remainingSlots);
    setProcessingImages(true);
    setActiveMode("image");

    // Create preview URLs for new images
    const newImageUrls = limitedFiles.map(file => URL.createObjectURL(file));
    // Append to existing images
    setUploadedImageUrls(prev => [...prev, ...newImageUrls]);

    const newResults: ScanResult[] = [];
    const failedScans: string[] = [];

    for (let i = 0; i < limitedFiles.length; i++) {
      const file = limitedFiles[i];
      const imageUrl = newImageUrls[i];
      
      try {
        // Create temporary scanner element for each scan
        const tempElementId = `temp-scanner-${Date.now()}-${i}`;
        const tempDiv = document.createElement('div');
        tempDiv.id = tempElementId;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        // Dynamically import Html5Qrcode to reduce initial bundle size
        const { Html5Qrcode } = await import("html5-qrcode");
        const qrCodeScanner = new Html5Qrcode(tempElementId);
        const result = await qrCodeScanner.scanFile(file, true);
        
        const resultItem: ScanResult = {
          id: `${Date.now()}-${uploadedImageUrls.length + i}`,
          data: result,
          imageUrl: imageUrl,
          timestamp: Date.now()
        };
        newResults.push(resultItem);
        
        // Trigger scanning success event for each successful scan
        const scanEvent = new CustomEvent('qrCodeScanned');
        window.dispatchEvent(scanEvent);
        
        // Cleanup
        qrCodeScanner.clear();
        document.body.removeChild(tempDiv);
        
      } catch (err) {
        // Image scanning failed - no QR code found
        failedScans.push(`Image ${i + 1}: No QR code found`);
        
        // Still add as failed result for user reference
        const failedResult: ScanResult = {
          id: `failed-${Date.now()}-${uploadedImageUrls.length + i}`,
          data: `❌ No QR code found in this image`,
          imageUrl: imageUrl,
          timestamp: Date.now()
        };
        newResults.push(failedResult);
      }
    }

    setScanResults(prev => [...prev, ...newResults]);
    setProcessingImages(false);
    
    // Show beautiful summary for scan results
    if (failedScans.length > 0) {
      const successCount = newResults.length - failedScans.length;
      
      if (successCount > 0 && failedScans.length > 0) {
        // Mixed results
        scannerToast.toast(`Scanned ${limitedFiles.length} images`, {
          description: `✅ ${successCount} successful • ❌ ${failedScans.length} failed`,
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 6000,
          action: {
            label: "View Details",
            onClick: () => {
              scannerToast.info("Failed Images:", {
                description: failedScans.join(', '),
                duration: 8000,
                icon: <XCircle className="h-4 w-4" />
              });
            }
          }
        });
      } else if (failedScans.length === limitedFiles.length) {
        // All failed
        scannerToast.error(`No QR codes found in ${limitedFiles.length} image${limitedFiles.length > 1 ? 's' : ''}`, {
          description: "Try uploading clearer images with visible QR codes",
          icon: <XCircle className="h-4 w-4" />,
          duration: 6000
        });
      }
    } else if (newResults.length > 0) {
      // All successful
      scannerToast.success(`Successfully scanned ${newResults.length} QR code${newResults.length > 1 ? 's' : ''}!`, {
        description: `${newResults.length > 1 ? 'All images processed' : 'Image processed'} successfully`,
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 4000
      });
    }
    
    // Keep images visible for user interaction - no auto-removal
    
    // Reset file input
    event.target.value = '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    scannerToast.success("Copied to clipboard!", {
      icon: <Copy className="h-4 w-4" />
    });
  };

  const shareResult = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code Result',
          text: text,
        });
      } catch (err) {
        // Error sharing
        copyToClipboard(text); // fallback to copy
      }
    } else {
      copyToClipboard(text); // fallback to copy if share not supported
    }
  };

  const copyAllResults = () => {
    const allResults = scanResults
      .filter(result => !result.data.startsWith('❌'))
      .map(result => result.data)
      .join('\n\n');
    copyToClipboard(allResults);
  };

  const shareAllResults = async () => {
    const allResults = scanResults
      .filter(result => !result.data.startsWith('❌'))
      .map(result => result.data)
      .join('\n\n');
    await shareResult(allResults);
  };

  // Individual image clear function
  const clearImage = (indexToRemove: number) => {
    // Revoke object URL to prevent memory leak
    const urlToRevoke = uploadedImageUrls[indexToRemove];
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
    }
    
    const newImageUrls = uploadedImageUrls.filter((_, index) => index !== indexToRemove);
    setUploadedImageUrls(newImageUrls);
    
    // Remove corresponding scan results
    const newScanResults = scanResults.filter(result => result.imageUrl !== urlToRevoke);
    setScanResults(newScanResults);
    
    // If no images left, reset to default mode
    if (newImageUrls.length === 0) {
      setActiveMode("default");
    }
    
    scannerToast.success("Image removed", {
      icon: <Trash2 className="h-4 w-4" />
    });
  };

  // Clear all images function
  const clearAllImages = () => {
    // Cleanup image URLs to prevent memory leaks
    uploadedImageUrls.forEach(url => {
      URL.revokeObjectURL(url);
    });
    
    setUploadedImageUrls([]);
    setActiveMode("default");
    setScanResults([]);
    
    scannerToast.success("All images cleared", {
      icon: <Trash2 className="h-4 w-4" />
    });
  };

  const handleScanFromImage = () => {
    // Clear previous results and images
    setScanResults([]);
    setUploadedImageUrls([]);
    
    // Show guidance toast before opening file picker
    scannerToast.info("Select up to 10 images", {
      description: "Choose clear images containing QR codes for best results",
      icon: <Image className="h-4 w-4" />,
      duration: 3000
    });
    
    fileInputRef.current?.click();
  };

  const handleAddMoreImages = () => {
    const remainingSlots = 10 - uploadedImageUrls.length;
    scannerToast.info(`Add up to ${remainingSlots} more image${remainingSlots > 1 ? 's' : ''}`, {
      description: "Choose clear images containing QR codes for best results",
      icon: <Image className="h-4 w-4" />,
      duration: 3000
    });
    
    fileInputRef.current?.click();
  };

  // Mode-driven camera lifecycle control
  useEffect(() => {
    if (activeMode === "camera" && !isScanning && !isStartingCamera && isMountedRef.current) {
      startCameraScanning();
    } else if (activeMode !== "camera" && (isScanning || html5QrCode) && isMountedRef.current) {
      stopScanning();
    }
  }, [activeMode, isScanning, isStartingCamera, startCameraScanning, stopScanning]);

  // Intersection observer for dynamic sticky header - enables/disables based on scanner section visibility
  useEffect(() => {
    if (!scannerSectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Disable sticky header when scanner section is visible (hero + scanner sections)
        // Enable sticky header when scrolled past scanner section
        if (entry.isIntersecting) {
          setStickyHeaderEnabled(false);
          setHeaderVisible(false);
          setShowShareButton(false);
        } else {
          setStickyHeaderEnabled(true);
          setHeaderVisible(true);
          setShowShareButton(true);
        }
      },
      {
        rootMargin: '0px 0px -50% 0px', // Trigger when scanner section is 50% out of view
        threshold: 0
      }
    );

    observer.observe(scannerSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Component lifecycle - run strictly once
  useEffect(() => {
    isMountedRef.current = true;
    setIsMounted(true);
    
    return () => {
      isMountedRef.current = false;
      setIsMounted(false);
      stopScanning();
      // Cleanup: revoke any remaining object URLs to prevent memory leaks
      uploadedImageUrls.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <StructuredData pageType="scanner" />
      <Header 
        stickyHeaderEnabled={stickyHeaderEnabled}
        pageType="scanner"
        scannerSectionRef={scannerSectionRef}
        featuresRef={featuresRef}
        howToUseRef={howToUseRef}
        benefitsRef={benefitsRef}
      />
      
      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              {h1Text}
            </h1>
            {/* SEO H2 headings - hidden but crawlable */}
            {h2List.map((h2: string, index: number) => (
              <h2 key={index} className="sr-only">{h2}</h2>
            ))}
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload or capture QR codes instantly using your camera or image files
            </p>
          </div>
          
          {/* Hero Features */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-purple-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-600">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Camera & Image Support</span>
            </div>
            <div className="flex items-center gap-2 text-violet-600">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Batch Scanning</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={() => navigate('/')}
              className="group bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                Create QR Codes
                <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </button>
            
            <button 
              onClick={() => navigate('/download')}
              className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                Download App
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </button>
          </div>
          
          {/* Scanner Display Container */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border-4 border-slate-700 overflow-hidden relative h-48 md:h-56">
              {/* Scanner Display */}
              <div className="m-4 bg-black rounded-lg h-40 md:h-48 relative">
                {/* Screen Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-indigo-400/20 rounded-lg"></div>
                
                {/* Dynamic Content */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center px-6">
                    <div className="text-purple-400 mb-3">
                      {activeMode === "camera" && isScanning ? (
                        <div className="animate-pulse">
                          <Camera className="h-8 w-8 mx-auto" />
                        </div>
                      ) : processingImages ? (
                        <div className="animate-spin">
                          <QrCode className="h-8 w-8 mx-auto" />
                        </div>
                      ) : scanResults.length > 0 ? (
                        <div className="text-emerald-400">
                          <QrCode className="h-8 w-8 mx-auto" />
                        </div>
                      ) : (
                        <QrCode className="h-8 w-8 mx-auto" />
                      )}
                    </div>
                    {isScanning ? (
                      <div>
                        <h2 className="text-white text-lg md:text-xl font-semibold mb-2">Scanning...</h2>
                        <p className="text-purple-300 text-sm md:text-base opacity-90">Point camera at QR code</p>
                      </div>
                    ) : processingImages ? (
                      <div>
                        <h2 className="text-white text-lg md:text-xl font-semibold mb-2">Processing Images...</h2>
                        <p className="text-purple-300 text-sm md:text-base opacity-90">Decoding QR codes...</p>
                      </div>
                    ) : scanResults.length > 0 ? (
                      <div>
                        <h2 className="text-white text-lg md:text-xl font-semibold mb-2">{scanResults.length} Result{scanResults.length > 1 ? 's' : ''} Found!</h2>
                        <p className="text-emerald-300 text-sm md:text-base opacity-90">Scan complete - check results below!</p>
                      </div>
                    ) : (
                      <ScannerMessages />
                    )}
                  </div>
                </div>
                
                {/* Scan Lines Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse pointer-events-none rounded-lg"></div>
              </div>
              
              {/* Scanner Control Buttons */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 space-y-2">
                <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                <div className={`w-3 h-3 rounded-full ${isScanning || processingImages ? 'bg-purple-500 animate-pulse' : 'bg-slate-600'}`}></div>
              </div>
              
              {/* Scanner Base */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-slate-700 rounded-b-lg"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">

        {/* QR Scanner Section - Simplified Structure */}
        <section ref={scannerSectionRef} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Main Scanner Container - Removed extra wrapper */}
          <div className="bg-gray-50 rounded-lg p-6 md:p-8 border mb-6 md:mb-8">
            {/* Scanner Display Area - Direct without wrapper */}
            <div className="w-full h-64 md:h-80 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white relative mb-6">
                {/* Dedicated Scanner Mount - Never render React children inside this */}
                <div 
                  id="scanner-area" 
                  ref={scannerContainerRef}
                  className="absolute inset-0 w-full h-full rounded-lg"
                  style={{ display: activeMode === "camera" ? "block" : "none" }}
                />
                
                {/* React-managed UI overlays - separate from scanner mount */}
                {activeMode === "default" && (
                  <div className="text-center z-10">
                    <QrCode className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code</h2>
                    <p className="text-gray-600">Choose an option to scan a QR code <span className="text-sm text-gray-500">[upload images: max 10 supported]</span></p>
                  </div>
                )}
                
                {activeMode === "image" && !processingImages && uploadedImageUrls.length > 0 && (
                  <div className="w-full h-full">
                    {/* Horizontal Scrollable Image Carousel */}
                    <div className="h-full overflow-x-auto overflow-y-hidden">
                      <div className="flex gap-3 h-full p-2" style={{ width: `${Math.min(10, uploadedImageUrls.length + (uploadedImageUrls.length < 10 ? 1 : 0)) * 120 + (Math.min(10, uploadedImageUrls.length + (uploadedImageUrls.length < 10 ? 1 : 0)) - 1) * 12}px` }}>
                        {uploadedImageUrls.map((url, index) => (
                          <div key={index} className="flex-shrink-0 relative group">
                            {/* Image Container */}
                            <div className="w-28 h-48 bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
                              <img 
                                src={url} 
                                alt={`Uploaded QR Code ${index + 1}`} 
                                className="w-full h-36 object-cover"
                              />
                              {/* Individual Clear Button */}
                              <div className="h-12 flex items-center justify-center bg-gray-50">
                                <button
                                  onClick={() => clearImage(index)}
                                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  data-testid={`button-clear-image-${index}`}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Clear
                                </button>
                              </div>
                            </div>
                            {/* Image Number Badge */}
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                        
                        {/* Add More Images + Icon (only show if less than 10 images) */}
                        {uploadedImageUrls.length < 10 && (
                          <div className="flex-shrink-0 relative group">
                            <button
                              onClick={handleAddMoreImages}
                              className="w-28 h-48 bg-white border-2 border-dashed border-purple-300 rounded-lg overflow-hidden shadow-sm hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
                              data-testid="button-add-more-images"
                            >
                              {/* + Icon Container - Centered */}
                              <div className="h-full flex flex-col items-center justify-center">
                                <div className="text-purple-400 group-hover:text-purple-600 transition-colors text-center">
                                  <div className="w-16 h-16 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mb-3 transition-colors mx-auto">
                                    <span className="text-3xl font-bold">+</span>
                                  </div>
                                  <p className="text-xs text-center px-2">Add Image ({10 - uploadedImageUrls.length} left)</p>
                                </div>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {processingImages && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Images...</h2>
                    <p className="text-gray-600">Scanning for QR codes</p>
                  </div>
                )}
                
                {activeMode === "camera" && !isScanning && (
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Initializing camera...</p>
                  </div>
                )}
              </div>
            
            {/* Action Buttons - Simplified without extra wrapper */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            
            <div className="flex flex-col gap-4">
              {uploadedImageUrls.length > 0 ? (
                <button 
                  onClick={clearAllImages}
                  className="group w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  data-testid="button-clear-all"
                >
                  <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Clear All Images
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleScanFromImage}
                    className="group w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    disabled={isScanning || processingImages}
                    data-testid="button-scan-image"
                  >
                    <Image className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {processingImages ? "Processing Images..." : "Upload Images"}
                  </button>
                  
                  <button 
                    onClick={isScanning ? stopScanning : handleStartCamera}
                    className={`group w-full py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                      isScanning 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                        : 'bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white'
                    }`}
                    data-testid="button-scan-camera"
                  >
                    <Camera className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {isScanning ? "Stop Camera" : "Start Camera Scan"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Scanned Results - Simplified structure */}
          <div className="bg-gray-50 rounded-lg p-6 md:p-8 border">
            <div className="flex items-center gap-2 mb-6">
              <QrCode className="h-5 w-5 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Scanned Data {scanResults.length > 0 && `(${scanResults.length})`}
              </h3>
            </div>
            
            <div className="min-h-32 p-4 md:p-6 bg-white rounded-lg border-2 border-dashed border-gray-300 mb-6 max-h-80 overflow-y-auto">
              {scanResults.length > 0 ? (
                <div className="space-y-4">
                  {scanResults.map((result, index) => {
                    const qrInfo = detectQRCodeType(result.data);
                    const isFailed = result.data.startsWith('❌');
                    
                    return (
                      <div key={result.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {result.imageUrl && (
                              <img 
                                src={result.imageUrl} 
                                alt={`Scan ${index + 1}`}
                                className="w-12 h-12 object-cover rounded border"
                              />
                            )}
                            <div>
                              <span className="text-sm font-medium text-gray-600">Result {index + 1}</span>
                              <p className="text-xs text-gray-400">
                                {new Date(result.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => copyToClipboard(result.data)}
                              className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                              disabled={isFailed}
                              data-testid={`button-copy-${index}`}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => shareResult(result.data)}
                              className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700"
                              disabled={isFailed}
                              data-testid={`button-share-${index}`}
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Rich Display with Parsed Fields */}
                        {!isFailed && qrInfo.parsedFields && qrInfo.parsedFields.length > 0 ? (
                          <div className="space-y-3">
                            {/* Type Badge */}
                            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              {qrInfo.type === 'url' && '🔗 Link'}
                              {qrInfo.type === 'text' && '📝 Text'}
                              {qrInfo.type === 'email' && '✉️ Email'}
                              {qrInfo.type === 'phone' && '📞 Phone'}
                              {qrInfo.type === 'sms' && '💬 SMS'}
                              {qrInfo.type === 'whatsapp' && '💚 WhatsApp'}
                              {qrInfo.type === 'wifi' && '📶 WiFi'}
                              {qrInfo.type === 'vcard' && '👤 Contact'}
                              {qrInfo.type === 'enhanced-vcard' && '🪪 Contact'}
                              {qrInfo.type === 'event' && '📅 Event'}
                              {qrInfo.type === 'zoom' && '🎥 Zoom'}
                              {qrInfo.type === 'paypal' && '💰 PayPal'}
                              {qrInfo.type === 'image' && '🖼️ Image'}
                            </div>
                            
                            {/* Parsed Fields Display */}
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                              {qrInfo.parsedFields.map((field, fieldIndex) => (
                                <div key={fieldIndex} className="flex items-start">
                                  <span className="text-xs font-semibold text-gray-600 min-w-[120px]">{field.label}:</span>
                                  <span className="text-sm text-gray-800 break-all flex-1">{field.value}</span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                              {qrInfo.actionUrl && qrInfo.type !== 'event' && (
                                <a
                                  href={qrInfo.actionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-medium transition-all text-sm"
                                  data-testid={`button-action-${index}`}
                                >
                                  {qrInfo.type === 'paypal' && <DollarSign className="h-4 w-4" />}
                                  {qrInfo.type === 'zoom' && <Video className="h-4 w-4" />}
                                  {qrInfo.type === 'url' && <ExternalLink className="h-4 w-4" />}
                                  {qrInfo.type === 'email' && <Mail className="h-4 w-4" />}
                                  {qrInfo.type === 'phone' && <Phone className="h-4 w-4" />}
                                  {qrInfo.type === 'sms' && <MessageSquare className="h-4 w-4" />}
                                  {qrInfo.type === 'whatsapp' && <MessageCircle className="h-4 w-4" />}
                                  {qrInfo.type === 'image' && <Image className="h-4 w-4" />}
                                  {qrInfo.actionText}
                                </a>
                              )}
                              
                              {/* Google Meet specific - mobile app button */}
                              {qrInfo.type === 'url' && result.data.toLowerCase().includes('meet.google.com') && (
                                <button
                                  onClick={() => {
                                    const meetUrl = result.data;
                                    // Mobile detection
                                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                                    
                                    if (isMobile) {
                                      // Try to open in Google Meet app
                                      const meetCode = meetUrl.match(/meet\.google\.com\/([a-z\-]+)/i)?.[1];
                                      if (meetCode) {
                                        // Try app deeplink first
                                        window.location.href = `googlemeet://${meetCode}`;
                                        // Fallback to web after a short delay
                                        setTimeout(() => {
                                          window.open(meetUrl, '_blank');
                                        }, 1500);
                                      } else {
                                        window.open(meetUrl, '_blank');
                                      }
                                    } else {
                                      // Desktop - just open in browser
                                      window.open(meetUrl, '_blank');
                                    }
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg font-medium transition-all text-sm"
                                  data-testid={`button-open-meet-${index}`}
                                >
                                  <Video className="h-4 w-4" />
                                  Open Meet App
                                </button>
                              )}
                              
                              {/* PayPal specific - mobile app button */}
                              {qrInfo.type === 'paypal' && (
                                <button
                                  onClick={() => {
                                    const paypalUrl = result.data;
                                    // Mobile detection
                                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                                    
                                    if (isMobile) {
                                      // Try to open in PayPal app
                                      const paypalAppUrl = paypalUrl.replace('https://www.paypal.com', 'paypal://');
                                      window.location.href = paypalAppUrl;
                                      // Fallback to web after a short delay
                                      setTimeout(() => {
                                        window.open(paypalUrl, '_blank');
                                      }, 1500);
                                    } else {
                                      // Desktop - just open in browser
                                      window.open(paypalUrl, '_blank');
                                    }
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all text-sm"
                                  data-testid={`button-open-paypal-app-${index}`}
                                >
                                  <DollarSign className="h-4 w-4" />
                                  Open PayPal App
                                </button>
                              )}
                              
                              {/* WiFi specific - show instructions for mobile connection */}
                              {qrInfo.type === 'wifi' && (
                                <div className="w-full mt-1">
                                  <p className="text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                                    📱 <strong>Quick Connect on Mobile:</strong> Scan this WiFi QR code with your phone's camera - it will connect automatically!
                                  </p>
                                </div>
                              )}
                              
                              {/* Event specific - add to calendar or save to notes */}
                              {qrInfo.type === 'event' && (
                                <>
                                  <button
                                    onClick={async () => {
                                      // Create ICS calendar file from event data
                                      const eventInfo = qrInfo.parsedFields || [];
                                      const title = eventInfo.find(f => f.label === 'Event Title')?.value || 'Event';
                                      const location = eventInfo.find(f => f.label === 'Location')?.value || '';
                                      const description = eventInfo.find(f => f.label === 'Description')?.value || '';
                                      const startTime = eventInfo.find(f => f.label === 'Start Time')?.value || '';
                                      const endTime = eventInfo.find(f => f.label === 'End Time')?.value || '';
                                      
                                      // Convert to ICS format date
                                      const formatICSDate = (dateStr: string) => {
                                        if (!dateStr) return '';
                                        return dateStr.replace(/[-:\s]/g, '').replace('T', '') + 'Z';
                                      };
                                      
                                      const icsContent = [
                                        'BEGIN:VCALENDAR',
                                        'VERSION:2.0',
                                        'PRODID:-//My Qrcode Tool//Event//EN',
                                        'BEGIN:VEVENT',
                                        `SUMMARY:${title}`,
                                        location ? `LOCATION:${location}` : '',
                                        description ? `DESCRIPTION:${description}` : '',
                                        startTime ? `DTSTART:${formatICSDate(startTime)}` : '',
                                        endTime ? `DTEND:${formatICSDate(endTime)}` : '',
                                        'END:VEVENT',
                                        'END:VCALENDAR'
                                      ].filter(Boolean).join('\r\n');
                                      
                                      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                                      const file = new File([blob], 'event.ics', { type: 'text/calendar;charset=utf-8' });
                                      
                                      // Mobile detection
                                      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                                      
                                      // Try Web Share API (works best on mobile)
                                      if (isMobile && navigator.share) {
                                        try {
                                          await navigator.share({
                                            files: [file],
                                            title: title,
                                          });
                                          return;
                                        } catch (err: any) {
                                          // User cancelled or not supported, continue to download
                                          if (err.name === 'AbortError') {
                                            return;
                                          }
                                        }
                                      }
                                      
                                      // Direct download with proper MIME type - mobile OS will handle it
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = 'event.ics';
                                      a.type = 'text/calendar';
                                      document.body.appendChild(a);
                                      a.click();
                                      
                                      // Small delay before cleanup
                                      setTimeout(() => {
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                      }, 100);
                                      
                                      scannerToast.success('Tap the downloaded file to open in Calendar app', {
                                        icon: <Calendar className="h-4 w-4" />
                                      });
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-medium transition-all text-sm"
                                    data-testid={`button-add-calendar-${index}`}
                                  >
                                    <Calendar className="h-4 w-4" />
                                    Open Calendar
                                  </button>
                                  
                                  <button
                                    onClick={async () => {
                                      const eventInfo = qrInfo.parsedFields || [];
                                      const eventText = eventInfo.map(f => `${f.label}: ${f.value}`).join('\n');
                                      
                                      // Try Web Share API first (works on mobile and some desktop browsers)
                                      if (navigator.share) {
                                        try {
                                          await navigator.share({
                                            text: eventText,
                                            title: 'Event Details'
                                          });
                                          scannerToast.success('Opening notes app...', {
                                            icon: <Copy className="h-4 w-4" />
                                          });
                                          return;
                                        } catch (err) {
                                          // User cancelled or share failed, fall through to clipboard
                                        }
                                      }
                                      
                                      // Fallback: Copy to clipboard
                                      copyToClipboard(eventText);
                                      scannerToast.success('Event details copied! Paste in your notes app.', {
                                        icon: <Copy className="h-4 w-4" />
                                      });
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all text-sm"
                                    data-testid={`button-open-notes-${index}`}
                                  >
                                    <Copy className="h-4 w-4" />
                                    Open Notes
                                  </button>
                                </>
                              )}
                              
                              {/* vCard specific - save to contacts */}
                              {(qrInfo.type === 'vcard' || qrInfo.type === 'enhanced-vcard') && (
                                <button
                                  onClick={async () => {
                                    try {
                                      const vcardData = result.data;
                                      const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
                                      const file = new File([blob], 'contact.vcf', { type: 'text/vcard;charset=utf-8' });
                                      
                                      // Mobile detection
                                      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                                      
                                      // Try Web Share API (works best on mobile)
                                      if (isMobile && navigator.share) {
                                        try {
                                          await navigator.share({
                                            files: [file],
                                            title: 'Save Contact',
                                          });
                                          return;
                                        } catch (shareErr: any) {
                                          // User cancelled or not supported, continue to download
                                          if (shareErr.name === 'AbortError') {
                                            return;
                                          }
                                        }
                                      }
                                      
                                      // Direct download with proper MIME type - mobile OS will handle it
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = 'contact.vcf';
                                      a.type = 'text/vcard';
                                      document.body.appendChild(a);
                                      a.click();
                                      
                                      // Small delay before cleanup
                                      setTimeout(() => {
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                      }, 100);
                                      
                                      scannerToast.success('Tap the downloaded file to open in Contacts app', {
                                        icon: <Download className="h-4 w-4" />
                                      });
                                    } catch (error) {
                                      // Error saving contact
                                      scannerToast.error('Failed to save contact. Please try again.', {
                                        icon: <Download className="h-4 w-4" />
                                      });
                                    }
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all text-sm"
                                  data-testid={`button-save-contact-${index}`}
                                >
                                  <Download className="h-4 w-4" />
                                  Save to Contacts
                                </button>
                              )}
                              
                            </div>
                          </div>
                        ) : !isFailed ? (
                          <p className="text-sm text-gray-700 break-all" data-testid={`text-scan-result-${index}`}>
                            {qrInfo.displayText || result.data}
                          </p>
                        ) : (
                          <p className="text-sm text-red-600 break-all" data-testid={`text-scan-result-${index}`}>
                            {result.data}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Scan a QR code to view the results here.
                </p>
              )}
            </div>

            {scanResults.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={scanResults.length === 1 ? () => copyToClipboard(scanResults[0].data) : copyAllResults}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2"
                  data-testid="button-copy-all"
                  disabled={scanResults.every(r => r.data.startsWith('❌'))}
                >
                  <Copy className="h-4 w-4" />
                  {scanResults.length === 1 ? "Copy" : "Copy All"}
                </Button>
                
                <Button 
                  onClick={scanResults.length === 1 ? () => shareResult(scanResults[0].data) : shareAllResults}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 flex items-center justify-center gap-2"
                  data-testid="button-share-all"
                  disabled={scanResults.every(r => r.data.startsWith('❌'))}
                >
                  <Share2 className="h-4 w-4" />
                  {scanResults.length === 1 ? "Share" : "Share All"}
                </Button>
              </div>
            )}
          </div>
        </section>
        
        </div> {/* Close max-w-4xl mx-auto */}
      </div>
      
      {/* Features section */}
      <div ref={featuresRef} className="mt-16 py-16 px-4 bg-white rounded-lg shadow-sm mx-4">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-purple-500 text-white rounded-full font-medium mb-6">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Powerful QR Scanning Features
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Decode any QR code instantly with our advanced scanner. Supporting all formats with batch processing capabilities.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-purple-500 mb-3">
              <Camera className="h-12 w-12" />
            </div>
            <h3 className="font-medium text-lg text-slate-700">Live Camera Scanning</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-purple-500 mb-3">
              <Upload className="h-12 w-12" />
            </div>
            <h3 className="font-medium text-lg text-slate-700">Batch Image Processing</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-purple-500 mb-3">
              <Zap className="h-12 w-12" />
            </div>
            <h3 className="font-medium text-lg text-slate-700">Lightning Fast Detection</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-purple-500 mb-3">
              <Eye className="h-12 w-12" />
            </div>
            <h3 className="font-medium text-lg text-slate-700">Multi-Format Support</h3>
          </div>
        </div>
      </div>
      
      {/* How to Use section */}
      <div ref={howToUseRef} className="mt-16 py-16 px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-purple-500 text-white rounded-full font-medium mb-6">
            How to Use
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Scanning QR Codes with My Qrcode Tool is Simple and Fast
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get instant results in seconds with our advanced QR code scanner. Supports camera scanning and batch image processing.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
          
          {/* Step 1 */}
          <div className="relative z-10 flex flex-col md:flex-row items-center mb-24">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">1. Choose Scan Method</h3>
              <p className="text-slate-600 text-lg">
                Start camera scanning for live QR codes or upload images from your device. 
                Support for up to 10 images in batch processing.
              </p>
            </div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-4 border-white shadow-lg flex items-center justify-center">
                <MousePointer className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12"></div>
          </div>
          
          {/* Step 2 */}
          <div className="relative z-10 flex flex-col md:flex-row-reverse items-center mb-24">
            <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0 md:text-left">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">2. Point & Scan</h3>
              <p className="text-slate-600 text-lg">
                Point your camera at the QR code or select images from your gallery. 
                Our advanced algorithms work with blurry images and challenging lighting.
              </p>
            </div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center">
                <Camera className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="md:w-1/2 md:pr-12"></div>
          </div>
          
          {/* Step 3 */}
          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">3. View & Share Results</h3>
              <p className="text-slate-600 text-lg">
                Get instant decoded results with copy, share, and visit options. 
                Perfect for URLs, contacts, WiFi passwords, and more.
              </p>
            </div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border-4 border-white shadow-lg flex items-center justify-center">
                <Share2 className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12"></div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Button 
            variant="default" 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Start Scanning <ArrowUp className="ml-2 rotate-45" />
          </Button>
        </div>
      </div>
      
      {/* Why Choose My Qrcode Tool Scanner section */}
      <div ref={benefitsRef} className="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm mx-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Why Choose My Qrcode Tool Scanner?</h2>
          
          <p className="mb-4 text-slate-600 text-lg">
            Our QR scanner uses advanced computer vision technology for instant and accurate decoding. 
            Works with all QR code types and provides detailed information about each scan.
          </p>
          
          <p className="mb-8 text-slate-600 text-lg">
            Perfect for businesses, events, and personal use. Fast, reliable, and completely free with 
            unlimited scanning capabilities and batch processing features.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <span className="text-slate-700">Lightning-fast QR code detection</span>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <span className="text-slate-700">Support for all QR code formats</span>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <span className="text-slate-700">Batch processing up to 10 images</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <span className="text-slate-700">Works with blurry and damaged codes</span>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <span className="text-slate-700">Privacy-focused - no data stored</span>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <span className="text-slate-700">Free forever with unlimited scans</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                <div className="text-slate-600">QR Code Formats</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">∞</div>
                <div className="text-slate-600">Unlimited Scans</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">10</div>
                <div className="text-slate-600">Batch Processing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Get the App Section - Exact same as generator */}
      <div className="mt-16 py-16 px-4 bg-slate-50 rounded-lg border shadow-sm mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-4">
            <QrCode className="h-12 w-12 mx-auto text-slate-700" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Get the myqrcodetool.com app!</h2>
          <Button 
            className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 text-lg rounded-lg"
            onClick={() => {
              navigate('/download');
            }}
            data-testid="button-download"
          >
            Get app now
          </Button>
        </div>
      </div>
      
      {/* Available Tools Section - Exact same as generator */}
      <div className="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Available Tools</h2>
          <p className="text-slate-600 mb-8">Explore our collection of useful online tools</p>
          <div className="space-y-4">
            <div>
              <a 
                href="https://onlinepanresizer.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xl font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Online Pan Resizer
              </a>
            </div>
            <div>
              <a 
                href="https://example.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xl font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Example.com
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {showShareButton && <ShareButton pageType="scanner" />}
      
      <Footer />
    </div>
  );
};

export default Scanner;