import React from 'react';

// Interface to match Lucide React icons
interface IconProps {
  className?: string;
  size?: string | number;
  style?: React.CSSProperties;
}

// Custom SVG Icons to replace react-icons
export const WhatsAppIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    {/* Outer rounded square - WhatsApp Green */}
    <rect 
      width="24" 
      height="24" 
      rx="5" 
      ry="5" 
      fill="#25D366"
    />
    
    {/* WhatsApp chat bubble with tail - Official design */}
    <path 
      fill="#FFFFFF" 
      d="M12 3.5c-4.69 0-8.5 3.81-8.5 8.5 0 1.48.38 2.87 1.06 4.08l-1.1 4.04 4.15-1.09c1.17.64 2.51 1.01 3.94 1.01 4.69 0 8.5-3.81 8.5-8.5S16.69 3.5 12 3.5z"
    />
    
    {/* Phone handset icon inside bubble - Official design */}
    <path 
      fill="#25D366" 
      d="M16.75 14.43c-.27-.15-1.58-.78-1.83-.87-.24-.09-.42-.13-.59.13-.18.27-.68.87-.83 1.05-.16.18-.31.2-.58.07-.27-.13-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.54.12-.12.27-.31.4-.47.14-.16.19-.27.28-.45.09-.18.05-.34-.02-.47-.07-.13-.59-1.42-.81-1.95-.21-.51-.43-.44-.59-.45-.15 0-.33-.01-.51-.01-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.97 2.63 1.11 2.81c.13.18 1.88 2.87 4.56 4.02 2.67 1.15 2.67.77 3.15.72.48-.05 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31z"
    />
  </svg>
);

export const DownloadIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    {/* Blue circular background */}
    <circle 
      cx="12" 
      cy="12" 
      r="12" 
      fill="#1E88E5"
    />
    
    {/* White download arrow */}
    <g transform="translate(12,12) scale(1.2) translate(-12,-12)">
      {/* Arrow shaft */}
      <rect 
        x="11" 
        y="7" 
        width="2" 
        height="6" 
        fill="white"
      />
      {/* Arrow head */}
      <path 
        d="M8 13 L12 17 L16 13 Z" 
        fill="white"
      />
    </g>
    
    {/* Bottom line (download tray) */}
    <rect 
      x="7" 
      y="17" 
      width="10" 
      height="1.5" 
      rx="0.75" 
      fill="white"
    />
  </svg>
);

export const PayPalIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
    data-testid="icon-paypal"
  >
    {/* PayPal dark blue background - official color */}
    <rect width="24" height="24" rx="5" fill="#003087"/>
    
    {/* Single centered white P */}
    <path 
      d="M9 6h4c2.2 0 3.8 1.3 3.8 3.4 0 2.4-1.6 4-3.8 4h-2.3l-.7 5.6H7.5l1.9-13H9zm1.3 2.5l-.7 4h2c1.1 0 1.9-.7 1.9-2 0-1-.7-2-1.9-2h-1.3z" 
      fill="white"
    />
  </svg>
);

export const ZoomIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    {/* Video camera body */}
    <rect x="2" y="6" width="14" height="10" rx="2" fill="#2D8CFF" stroke="#1E6FCC" strokeWidth="1"/>
    
    {/* Camera lens */}
    <circle cx="9" cy="11" r="3" fill="#1E6FCC"/>
    <circle cx="9" cy="11" r="1.5" fill="#FFFFFF"/>
    
    {/* Tripod legs */}
    <path d="M16 12L20 8v8z" fill="#2D8CFF"/>
    
    {/* Record indicator */}
    <circle cx="6" cy="8" r="1" fill="#FF4444"/>
  </svg>
);

export const FacebookIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    <path 
      fill="#1877F2" 
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

export const InstagramIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a3ab9"/>
        <stop offset="30%" stopColor="#e95950"/>
        <stop offset="60%" stopColor="#fccc63"/>
        <stop offset="100%" stopColor="#f77737"/>
      </linearGradient>
    </defs>
    <path 
      fill="url(#instagram-gradient)" 
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

export const XIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

export const LinkedInIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    <path 
      fill="#0A66C2" 
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  </svg>
);

export const YouTubeIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    <path 
      fill="#FF0000" 
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    />
  </svg>
);

