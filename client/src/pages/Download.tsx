import { Button } from "@/components/ui/button";
import { Smartphone, Apple, QrCode, Download as DownloadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import { getSEOByQRType, updatePageSEO } from "@/lib/seo-config";

const Download = () => {
  const navigate = useNavigate();
  const webAppButtonRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(false);
  
  // Get SEO config for headings
  const seoConfig = getSEOByQRType('download');
  const h1Text = seoConfig.headings?.h1 || "Fast & Secure QR Code Scanner App";
  const h2List = seoConfig.headings?.h2 || [];

  // Update SEO
  useEffect(() => {
    updatePageSEO(seoConfig);
  }, []);

  // Intersection observer for floating button
  useEffect(() => {
    if (!webAppButtonRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsFloating(!entry.isIntersecting);
      },
      {
        rootMargin: '0px',
        threshold: 0
      }
    );

    observer.observe(webAppButtonRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleWebAppClick = async () => {
    try {
      // Access deferred prompt from global scope
      const deferredPrompt = (window as any).deferredPrompt;
      
      if (deferredPrompt) {
        // Show the install prompt
        await deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          // Clear the deferred prompt
          (window as any).deferredPrompt = null;
        } else if (outcome === 'dismissed') {
          console.log('User dismissed the install prompt');
          // Show helpful message
          alert('App installation was cancelled. You can install it anytime from your browser menu or by visiting this page again.');
        }
      } else {
        // Fallback instructions based on device and browser
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isChrome = /Chrome/i.test(navigator.userAgent);
        
        if (isIOS || isSafari) {
          alert('📱 Install My Qrcode Tool on iOS:\n\n1. Tap the Share button (⬆️) at the bottom of Safari\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm\n\nThe app will appear on your home screen!');
        } else if (isAndroid && isChrome) {
          alert('📱 Install My Qrcode Tool on Android:\n\n1. Tap the menu (⋮) in the top right corner\n2. Select "Install app" or "Add to Home screen"\n3. Tap "Install" to confirm\n\nThe app will appear on your home screen!');
        } else if (isChrome) {
          alert('💻 Install My Qrcode Tool on Desktop:\n\n1. Look for the install icon (⊕) in your browser address bar\n2. Click it to install the app\n3. Or use browser menu → "Install My Qrcode Tool"\n\nQuick access from your desktop!');
        } else {
          alert('🌐 Access My Qrcode Tool Anytime:\n\n• Bookmark this page for quick access\n• Or look for install/add options in your browser menu\n• The app works great in any modern browser!\n\nNo installation required to use all features.');
        }
      }
    } catch (error) {
      console.error('Error during PWA install:', error);
      alert('Unable to install the app at this moment. Please try again later or bookmark this page for quick access.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header stickyHeaderEnabled={false} pageType="download" />
      
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {h1Text}
          </h1>
          {/* SEO H2 headings - hidden but crawlable */}
          {h2List.map((h2: string, index: number) => (
            <h2 key={index} className="sr-only">{h2}</h2>
          ))}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            myqrcodetool.com offers a fast, secure QR code scanner for Android and web. Download the app now!
          </p>
        </div>

        {/* Download Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Android */}
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Android</h3>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-lg mb-4">
                <Smartphone className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div className="text-gray-600 text-lg font-medium">Coming soon!</div>
          </div>

          {/* iOS */}
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">iOS</h3>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-lg mb-4">
                <Apple className="h-10 w-10 text-gray-600" />
              </div>
            </div>
            <div className="text-gray-600 text-lg font-medium">Coming soon!</div>
          </div>

          {/* Scan to download */}
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Scan to download</h3>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg mx-auto">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Web App Option */}
        <div className="bg-white rounded-lg p-8 shadow-md text-center mb-16">
          <div ref={webAppButtonRef}>
            <p className="text-gray-600 mb-4">
              Prefer using the web app instead?
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2 mx-auto"
              onClick={handleWebAppClick}
            >
              <DownloadIcon className="w-4 h-4" />
              Use WebApp
            </Button>
          </div>
        </div>

        {/* Floating Web App Button */}
        {isFloating && (
          <div className="fixed bottom-24 right-6 z-50">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center animate-bounce p-0"
              onClick={handleWebAppClick}
              data-testid="button-floating-webapp"
            >
              <DownloadIcon className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fast, Secure, & Accessible Anywhere.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {/* Instant Scanning */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Scanning</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Scan QR codes directly using your mobile camera or from your image gallery.
            </p>
          </div>

          {/* Comprehensive Support */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Support</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Our Scanner can read various types of QR codes, including URLs, WiFi credentials, vCards, and more.
            </p>
          </div>

          {/* Privacy First */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy First</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Local processing ensures your data remains private.
            </p>
          </div>

          {/* Free */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Free</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Enjoy all features at no cost.
            </p>
          </div>
        </div>
        
        </div> {/* Close max-w-4xl mx-auto */}
        
        <ShareButton pageType="generator" />
        
        <Footer />
      </div>
    </div>
  );
};

export default Download;