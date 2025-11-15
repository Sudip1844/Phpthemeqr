/**
 * SSR Renderers for different page types
 * Each renderer accepts seoConfig and returns static HTML string
 */

/**
 * Render Header component with full navigation
 */
function renderHeader() {
  return `
    <header role="banner" class="py-4 dynamic-header-bg z-20 relative shadow-sm" style="background: linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(59,130,246,0.05) 100%);">
      <div class="w-full px-4">
        <div class="flex items-center justify-between">
          <a href="/" class="text-2xl font-bold flex items-center gap-2 cursor-pointer" aria-label="Go to homepage">
            <div class="text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
            </div>
            <span class="text-slate-700">My Qrcode Tool</span>
          </a>
          <nav role="navigation" aria-label="Main navigation" class="flex items-center gap-4">
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-6">
              <a href="/" class="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors" data-testid="link-nav-generator">
                QR Generator
              </a>
              <a href="/scanner" class="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors" data-testid="link-nav-scanner">
                QR Scanner
              </a>
              <a href="/faq" class="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors" data-testid="link-nav-faq">
                FAQ
              </a>
              <a href="/privacy" class="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors" data-testid="link-nav-privacy">
                Privacy
              </a>
              <a href="/download" class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-colors text-sm font-medium" data-testid="link-nav-download">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download App
              </a>
            </div>
            <!-- Mobile Menu Button -->
            <button class="block md:hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md" aria-label="Open mobile menu" data-testid="button-mobile-menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </nav>
        </div>
      </div>
    </header>
  `;
}

/**
 * Render Footer component
 */