export const TwitterBirdIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    <rect width="24" height="24" rx="4" ry="4" fill="#1d9bf0"/>
    <path d="M18 6.5c-.62.27-1.28.45-1.98.53.71-.43 1.26-1.1 1.51-1.91-.67.4-1.4.69-2.18.84-.63-.67-1.52-1.08-2.51-1.08-1.9 0-3.44 1.54-3.44 3.44 0 .27.03.53.08.78C7.69 8.2 5.67 7.1 4.33 5.33c-.3.51-.47 1.1-.47 1.74 0 1.19.61 2.25 1.53 2.86-.56-.02-1.09-.17-1.54-.43v.04c0 1.67 1.18 3.06 2.75 3.38-.29.08-.59.12-.9.12-.22 0-.43-.02-.64-.06.43 1.35 1.69 2.33 3.18 2.36-1.17.91-2.65 1.46-4.25 1.46-.28 0-.55-.02-.82-.05 1.52.97 3.33 1.54 5.27 1.54 6.33 0 9.8-5.24 9.8-9.78 0-.15 0-.3-.01-.44.67-.49 1.25-1.09 1.71-1.78z" fill="white"/>
  </svg>
);

// Theme toggle icons
export const SunIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

export const MoonIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// Custom WiFi Icon based on user's provided design
export const WifiIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    {/* Outermost WiFi signal arc */}
    <path 
      d="M2 8.5c5.5-5.5 14.5-5.5 20 0" 
      fill="none" 
      stroke="#60A5FA" 
      strokeWidth="3" 
      strokeLinecap="round"
    />
    
    {/* Middle WiFi signal arc */}
    <path 
      d="M5 11.5c4-4 10-4 14 0" 
      fill="none" 
      stroke="#60A5FA" 
      strokeWidth="3" 
      strokeLinecap="round"
    />
    
    {/* Inner WiFi signal arc */}
    <path 
      d="M8.5 15c2.5-2.5 4.5-2.5 7 0" 
      fill="none" 
      stroke="#60A5FA" 
      strokeWidth="3" 
      strokeLinecap="round"
    />
    
    {/* WiFi signal dot */}
    <circle 
      cx="12" 
      cy="19" 
      r="2" 
      fill="#60A5FA"
    />
  </svg>
);

// Image Upload Icon - Simple and clean design
export const ImageUploadIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    {/* Background rectangle with rounded corners */}
    <rect 
      x="2" 
      y="2" 
      width="20" 
      height="20" 
      rx="4" 
      ry="4" 
      fill="#E0E7FF"
      stroke="#6366F1"
      strokeWidth="1.5"
    />
    
    {/* Image mountains/landscape icon */}
    <path 
      d="M2 18 L8 12 L12 16 L16 12 L22 18 L22 20 C22 21.1 21.1 22 20 22 L4 22 C2.9 22 2 21.1 2 20 Z" 
      fill="#818CF8"
    />
    <path 
      d="M2 18 L8 12 L12 16 L16 12 L22 18 L22 20 C22 21.1 21.1 22 20 22 L4 22 C2.9 22 2 21.1 2 20 Z" 
      fill="#6366F1"
      opacity="0.7"
    />
    
    {/* Sun/circle in the corner */}
    <circle 
      cx="17" 
      cy="7" 
      r="2" 
      fill="#FCD34D"
    />
    
    {/* Upload arrow in center */}
    <g transform="translate(12, 10)">
      {/* Arrow shaft */}
      <rect 
        x="-1" 
        y="-4" 
        width="2" 
        height="8" 
        fill="#6366F1"
      />
      {/* Arrow head */}
      <path 
        d="M-3 -2 L0 -6 L3 -2 Z" 
        fill="#6366F1"
      />
    </g>
  </svg>
);

// Simple Image Icon (without upload arrow) - For content dropdown
export const ImageIcon = ({ className = "", size = 20, style }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={style}
  >
    {/* Background rectangle with rounded corners */}
    <rect 
      x="2" 
      y="2" 
      width="20" 
      height="20" 
      rx="4" 
      ry="4" 
      fill="#E0E7FF"
      stroke="#6366F1"
      strokeWidth="1.5"
    />
    
    {/* Image mountains/landscape icon */}
    <path 
      d="M2 18 L8 12 L12 16 L16 12 L22 18 L22 20 C22 21.1 21.1 22 20 22 L4 22 C2.9 22 2 21.1 2 20 Z" 
      fill="#818CF8"
    />
    <path 
      d="M2 18 L8 12 L12 16 L16 12 L22 18 L22 20 C22 21.1 21.1 22 20 22 L4 22 C2.9 22 2 21.1 2 20 Z" 
      fill="#6366F1"
      opacity="0.7"
    />
    
    {/* Sun/circle in the corner */}
    <circle 
      cx="17" 
      cy="7" 
      r="2" 
      fill="#FCD34D"
    />
  </svg>
);