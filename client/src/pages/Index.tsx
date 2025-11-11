import QRGenerator from "@/components/QRGenerator";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowUp, MessageCircle, UserSquare, Briefcase, Megaphone, MousePointer, FileEdit, Send, Smartphone, List, Image, CheckCircle, Menu, X, FileText, Download, Camera, ScanLine } from "lucide-react";
import { WhatsAppIcon, PayPalIcon, ZoomIcon, WifiIcon, ImageIcon } from '@/components/CustomIcons';
import { Link, Mail, Text, Phone, MessageSquare, UserSquare as VCard, CalendarDays } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { seoConfigs, getSEOByRoute, getSEOByQRType, updatePageSEO, getDefaultSEO, generateSiteLinks } from "@/lib/seo-config";
import StructuredData from "@/components/StructuredData";
import DynamicMessages, { useDynamicMessages } from "@/components/DynamicMessages";
import Footer from "@/components/Footer";
import { usePrefetch } from "@/hooks/usePrefetch";
import ShareButton from "@/components/ShareButton";

interface IndexProps {
  qrType?: string;
}

const Index = ({ qrType }: IndexProps) => {
  const qrGeneratorRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [stickyHeaderEnabled, setStickyHeaderEnabled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showShareButton, setShowShareButton] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentMessage, updateMessage, qrCount } = useDynamicMessages();
  
  // Get current SEO config for headings
  const currentSeoConfig = qrType ? getSEOByQRType(qrType) : getSEOByRoute(location.pathname);
  const h1Text = currentSeoConfig.headings?.h1 || "Create Professional QR Codes in Seconds";
  const h2List = currentSeoConfig.headings?.h2 || [];
  
  usePrefetch({ currentPage: 'generator', delay: 1000 });
  
  // Update SEO based on route or QR type
  useEffect(() => {
    let seoConfig;
    if (qrType) {
      seoConfig = getSEOByQRType(qrType);
    } else {
      seoConfig = getSEOByRoute(location.pathname);
    }
    
    updatePageSEO(seoConfig);
    
    // If we have a specific QR type, trigger the selection
    if (qrType) {
      const event = new CustomEvent('qrTypeSelect', { detail: { type: qrType } });
      window.dispatchEvent(event);
      
      // Auto scroll to QR generator
      setTimeout(() => {
        qrGeneratorRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [qrType, location.pathname]);

  // No automatic redirect - keep user on root page for proper SEO
  // Root page now has its own unique content and hero title

  // Handle scroll from footer navigation
  useEffect(() => {
    const state = location.state as any;
    if (state?.scrollTo === 'generator') {
      // Scroll to generator section when navigating from footer
      setTimeout(() => {
        qrGeneratorRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [location.state]);

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      if (sectionRef && sectionRef.current) {
        sectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleQRTypeSelect = (type: string) => {
    // Don't navigate - just scroll to QR generator and update the type
    // This keeps the URL stable for SEO
    setTimeout(() => {
      if (qrGeneratorRef.current) {
        qrGeneratorRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
    
    // Dispatch custom event to QRGenerator component to change the type
    const event = new CustomEvent('qrTypeSelect', {
      detail: { type }
    });
    window.dispatchEvent(event);
  };

  const scrollToQRGenerator = () => {
    qrGeneratorRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Create refs for all sections
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutQRRef = useRef<HTMLDivElement>(null);
  const howToUseRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const qrTypesRef = useRef<HTMLDivElement>(null);

  // Intersection observer for dynamic sticky header - enables/disables based on QR generator section visibility
  useEffect(() => {
    if (!qrGeneratorRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Disable sticky header when QR generator section is visible (hero + QR generator sections)
        // Enable sticky header when scrolled past QR generator section
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
        rootMargin: '0px 0px -50% 0px', // Trigger when QR section is 50% out of view
        threshold: 0
      }
    );

    observer.observe(qrGeneratorRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const menuItems = [
    { label: "QR Generator", ref: qrGeneratorRef },
    { label: "Features", ref: featuresRef },
    { label: "About QR Codes", ref: aboutQRRef },
    { label: "How to Use", ref: howToUseRef },
    { label: "Why Choose My Qrcode Tool", ref: benefitsRef },
    { label: "QR Code Types", ref: qrTypesRef }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Keyboard navigation and focus trap for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen || !menuRef.current) return;

    // Get menu panel (not the toggle button)
    const menuPanel = menuRef.current.querySelector('[role="menu"]');
    if (!menuPanel) return;

    // Focus first menu item when menu opens
    const firstMenuItem = menuPanel.querySelector<HTMLElement>('[role="menuitem"]');
    if (firstMenuItem) {
      setTimeout(() => firstMenuItem.focus(), 0);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Close menu on Escape
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      // Focus trap - only trap focus within menu panel
      if (event.key === 'Tab') {
        const focusableElements = Array.from(
          menuPanel.querySelectorAll<HTMLElement>(
            '[role="menuitem"]:not([disabled])'
          )
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        data-testid="link-skip-to-main"
      >
        Skip to main content
      </a>
      
      {/* Structured Data for SEO */}
      <StructuredData qrType={qrType} />
      <header role="banner" className={`py-4 dynamic-header-bg z-20 transition-all duration-500 ease-in-out ${
        stickyHeaderEnabled ? 'sticky top-0' : 'relative'
      } ${
        stickyHeaderEnabled ? 'shadow-xl backdrop-blur-md bg-opacity-95' : 'shadow-sm'
      }`}>
        <div className="w-full px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="text-emerald-500">
                <QrCode className="h-7 w-7" />
              </div>
              <span className="text-slate-700">My Qrcode Tool</span>
            </h1>
            <nav role="navigation" aria-label="Mobile menu" className="flex items-center gap-3">
              <div className="relative" ref={menuRef}>
                <button 
                  ref={menuButtonRef}
                  className="block md:hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation-menu"
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Menu className="w-6 h-6" aria-hidden="true" />
                  )}
                </button>
              
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                  <div 
                    id="mobile-navigation-menu"
                    role="menu"
                    aria-label="Navigation menu"
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-50"
                  >
                    <div className="py-2">
                      {menuItems.map((item, index) => (
                        <button
                          key={index}
                          role="menuitem"
                          onClick={() => {
                            scrollToSection(item.ref);
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          className="block w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                          aria-label={`Navigate to ${item.label}`}
                        >
                          {item.label}
                        </button>
                      ))}
                      <div className="px-4 pb-2 pt-2 space-y-2" role="group" aria-label="Quick actions">
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/scanner');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          aria-label="Go to QR Scanner page"
                          data-testid="button-mobile-qr-scanner"
                        >
                          <ScanLine className="h-4 w-4" aria-hidden="true" />
                          QR Scanner
                        </button>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/download');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          aria-label="Download app"
                          data-testid="button-mobile-get-app"
                        >
                          Get app now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section aria-label="Hero section" className="py-12 px-4 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              {h1Text}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Generate custom QR codes for your business, events, and personal use. 
              Add logos, customize colors, choose frames, and track performance - all for free!
            </p>
            {/* SEO H2 headings - hidden but crawlable */}
            {h2List.map((h2, index) => (
              <h2 key={index} className="sr-only">{h2}</h2>
            ))}
          </div>
          
          
          {/* Hero Features */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Free Forever</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">No Registration Required</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Unlimited Downloads</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={scrollToQRGenerator}
              className="group bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              data-testid="button-create-qr"
            >
              <span className="flex items-center gap-2">
                Start Creating QR Codes 
                <ArrowUp className="w-5 h-5 rotate-45 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button 
              onClick={() => navigate('/scanner')}
              className="group bg-gradient-to-r from-slate-600 to-slate-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-slate-700 hover:to-slate-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              data-testid="button-scan-qr"
            >
              <span className="flex items-center gap-2">
                Scan QR Code
                <ScanLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </button>
          </div>
          
          {/* TV Container - Interactive Messages */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border-4 border-slate-700 overflow-hidden relative h-48 md:h-56">
              {/* TV Screen */}
              <div className="m-4 bg-black rounded-lg h-40 md:h-48 relative">
                {/* Screen Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-transparent to-blue-400/20 rounded-lg"></div>
                
                {/* Dynamic Content */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center px-6">
                    <div className="text-emerald-400 mb-3">
                      <QrCode className="h-8 w-8 mx-auto" />
                    </div>
                    <h2 className="text-white text-lg md:text-xl font-semibold mb-2" id="dynamic-message">
                      {currentMessage.title}
                    </h2>
                    <p className="text-emerald-300 text-sm md:text-base opacity-90" id="dynamic-subtitle">
                      {currentMessage.subtitle}
                    </p>
                  </div>
                </div>
                
                {/* Scan Lines Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse pointer-events-none rounded-lg"></div>
              </div>
              
              {/* TV Control Buttons */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 space-y-2">
                <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* TV Base */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-slate-700 rounded-b-lg"></div>
            </div>
          </div>
        </div>
      </section>
      
      <main id="main-content" role="main" className="w-full py-8">
        <div ref={qrGeneratorRef} className="px-2 sm:px-6">
          <QRGenerator />
        </div>
        
        {/* Features section */}
        <div ref={featuresRef} className="mt-16 py-16 px-4 bg-white rounded-lg shadow-sm mx-4">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-medium mb-6">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Powerful Features for Your QR Code Needs
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Create, customize, and track your QR codes with our comprehensive suite of professional features
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <QrCode className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-lg text-slate-700">Multiple QR Types</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <Download className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-lg text-slate-700">High-Resolution Export</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
              </div>
              <h3 className="font-medium text-lg text-slate-700">Design Customization</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-emerald-500 mb-3">
                <Image className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-lg text-slate-700">Logo Integration</h3>
            </div>
          </div>
        </div>
        
        {/* What are QR Codes section */}
        <div ref={aboutQRRef} className="mt-16 py-16 px-4 bg-emerald-500 text-white rounded-lg mx-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-medium mb-3">What are QR Codes?</h2>
            <h3 className="text-4xl font-bold mb-6">QR stands for 'Quick Response'</h3>
            
            <p className="mb-6 text-lg opacity-90">
              QR Codes were invented in 1994 by Denso Wave for tracking automotive parts during manufacturing. 
              They gained massive popularity with the rise of smartphones, making it possible to scan codes 
              directly with your phone's camera.
            </p>
            
            <p className="mb-8 text-lg opacity-90">
              Today, QR Codes have revolutionized how we share information instantly. Let me show you the key 
              benefits and most popular QR Code applications that can transform your business.
            </p>
            
            <Button 
              variant="default" 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={scrollToQRGenerator}
            >
              Create QR Code <ArrowUp className="ml-2 rotate-45" />
            </Button>
            
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-slate-500 p-4">
                    <MessageCircle size={48} />
                  </div>
                </div>
                <h4 className="text-slate-700 text-xl font-medium mb-4">Collect Customer Feedback</h4>
                <p className="text-slate-600">
                  Enable instant feedback collection by directing customers to review forms or surveys when they scan your QR Code.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-slate-500 p-4">
                    <UserSquare size={48} />
                  </div>
                </div>
                <h4 className="text-slate-700 text-xl font-medium mb-4">Digital Business Cards</h4>
                <p className="text-slate-600">
                  Replace traditional paper business cards with smart digital profiles that can be instantly 
                  saved to contacts with a simple scan.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-slate-500 p-4">
                    <Briefcase size={48} />
                  </div>
                </div>
                <h4 className="text-slate-700 text-xl font-medium mb-4">Business Information Hub</h4>
                <p className="text-slate-600">
                  Direct customers to detailed business information, instructions, or service pages 
                  to enhance their experience with your brand.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-slate-500 p-4">
                    <Megaphone size={48} />
                  </div>
                </div>
                <h4 className="text-slate-700 text-xl font-medium mb-4">Event Promotion & Offers</h4>
                <p className="text-slate-600">
                  Promote special events, share exclusive discount codes, or announce limited-time 
                  offers through engaging QR Code campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* How to Use section */}
        <div ref={howToUseRef} className="mt-16 py-16 px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-medium mb-6">
              How to Use
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Creating QR Codes with My Qrcode Tool is Simple and Fast
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in minutes with our intuitive QR Code generator. Create unlimited dynamic and static QR Codes for any purpose.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col md:flex-row items-center mb-24">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">1. Choose QR Code Type</h3>
                <p className="text-slate-600 text-lg">
                  Select from 9 different QR Code types including URL, Email, WiFi, VCard, and more. 
                  Each type is optimized for specific use cases.
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border-4 border-white shadow-lg flex items-center justify-center">
                  <MousePointer className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="md:w-1/2 md:pl-12"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10 flex flex-col md:flex-row-reverse items-center mb-24">
              <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0 md:text-left">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">2. Fill Required Information</h3>
                <p className="text-slate-600 text-lg">
                  Enter the specific information for your chosen QR Code type. For example, 
                  a URL QR Code requires a website link, while a WiFi QR Code needs network credentials.
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-white shadow-lg flex items-center justify-center">
                  <FileEdit className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="md:w-1/2 md:pr-12"></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative z-10 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">3. Download & Share</h3>
                <p className="text-slate-600 text-lg">
                  Generate your QR Code instantly, download it in high quality, and start sharing. 
                  You can always come back to edit or track its performance.
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-4 border-white shadow-lg flex items-center justify-center">
                  <Send className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="md:w-1/2 md:pl-12"></div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={scrollToQRGenerator}
            >
              Start Creating <ArrowUp className="ml-2 rotate-45" />
            </Button>
          </div>
        </div>
        
        {/* Benefits from My Qrcode Tool section */}
        <div ref={benefitsRef} className="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm mx-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Why Choose My Qrcode Tool Generator?</h2>
            
            <p className="mb-4 text-slate-600 text-lg">
              My Qrcode Tool provides instant QR code generation with multiple content types including URLs, emails, phone numbers, WiFi credentials, and more. 
              Generate professional QR codes in seconds with full customization options.
            </p>
            
            <p className="mb-8 text-slate-600 text-lg">
              Perfect for businesses, marketing campaigns, events, and personal use. 
              Create stunning QR codes with logos, custom colors, and download in high resolution - all completely free!
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">13+ QR code types for any use case</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">High-resolution downloads (PNG, SVG, PDF)</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Full color and design customization</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Logo integration with any image</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Instant generation and unlimited downloads</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Free to use with no registration required</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">13+</div>
                  <div className="text-slate-600">QR Code Types</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
                  <div className="text-slate-600">Unlimited Downloads</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                  <div className="text-slate-600">Free Forever</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* QR Code Types section */}
        <div ref={qrTypesRef} className="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm mx-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-4">QR Code Types</h2>
            <p className="text-center text-slate-600 mb-12">Choose from our comprehensive collection of QR Code types for any business need.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Link QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-emerald-500 mb-4">
                  <Link className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Website URL</h3>
                <p className="text-slate-600 mb-4">Direct users to any website or landing page</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('url')}
                >
                  Select
                </Button>
              </div>
              
              {/* Email QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <Mail className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Email</h3>
                <p className="text-slate-600 mb-4">Pre-compose emails with subject and message</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('email')}
                >
                  Select
                </Button>
              </div>
              
              {/* Text QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-500 mb-4">
                  <FileText className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Plain Text</h3>
                <p className="text-slate-600 mb-4">Share any text message or information</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('text')}
                >
                  Select
                </Button>
              </div>
              
              {/* Call QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-emerald-500 mb-4">
                  <Phone className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Phone Call</h3>
                <p className="text-slate-600 mb-4">Enable one-tap calling to your number</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('phone')}
                >
                  Select
                </Button>
              </div>
              
              {/* SMS QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <MessageSquare className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">SMS Message</h3>
                <p className="text-slate-600 mb-4">Send pre-written text messages</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('sms')}
                >
                  Select
                </Button>
              </div>
              
              {/* WhatsApp QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-green-500 mb-4">
                  <WhatsAppIcon className="h-12 w-12" size={48} />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">WhatsApp</h3>
                <p className="text-slate-600 mb-4">Start WhatsApp conversations instantly</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('whatsapp')}
                >
                  Select
                </Button>
              </div>
              
              {/* WiFi QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-400 mb-4">
                  <WifiIcon className="h-12 w-12" size={48} />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">WiFi Network</h3>
                <p className="text-slate-600 mb-4">Share WiFi credentials for easy connection</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('wifi')}
                >
                  Select
                </Button>
              </div>
              
              {/* VCard QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <VCard className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Contact Card</h3>
                <p className="text-slate-600 mb-4">Save contact information to phone</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('vcard')}
                >
                  Select
                </Button>
              </div>
              
              {/* Event QR */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-orange-500 mb-4">
                  <CalendarDays className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Calendar Event</h3>
                <p className="text-slate-600 mb-4">Add events directly to calendar apps</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('event')}
                >
                  Select
                </Button>
              </div>
              
              {/* Image QR - NEW */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-purple-500 mb-4">
                  <ImageIcon className="h-12 w-12" size={48} />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Image</h3>
                <p className="text-slate-600 mb-4">Embed images directly into QR codes</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('image')}
                >
                  Select
                </Button>
              </div>
              
              
              {/* PayPal QR - NEW */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <PayPalIcon className="h-12 w-12" size={48} />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">PayPal</h3>
                <p className="text-slate-600 mb-4">Accept payments instantly with PayPal</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('paypal')}
                >
                  Select
                </Button>
              </div>
              
              {/* Zoom QR - NEW */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <ZoomIcon className="h-12 w-12" size={48} />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Zoom</h3>
                <p className="text-slate-600 mb-4">Join Zoom meetings instantly with QR</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('zoom')}
                >
                  Select
                </Button>
              </div>
              
              {/* Enhanced V-card QR - NEW */}
              <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-purple-600 mb-4">
                  <div className="text-4xl">🪪</div>
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">V-card</h3>
                <p className="text-slate-600 mb-4">Complete professional contact details</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleQRTypeSelect('enhanced-vcard')}
                >
                  Select
                </Button>
              </div>
              
            </div>
          </div>
        </div>
        
        {/* Download Section */}
        <div className="mt-16 py-16 px-4 bg-slate-50 rounded-lg border shadow-sm mx-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-4xl mb-4">
              <QrCode className="h-12 w-12 mx-auto text-slate-700" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Get the My Qrcode Tool app!</h2>
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
        
        {/* Available Tools Section */}
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
      </main>
      
      {showShareButton && <ShareButton pageType="generator" />}
      
      <Footer />
    </div>
  );
};

export default Index;