function renderFooter() {
  return `
    <footer role="contentinfo" class="bg-card border-t mt-auto">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-primary"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
              <span class="text-xl font-bold">My Qrcode Tool</span>
            </div>
            <p class="text-sm text-muted-foreground">
              Free QR code generator and scanner. Create professional QR codes for URLs, WiFi, contacts, events, and more. Fast, secure, and easy to use.
            </p>
            <div class="flex gap-2">
              <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Free Forever</span>
              <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">No Registration</span>
            </div>
          </div>

          <nav class="space-y-4" aria-label="Tools links">
            <h3 class="font-semibold text-sm uppercase tracking-wider">Tools</h3>
            <ul class="space-y-3" role="list">
              <li>
                <a href="/" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-generator">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                  QR Generator
                </a>
              </li>
              <li>
                <a href="/scanner" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-scanner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
                  QR Scanner
                </a>
              </li>
              <li>
                <a href="/download" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-download">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  Download App
                </a>
              </li>
            </ul>
          </nav>

          <nav class="space-y-4" aria-label="Support links">
            <h3 class="font-semibold text-sm uppercase tracking-wider">Support</h3>
            <ul class="space-y-3" role="list">
              <li>
                <a href="/faq" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-faq">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  FAQ
                </a>
              </li>
              <li>
                <a href="/privacy" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-privacy">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/support" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-support">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M12 8v4"/><path d="M12 16h.01"/><circle cx="12" cy="12" r="10"/></svg>
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>

          <nav class="space-y-4" aria-label="Popular QR Types links">
            <h3 class="font-semibold text-sm uppercase tracking-wider">Popular QR Types</h3>
            <ul class="space-y-3" role="list">
              <li>
                <a href="/url-to-qr" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-qr-url">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  URL QR Code
                </a>
              </li>
              <li>
                <a href="/wifi-to-qr" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-qr-wifi">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
                  WiFi QR Code
                </a>
              </li>
              <li>
                <a href="/email-to-qr" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-qr-email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Email QR Code
                </a>
              </li>
              <li>
                <a href="/phone-to-qr" class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-qr-phone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Phone QR Code
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div class="border-t my-8"></div>

        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© ${new Date().getFullYear()} My Qrcode Tool. All rights reserved.</p>
          <div class="flex gap-4">
            <a href="/privacy" class="hover:text-primary transition-colors cursor-pointer" data-testid="link-privacy-bottom">Privacy</a>
            <a href="/faq" class="hover:text-primary transition-colors cursor-pointer" data-testid="link-faq-bottom">FAQ</a>
            <a href="/support" class="hover:text-primary transition-colors cursor-pointer" data-testid="link-support-bottom">Contact Us</a>
          </div>
        </div>

        <div class="mt-6 text-center text-xs text-muted-foreground">
          <p>QR Code Generator • QR Code Scanner • Free QR Codes • WiFi QR Generator • vCard QR Code • URL to QR • Text to QR</p>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Default renderer for QR Generator pages
 */
function renderDefault(config) {
  const h1Text = config.headings?.h1 || "Create Professional QR Codes in Seconds";
  const h2List = config.headings?.h2 || [];
  const benefits = config.uniqueContent?.benefits || [];
  const useCases = config.uniqueContent?.useCases || '';
  const aboutSection = config.aboutSection;
  const howToUse = config.howToUse;
  const whyChoose = config.whyChoose;
  const qrTypeCards = config.qrTypeCards || [];
  
  return `
      <div class="min-h-screen bg-slate-50">
        ${renderHeader()}

        <section aria-label="Hero section" class="py-12 px-4 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
          <div class="max-w-4xl mx-auto text-center">
            <div class="mb-8">
              <h1 class="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight" style="font-size: clamp(2.25rem, 5vw, 3.75rem);">
                ${h1Text}
              </h1>
              <p class="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                ${config.description}
              </p>
              ${h2List.map(h2 => `<h2 class="sr-only">${h2}</h2>`).join('\n              ')}
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div class="flex items-center gap-2 text-emerald-600">
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span class="font-medium">Free Forever</span>
              </div>
              <div class="flex items-center gap-2 text-blue-600">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span class="font-medium">No Registration Required</span>
              </div>
              <div class="flex items-center gap-2 text-purple-600">
                <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span class="font-medium">Unlimited Downloads</span>
              </div>
            </div>
          </div>
        </section>
        
        <main id="main-content" role="main" class="w-full py-8">
          <div class="px-2 sm:px-6">
            <div class="max-w-4xl mx-auto">
              <div class="bg-white rounded-lg p-8 shadow-sm mb-8">
                <div class="text-center mb-6">
                  <p class="text-lg text-slate-600">QR Code generator loading...</p>
                </div>
                
                ${benefits.length > 0 ? `
                <div class="mt-8">
                  <h3 class="text-2xl font-semibold mb-4 text-slate-800">Key Benefits:</h3>
                  <ul class="space-y-3">
                    ${benefits.map(benefit => `
                    <li class="flex items-start gap-3">
                      <svg class="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span class="text-slate-700">${benefit}</span>
                    </li>`).join('')}
                  </ul>
                </div>
                ` : ''}
                
                ${useCases ? `
                <div class="mt-8 p-6 bg-slate-50 rounded-lg">
                  <h3 class="text-2xl font-semibold mb-4 text-slate-800">Perfect Use Cases:</h3>
                  <p class="text-slate-700 leading-relaxed">${useCases}</p>
                </div>
                ` : ''}
              </div>
            </div>
          </div>
          
          <div class="mt-16 py-16 px-4 bg-white rounded-lg shadow-sm mx-4">
            <div class="text-center mb-12">
              <div class="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-medium mb-6">
                Features
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Powerful Features for Your QR Code Needs
              </h2>
              <p class="text-xl text-slate-600 max-w-2xl mx-auto">
                Create, customize, and track your QR codes with our comprehensive suite of professional features
              </p>
            </div>
            
            <div class="grid md:grid-cols-4 gap-8 text-center">
              <div class="flex flex-col items-center">
                <div class="text-emerald-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                </div>
                <h3 class="font-medium text-lg text-slate-700">Multiple QR Types</h3>
              </div>
              
              <div class="flex flex-col items-center">
                <div class="text-emerald-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </div>
                <h3 class="font-medium text-lg text-slate-700">High-Resolution Export</h3>
              </div>
              
              <div class="flex flex-col items-center">
                <div class="text-emerald-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <h3 class="font-medium text-lg text-slate-700">Design Customization</h3>
              </div>
              
              <div class="flex flex-col items-center">
                <div class="text-emerald-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
                <h3 class="font-medium text-lg text-slate-700">Logo Integration</h3>
              </div>
            </div>
          </div>
          
          ${aboutSection ? `
          <div class="mt-16 py-16 px-4 bg-emerald-500 text-white rounded-lg mx-4">
            <div class="max-w-3xl mx-auto">
              <h2 class="text-xl font-medium mb-3">${aboutSection.heading}</h2>
              <h3 class="text-4xl font-bold mb-6">${aboutSection.subheading}</h3>
              
              ${aboutSection.paragraphs.map(para => `<p class="mb-6 text-lg opacity-90">${para}</p>`).join('\n              ')}
              
              ${aboutSection.features && aboutSection.features.length > 0 ? `
              <div class="grid md:grid-cols-2 gap-6 mt-12">
                ${aboutSection.features.map(feature => `
                <div class="bg-white rounded-lg p-8 text-center">
                  <h4 class="text-slate-700 text-xl font-medium mb-4">${feature.title}</h4>
                  <p class="text-slate-600">${feature.description}</p>
                </div>
                `).join('')}
              </div>
              ` : ''}
            </div>
          </div>
          ` : ''}
          
          ${howToUse ? `
          <div class="mt-16 py-16 px-4">
            <div class="text-center mb-12">
              <div class="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-medium mb-6">
                How to Use
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                ${howToUse.heading}
              </h2>
              <p class="text-xl text-slate-600 max-w-2xl mx-auto">
                ${howToUse.description}
              </p>
            </div>

            <div class="relative max-w-4xl mx-auto">
              ${howToUse.steps.map((step, index) => `
              <div class="relative z-10 flex flex-col md:flex-row${index % 2 === 1 ? '-reverse' : ''} items-center mb-${index === howToUse.steps.length - 1 ? '0' : '24'}">
                <div class="md:w-1/2 md:p${index % 2 === 0 ? 'r' : 'l'}-12 mb-8 md:mb-0 md:text-${index % 2 === 0 ? 'right' : 'left'}">
                  <h3 class="text-2xl font-bold text-slate-800 mb-4">${step.number}. ${step.title}</h3>
                  <p class="text-slate-600 text-lg">${step.description}</p>
                </div>
                <div class="relative">
                  <div class="w-20 h-20 rounded-full bg-gradient-to-br from-${index === 0 ? 'emerald' : index === 1 ? 'blue' : 'purple'}-500 to-${index === 0 ? 'emerald' : index === 1 ? 'blue' : 'purple'}-600 border-4 border-white shadow-lg flex items-center justify-center">
                    <span class="text-white text-2xl font-bold">${step.number}</span>
                  </div>
                </div>
                <div class="md:w-1/2 md:p${index % 2 === 0 ? 'l' : 'r'}-12"></div>
              </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${whyChoose ? `
          <div class="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm mx-4">
            <div class="max-w-3xl mx-auto">
              <h2 class="text-3xl font-bold text-slate-800 mb-6">${whyChoose.heading}</h2>
              
              ${whyChoose.paragraphs.map(para => `<p class="mb-4 text-slate-600 text-lg">${para}</p>`).join('\n              ')}
              
              ${whyChoose.features && whyChoose.features.length > 0 ? `
              <div class="grid md:grid-cols-2 gap-6 mt-8">
                ${whyChoose.features.slice(0, Math.ceil(whyChoose.features.length / 2)).map(feature => `
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <svg class="h-6 w-6 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-slate-700">${feature}</span>
                  </div>
                </div>
                `).join('')}
                <div class="space-y-4">
                ${whyChoose.features.slice(Math.ceil(whyChoose.features.length / 2)).map(feature => `
                  <div class="flex items-center gap-3">
                    <svg class="h-6 w-6 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-slate-700">${feature}</span>
                  </div>
                `).join('')}
                </div>
              </div>
              ` : ''}
              
              ${whyChoose.stats && whyChoose.stats.length > 0 ? `
              <div class="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8">
                <div class="grid md:grid-cols-3 gap-6 text-center">
                  ${whyChoose.stats.map((stat, index) => `
                  <div>
                    <div class="text-3xl font-bold text-${index === 0 ? 'emerald' : index === 1 ? 'blue' : 'purple'}-600 mb-2">${stat.number}</div>
                    <div class="text-slate-600">${stat.label}</div>
                  </div>
                  `).join('')}
                </div>
              </div>
              ` : ''}
            </div>
          </div>
          ` : ''}
          
          ${qrTypeCards && qrTypeCards.length > 0 ? `
          <div class="mt-16 py-16 px-4 bg-white rounded-lg border shadow-sm mx-4">
            <div class="max-w-3xl mx-auto">
              <h2 class="text-3xl font-bold text-slate-800 text-center mb-4">QR Code Types</h2>
              <p class="text-center text-slate-600 mb-12">Choose from our comprehensive collection of QR Code types for any business need.</p>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${qrTypeCards.map(card => `
                <div class="border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <h3 class="text-xl font-medium text-slate-800 mb-2">${card.name}</h3>
                  <p class="text-slate-600 mb-4">${card.description}</p>
                </div>
                `).join('')}
              </div>
            </div>
          </div>
          ` : ''}
        </main>
        
        ${renderFooter()}
      </div>
  `;
}

/**
 * Scanner page renderer
 */
function renderScanner(config) {
  const h1Text = config.headings?.h1 || 'Scan & Decode QR Codes';
  const h2List = config.headings?.h2 || [];
  
  return `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      ${renderHeader()}
      
      <div class="container max-w-6xl mx-auto px-4 py-12">
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-600">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
            </svg>
          </div>
          <h1 class="text-5xl font-bold mb-6 text-slate-800">${h1Text}</h1>
          ${h2List.map(h2 => `<h2 class="sr-only">${h2}</h2>`).join('\n          ')}
          <p class="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
            ${config.description}
          </p>
        </div>
        
        <div class="bg-white rounded-xl p-10 mb-12 shadow-lg">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-semibold text-slate-800 mb-4">Scanner Tools</h3>
            <p class="text-slate-600">Choose how you want to scan your QR code</p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="p-6 border-2 border-slate-200 rounded-lg hover:border-emerald-500 transition-colors">
              <div class="text-emerald-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold mb-2">Camera Scanner</h4>
              <p class="text-slate-600">Use your device camera to scan QR codes in real-time</p>
            </div>
            
            <div class="p-6 border-2 border-slate-200 rounded-lg hover:border-emerald-500 transition-colors">
              <div class="text-emerald-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold mb-2">Image Upload</h4>
              <p class="text-slate-600">Upload an image file containing a QR code to decode</p>
            </div>
          </div>
          
          <div class="text-center py-8">
            <p class="text-slate-500 italic">Scanner interface will load here...</p>
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="text-center p-6 bg-white rounded-lg shadow">
            <div class="text-emerald-500 mb-3 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-lg mb-2">100% Secure</h3>
            <p class="text-slate-600 text-sm">All scanning happens in your browser. No data is sent to our servers.</p>
          </div>
          
          <div class="text-center p-6 bg-white rounded-lg shadow">
            <div class="text-emerald-500 mb-3 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3 class="font-semibold text-lg mb-2">No Installation</h3>
            <p class="text-slate-600 text-sm">Works directly in your browser. No app download required.</p>
          </div>
          
          <div class="text-center p-6 bg-white rounded-lg shadow">
            <div class="text-emerald-500 mb-3 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-lg mb-2">Lightning Fast</h3>
            <p class="text-slate-600 text-sm">Instant QR code detection and decoding in milliseconds.</p>
          </div>
        </div>
      </div>
      
      ${renderFooter()}
    </div>
  `;
}

/**
 * FAQ page renderer with all questions
 */
function renderFAQ(config) {
  const h1Text = config.headings?.h1 || 'Frequently Asked Questions';
  const h2List = config.headings?.h2 || [];
  
  // All FAQ data
  const faqData = [
    { question: "What is a QR code and how does it work?", answer: "A QR code (Quick Response code) is a two-dimensional barcode that stores information in a grid pattern. When scanned with a camera or QR scanner app, it quickly directs users to websites, displays text, connects to WiFi, or performs other actions. QR codes work by encoding data in black and white squares that smartphones can read instantly.", category: "Basics" },
    { question: "Is your QR code generator really free?", answer: "Yes! Our QR code generator is completely free with no hidden charges. You can create unlimited QR codes for URLs, text, email, phone, SMS, WhatsApp, WiFi, contacts, events, and more. There are no watermarks, no registration required, and no time limits. All features are free for lifetime.", category: "Pricing" },
    { question: "How do I create a QR code online?", answer: "Creating a QR code is simple: 1) Select your QR code type (URL, text, WiFi, etc.), 2) Enter your information, 3) Customize colors and size if desired, 4) Click generate, and 5) Download your QR code. No app download or registration needed. It takes less than 30 seconds!", category: "Getting Started" },
    { question: "Can I scan QR codes online without downloading an app?", answer: "Yes! Use our online QR code scanner at myqrcodetool.com/scanner. You can scan QR codes using your webcam, upload an image with a QR code, or use your mobile camera. It works on all devices - desktop, mobile, and tablet - without any app download. Just allow camera access and point it at the QR code.", category: "Scanner" },
    { question: "How do I create a QR code for my WiFi network?", answer: "Select the WiFi QR code type, enter your network name (SSID), password, and security type (WPA/WEP). Generate the QR code and share it. When guests scan it, their device will automatically connect to your WiFi without manually typing the password. Perfect for homes, offices, and cafes.", category: "WiFi" },
    { question: "Can I add a logo to my QR code?", answer: "Yes! Our QR code generator supports custom logo embedding. You can upload your company logo, brand image, or any picture to place in the center of your QR code. The QR code will remain scannable even with the logo. You can adjust logo size between 15-25% of the QR code size.", category: "Customization" },
    { question: "What types of QR codes can I generate?", answer: "You can generate QR codes for: URLs/websites, plain text, email addresses, phone numbers, SMS messages, WhatsApp chats, WiFi credentials, vCard contacts, calendar events, images, PayPal payments, Zoom meetings, Skype calls, and more. Each type is optimized for its specific use case.", category: "Features" },
    { question: "How do I scan a QR code from an image or screenshot?", answer: "Upload the image to our online scanner at myqrcodetool.com/scanner. Click 'Upload Image' and select your screenshot or photo containing the QR code. Our scanner will automatically detect and decode the QR code from the image. This works with photos, screenshots, or downloaded QR code images.", category: "Scanner" },
    { question: "Are the QR codes generated on your site permanent?", answer: "Yes! Static QR codes generated on our site are permanent and will work forever. Since the data is encoded directly in the QR code itself (not stored on our servers), the codes will continue working even if our website goes down. There's no expiration date.", category: "Basics" },
    { question: "Can I edit or change a QR code after creating it?", answer: "Static QR codes cannot be edited after generation because the data is permanently encoded in the pattern. However, for URL QR codes, you can use a URL shortener that allows editing the destination, or regenerate a new QR code with updated information. Always test before printing.", category: "Editing" },
    { question: "What's the best size for printing QR codes?", answer: "For optimal scanning, QR codes should be at least 2 x 2 cm (0.8 x 0.8 inches) when printed. For business cards, use 2.5-3 cm. For posters or billboards, scale up proportionally - minimum 10 x 10 cm for viewing from 1 meter away. Always test scanning at the intended distance.", category: "Printing" },
    { question: "Do QR codes work without internet?", answer: "It depends on the content. The scanning process works offline, but accessing the content may need internet. Static data like text, phone numbers, WiFi passwords, and vCards work without internet. URLs, images, and online content require an internet connection to load after scanning.", category: "Technical" },
    { question: "How can I track QR code scans?", answer: "For scan tracking, use URL shortening services with analytics (like Bitly) in your URL QR codes, or use dynamic QR code services that offer analytics. Our free static QR codes don't track scans since no data is stored on servers, ensuring complete privacy.", category: "Analytics" },
    { question: "Can I create QR codes in bulk?", answer: "Currently, you can generate QR codes one at a time with full customization options. For bulk QR code generation with different data, you would need to create them individually. Each code can be quickly generated and downloaded in seconds with your custom settings.", category: "Bulk Generation" },
    { question: "What's the difference between static and dynamic QR codes?", answer: "Static QR codes have data permanently encoded and cannot be changed. They work forever without depending on any service. Dynamic QR codes use a redirect URL allowing you to change the destination, but require an active subscription service to keep working.", category: "Basics" },
    { question: "How do I create a vCard QR code for my business card?", answer: "Select vCard or Enhanced vCard from QR types. Enter your contact details: name, phone, email, company, address, website, etc. Generate and download. When scanned, it automatically adds your contact information to the user's phone contacts. Perfect for business cards and networking.", category: "vCard" },
    { question: "Can I customize QR code colors?", answer: "Yes! You can fully customize your QR code colors. Change the foreground (dark squares) and background colors to match your brand. Use our color picker or enter hex codes. Ensure good contrast (dark foreground, light background) for reliable scanning. Test before printing.", category: "Customization" },
    { question: "Are QR codes secure and safe to scan?", answer: "QR codes themselves are safe - they just encode data. However, they can link to malicious websites. Always check the destination before clicking links from scanned QR codes. Our generator creates safe codes with exactly what you input. When scanning unknown codes, preview the URL first.", category: "Security" },
    { question: "How do I create a QR code for a PDF file?", answer: "Upload your PDF to a cloud service (Google Drive, Dropbox, etc.) and get a shareable link. Create a URL QR code with that link. When scanned, users will be directed to view or download your PDF. Ensure the link has public access permissions.", category: "Files" },
    { question: "Can I use QR codes for WhatsApp?", answer: "Yes! Create a WhatsApp QR code by selecting WhatsApp type, entering your phone number with country code, and an optional pre-filled message. When scanned, it opens WhatsApp with your chat ready to start. Perfect for customer support, business inquiries, and quick contact.", category: "WhatsApp" },
    { question: "What's the maximum data capacity of a QR code?", answer: "QR codes can store up to 4,296 alphanumeric characters or 7,089 numeric characters. However, more data makes the QR code more complex with smaller squares, which can be harder to scan. For best results, keep content concise - URLs, short text, contact info work best.", category: "Technical" },
    { question: "Do QR codes expire?", answer: "Static QR codes generated on our site never expire. They work forever because the data is encoded directly in the QR code pattern. There's no server dependency, subscription, or time limit. Print them with confidence - they'll work years from now.", category: "Basics" },
    { question: "Can I scan QR codes with Google Lens?", answer: "Yes! Google Lens, available on Android and iOS, can scan QR codes. Open Google Lens, point your camera at the QR code, and it will automatically detect and decode it. You can also use your device's native camera app or our online scanner for quick scanning.", category: "Scanner" },
    { question: "How do I create an event/calendar QR code?", answer: "Select Event QR code type. Enter event title, date, time, location, and description. Generate the code. When scanned, it creates a calendar entry (ICS format) that users can save directly to their phone calendar. Perfect for invitations, meetings, and event promotions.", category: "Events" },
    { question: "Can I create QR codes for payments?", answer: "Yes! We support PayPal QR codes. Enter your PayPal email, amount, currency, and item description. When scanned, it directs users to PayPal payment page with pre-filled details. Great for invoices, donations, products, and services. Ensure your PayPal account is verified.", category: "Payments" },
    { question: "Is my data private and secure?", answer: "Yes! All QR code generation and scanning happens entirely in your browser using client-side JavaScript. Your QR code content, camera feed, and scanning results are processed locally on your device. We use industry-standard encryption (HTTPS) to protect your connection.", category: "Security" },
    { question: "Can I use My Qrcode Tool offline?", answer: "Yes! After the initial page load, My Qrcode Tool can work offline because it's a client-side application. Your browser caches the necessary files, allowing you to generate and customize QR codes without an internet connection. For scanning, camera access works offline too, though content like URLs will need internet to open.", category: "Technical" },
    { question: "Where is my QR code data stored?", answer: "Your QR code data is never stored anywhere except temporarily in your browser's memory while you're using the generator. When you download a QR code, it's created directly in your browser and saved to your device. We have no servers or databases, so your data is never uploaded, stored, or transmitted to us.", category: "Security" },
    { question: "How does the QR code scanner work?", answer: "Our QR scanner uses your device's camera or allows you to upload an image. It processes the QR code entirely in your browser using advanced JavaScript libraries. Simply grant camera permission, point at a QR code, and get instant results. The scanner works on desktop, mobile, and tablet devices.", category: "Scanner" },
    { question: "Why is my camera not working in the scanner?", answer: "If the camera isn't working: 1) Check if you granted camera permission in your browser, 2) Ensure no other app is using the camera, 3) Try refreshing the page, 4) Check if your browser supports camera access (HTTPS required). You can also upload an image of the QR code instead of using the camera.", category: "Scanner" },
    { question: "Can I scan multiple QR codes at once?", answer: "Currently, you can scan one QR code at a time for accurate results. After scanning one code, you can immediately scan another. For batch scanning from multiple images, you can upload images one by one to our scanner, and each will be decoded instantly.", category: "Scanner" }
  ];
  
  return `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      ${renderHeader()}
      
      <div class="container max-w-4xl mx-auto px-4 py-12">
        <div class="mb-12 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
            </svg>
          </div>
          <h1 class="text-5xl font-bold mb-6 text-slate-800">${h1Text}</h1>
          ${h2List.map(h2 => `<h2 class="sr-only">${h2}</h2>`).join('\n          ')}
          <p class="text-slate-600 text-xl max-w-2xl mx-auto">
            Find answers to common questions about QR code generation and scanning
          </p>
        </div>
        
        <div class="bg-white rounded-xl p-8 shadow-lg mb-8">
          <div class="mb-6">
            <h3 class="text-2xl font-semibold mb-4 text-slate-800">All Questions</h3>
            <p class="text-slate-600">Browse through our comprehensive FAQ to find what you need</p>
          </div>
          
          <div class="space-y-4">
            ${faqData.map(faq => `
            <div class="p-6 border border-slate-200 rounded-lg hover:border-emerald-500 transition-colors">
              <h4 class="font-semibold text-lg mb-3 text-slate-800">${faq.question}</h4>
              <p class="text-slate-600 leading-relaxed">${faq.answer}</p>
              ${faq.category ? `<div class="mt-3"><span class="inline-block px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">${faq.category}</span></div>` : ''}
            </div>
            `).join('')}
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8 text-center">
          <h3 class="text-2xl font-bold mb-4 text-slate-800">Still have questions?</h3>
          <p class="text-slate-600 mb-6">Can't find what you're looking for? Try our QR code generator or scanner!</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" class="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium">
              Try QR Generator
            </a>
            <a href="/scanner" class="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
              Try QR Scanner
            </a>
          </div>
        </div>
      </div>
      
      ${renderFooter()}
    </div>
  `;
}

/**
 * Privacy page renderer
 */
function renderPrivacy(config) {
  const h1Text = config.headings?.h1 || 'Privacy Policy';
  const h2List = config.headings?.h2 || [];
  
  return `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      ${renderHeader()}
      
      <div class="container max-w-4xl mx-auto px-4 py-12">
        <div class="mb-12 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-600">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 class="text-5xl font-bold mb-6 text-slate-800">${h1Text}</h1>
          ${h2List.map(h2 => `<h2 class="sr-only">${h2}</h2>`).join('\n          ')}
          <p class="text-slate-600 text-xl max-w-2xl mx-auto">
            Your privacy is completely protected. Learn about our privacy-first approach.
          </p>
        </div>
        
        <div class="bg-white rounded-xl p-8 shadow-lg mb-8 prose max-w-none">
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-slate-800">100% Client-Side Processing</h2>
            <p class="text-slate-700 leading-relaxed">
              All QR code generation happens directly in your browser. No data is sent to our servers. 
              Your information stays completely private and secure on your device.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-slate-800">No Data Collection</h2>
            <p class="text-slate-700 leading-relaxed">
              We don't collect, store, or transmit any of your QR code data. Everything you create stays on your device. 
              We respect your privacy and believe in a zero-data collection policy.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-slate-800">No Registration Required</h2>
            <p class="text-slate-700 leading-relaxed">
              You can use our QR code generator and scanner without creating an account or providing any personal information. 
              No email, no phone number, no registration - just instant access to our tools.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-slate-800">Secure Connection</h2>
            <p class="text-slate-700 leading-relaxed">
              Our website uses HTTPS encryption to protect your connection and ensure secure communication between your device and our servers.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-slate-800">Analytics</h2>
            <p class="text-slate-700 leading-relaxed">
              We may use privacy-focused analytics to understand how our service is used and improve user experience. 
              These analytics do not collect personal information or QR code content.
            </p>
          </section>
          
          <section>
            <h2 class="text-2xl font-semibold mb-4 text-slate-800">Contact Us</h2>
            <p class="text-slate-700 leading-relaxed">
              If you have any questions about our privacy policy, please contact us through our <a href="/support" class="text-emerald-600 hover:text-emerald-700">support page</a>.
            </p>
          </section>
        </div>
      </div>
      
      ${renderFooter()}
    </div>
  `;
}

/**
 * Support page renderer
 */
function renderSupport(config) {
  const h1Text = config.headings?.h1 || 'Contact Us';
  const h2List = config.headings?.h2 || [];
  
  return `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      ${renderHeader()}
      
      <div class="container max-w-4xl mx-auto px-4 py-12">
        <div class="mb-12 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-600">
              <path d="M12 8v4"/><path d="M12 16h.01"/><circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <h1 class="text-5xl font-bold mb-6 text-slate-800">${h1Text}</h1>
          ${h2List.map(h2 => `<h2 class="sr-only">${h2}</h2>`).join('\n          ')}
          <p class="text-slate-600 text-xl max-w-2xl mx-auto">
            Have a question or need help? We're here to assist you!
          </p>
        </div>
        
        <div class="bg-white rounded-xl p-8 shadow-lg mb-8">
          <div class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-slate-800">Get in Touch</h2>
            <p class="text-slate-600 mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>
          </div>
          
          <div class="space-y-4">
            <div class="p-6 border-2 border-slate-200 rounded-lg">
              <p class="text-slate-600">Contact form will load here...</p>
            </div>
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl p-6 shadow-lg">
            <h3 class="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-500">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
              </svg>
              FAQ
            </h3>
            <p class="text-slate-600 mb-4">Check our frequently asked questions for quick answers</p>
            <a href="/faq" class="text-emerald-600 hover:text-emerald-700 font-medium">Browse FAQ →</a>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-lg">
            <h3 class="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-500">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Email Support
            </h3>
            <p class="text-slate-600 mb-4">Reach out to us directly via email</p>
            <a href="mailto:sudipbiswas1844@gmail.com" class="text-emerald-600 hover:text-emerald-700 font-medium">sudipbiswas1844@gmail.com</a>
          </div>
        </div>
      </div>
      
      ${renderFooter()}
    </div>
  `;
}

/**
 * Download page renderer
 */
function renderDownload(config) {
  const h1Text = config.headings?.h1 || 'Fast & Secure QR Code Scanner App';
  const h2List = config.headings?.h2 || [];
  
  return `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      ${renderHeader()}
      
      <div class="container max-w-6xl mx-auto px-4 py-12">
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-600">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
          </div>
          <h1 class="text-5xl font-bold mb-6 text-slate-800">${h1Text}</h1>
          ${h2List.map(h2 => `<h2 class="sr-only">${h2}</h2>`).join('\n          ')}
          <p class="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
            ${config.description}
          </p>
        </div>
        
        <div class="bg-white rounded-xl p-10 mb-12 shadow-lg text-center">
          <h2 class="text-3xl font-bold mb-6 text-slate-800">Use Our Web-Based Scanner</h2>
          <p class="text-slate-600 mb-8 max-w-2xl mx-auto">No app download required! Our web-based scanner works directly in your browser on any device.</p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/scanner" class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-colors font-semibold text-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              </svg>
              Open Web Scanner
            </a>
            <a href="/" class="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-800 border-2 border-slate-300 rounded-lg hover:border-emerald-500 transition-colors font-semibold text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2">
                <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
              </svg>
              Create QR Code
            </a>
          </div>
          
          <div class="grid md:grid-cols-3 gap-6 mt-12">
            <div class="p-6">
              <div class="text-emerald-500 mb-3 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-lg mb-2">100% Free</h3>
              <p class="text-slate-600 text-sm">No ads, no subscriptions, completely free to use</p>
            </div>
            
            <div class="p-6">
              <div class="text-emerald-500 mb-3 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
                </svg>
              </div>
              <h3 class="font-semibold text-lg mb-2">Works Everywhere</h3>
              <p class="text-slate-600 text-sm">Compatible with all modern browsers and devices</p>
            </div>
            
            <div class="p-6">
              <div class="text-emerald-500 mb-3 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p class="text-slate-600 text-sm">Instant QR code scanning and generation</p>
            </div>
          </div>
        </div>
      </div>
      
      ${renderFooter()}
    </div>
  `;
}

export const renderers = {
  scanner: renderScanner,
  faq: renderFAQ,
  privacy: renderPrivacy,
  support: renderSupport,
  download: renderDownload
};

export { renderDefault };
