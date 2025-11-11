import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  pageType: 'generator' | 'scanner';
  className?: string;
}

const ShareButton = ({ pageType, className = "" }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = pageType === 'generator' 
      ? window.location.origin + '/'
      : window.location.origin + '/scanner';
    
    const title = pageType === 'generator' 
      ? 'My Qrcode Tool - Free QR Code Generator'
      : 'My Qrcode Tool - Free QR Code Scanner';
    
    const text = pageType === 'generator'
      ? 'Create professional QR codes for free with My Qrcode Tool - No registration required!'
      : 'Scan QR codes instantly with My Qrcode Tool - Fast, secure, and free!';

    // Try Web Share API first (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Failed to copy
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label={`Share ${pageType === 'generator' ? 'QR Generator' : 'QR Scanner'}`}
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
        pageType === 'generator'
          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
          : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
      } ${className}`}
      data-testid={`button-share-${pageType}`}
    >
      {copied ? (
        <Check className="h-6 w-6 text-white" aria-hidden="true" />
      ) : (
        <Share2 className="h-6 w-6 text-white group-hover:scale-110 transition-transform" aria-hidden="true" />
      )}
    </button>
  );
};

export default ShareButton;
