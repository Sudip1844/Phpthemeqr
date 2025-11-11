import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QrCode, Menu, X, ScanLine, Download as DownloadIcon, Shield, HelpCircle } from "lucide-react";

interface HeaderProps {
  stickyHeaderEnabled?: boolean;
  showNavigation?: boolean;
  pageType?: 'generator' | 'scanner' | 'privacy' | 'faq' | 'download' | 'support';
  // Scanner page section refs
  scannerSectionRef?: React.RefObject<HTMLDivElement>;
  featuresRef?: React.RefObject<HTMLDivElement>;
  howToUseRef?: React.RefObject<HTMLDivElement>;
  benefitsRef?: React.RefObject<HTMLDivElement>;
}

const Header = ({ stickyHeaderEnabled = false, showNavigation = false, pageType, scannerSectionRef, featuresRef, howToUseRef, benefitsRef }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isScanner = location.pathname === '/scanner';

  const scrollToSection = (sectionRef?: React.RefObject<HTMLElement>) => {
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

  const scannerMenuItems = [
    { label: "Scanner", action: () => scrollToSection(scannerSectionRef) },
    { label: "Features", action: () => scrollToSection(featuresRef) },
    { label: "How to Use", action: () => scrollToSection(howToUseRef) },
    { label: "Why Choose My Qrcode Tool", action: () => scrollToSection(benefitsRef) },
  ];

  const defaultMenuItems: { label: string; action: () => void }[] = [];

  const menuItems = pageType === 'scanner' || isScanner ? scannerMenuItems : defaultMenuItems;

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
    <header role="banner" className={`py-4 dynamic-header-bg z-20 transition-all duration-500 ease-in-out ${
      stickyHeaderEnabled ? 'sticky top-0' : 'relative'
    } ${
      stickyHeaderEnabled ? 'shadow-xl backdrop-blur-md bg-opacity-95' : 'shadow-sm'
    }`}>
      <div className="w-full px-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            aria-label="Go to homepage"
            className="text-2xl font-bold flex items-center gap-2 cursor-pointer"
          >
            <div className={isScanner ? "text-purple-500" : "text-emerald-500"}>
              <QrCode className="h-7 w-7" />
            </div>
            <span className="text-foreground">My Qrcode Tool</span>
          </button>
          <nav role="navigation" aria-label="Main navigation" className="flex items-center gap-3">
            <div className="relative" ref={menuRef}>
              <button 
                ref={menuButtonRef}
                className="block md:hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
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
                id="mobile-menu"
                role="menu"
                aria-label="Mobile navigation menu"
                className="absolute right-0 top-full mt-2 w-64 bg-card text-card-foreground rounded-lg shadow-lg border border-border z-50"
              >
                <div className="py-2">
                  {menuItems.length > 0 && menuItems.map((item, index) => (
                    <button
                      key={index}
                      role="menuitem"
                      onClick={() => {
                        item.action();
                        setMobileMenuOpen(false);
                        menuButtonRef.current?.focus();
                      }}
                      aria-label={`Navigate to ${item.label}`}
                      className="block w-full text-left px-4 py-3 text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="px-4 pb-2 pt-2 space-y-2" role="group" aria-label="Quick actions">
                    {(pageType === 'privacy' || pageType === 'faq' || pageType === 'download' || pageType === 'support' || !pageType) && (
                      <>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to QR Generator"
                          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-qr-generator"
                        >
                          <QrCode className="h-4 w-4" aria-hidden="true" />
                          QR Generator
                        </button>
                        <button
                          role="menuitem"
                          onClick={() => {
                            if (isScanner) {
                              scrollToSection(scannerSectionRef);
                            } else {
                              navigate('/scanner');
                            }
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label={isScanner ? "Scroll to scanner section" : "Go to QR Scanner"}
                          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-qr-scanner"
                        >
                          <ScanLine className="h-4 w-4" aria-hidden="true" />
                          QR Scanner
                        </button>
                      </>
                    )}
                    {pageType === 'privacy' && (
                      <>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/faq');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to FAQ"
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-faq"
                        >
                          <HelpCircle className="h-4 w-4" aria-hidden="true" />
                          FAQ
                        </button>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/download');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to Download Page"
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-download"
                        >
                          <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                          Download App
                        </button>
                      </>
                    )}
                    {pageType === 'faq' && (
                      <>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/privacy');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to Privacy Policy"
                          className="w-full bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-privacy"
                        >
                          <Shield className="h-4 w-4" aria-hidden="true" />
                          Privacy Policy
                        </button>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/download');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to Download Page"
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-download"
                        >
                          <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                          Download App
                        </button>
                      </>
                    )}
                    {pageType === 'download' && (
                      <>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/privacy');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to Privacy Policy"
                          className="w-full bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-privacy"
                        >
                          <Shield className="h-4 w-4" aria-hidden="true" />
                          Privacy Policy
                        </button>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/faq');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to FAQ"
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-faq"
                        >
                          <HelpCircle className="h-4 w-4" aria-hidden="true" />
                          FAQ
                        </button>
                      </>
                    )}
                    {pageType === 'support' && (
                      <>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/faq');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to FAQ"
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-faq"
                        >
                          <HelpCircle className="h-4 w-4" aria-hidden="true" />
                          FAQ
                        </button>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/download');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to Download Page"
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-download"
                        >
                          <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                          Download App
                        </button>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/privacy');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to Privacy Policy"
                          className="w-full bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-privacy"
                        >
                          <Shield className="h-4 w-4" aria-hidden="true" />
                          Privacy Policy
                        </button>
                      </>
                    )}
                    {pageType === 'scanner' && (
                      <>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to QR Generator"
                          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-qr-generator"
                        >
                          <QrCode className="h-4 w-4" aria-hidden="true" />
                          QR Generator
                        </button>
                        <button
                          role="menuitem"
                          onClick={() => {
                            navigate('/download');
                            setMobileMenuOpen(false);
                            menuButtonRef.current?.focus();
                          }}
                          aria-label="Go to Download Page"
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          data-testid="button-mobile-download"
                        >
                          <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                          Download App
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;