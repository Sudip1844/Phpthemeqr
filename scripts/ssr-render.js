/**
 * SSR Renderers for different page types
 * Each renderer accepts seoConfig and returns static HTML string
 */

/**
 * Default renderer for QR Generator pages
 */
function renderDefault(config) {
  const h1Text = config.headings?.h1 || "Create Professional QR Codes in Seconds";
  const h2List = config.headings?.h2 || [];
  const benefits = config.uniqueContent?.benefits || [];
  const useCases = config.uniqueContent?.useCases || '';
  
  return `
      <div class="min-h-screen bg-slate-50">
        <header role="banner" class="py-4 dynamic-header-bg z-20 relative shadow-sm" style="background: linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(59,130,246,0.05) 100%);">
          <div class="w-full px-4">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold flex items-center gap-2">
                <div class="text-emerald-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                </div>
                <span class="text-slate-700">My Qrcode Tool</span>
              </h1>
            </div>
          </div>
        </header>

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
        </main>
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
    </div>
  `;
}

/**
 * FAQ page renderer  
 */
function renderFAQ(config) {
  const h1Text = config.headings?.h1 || 'Frequently Asked Questions';
  const h2List = config.headings?.h2 || [];
  
  return `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
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
            <h3 class="text-2xl font-semibold mb-4 text-slate-800">Popular Questions</h3>
            <p class="text-slate-600">Get quick answers to the most common questions about our QR code tools</p>
          </div>
          
          <div class="space-y-4">
            <div class="p-6 border border-slate-200 rounded-lg">
              <h4 class="font-semibold text-lg mb-2 text-slate-800">How do I create a QR code?</h4>
              <p class="text-slate-600">Select your QR code type, enter your information, customize if desired, and click generate. Download your QR code instantly!</p>
            </div>
            
            <div class="p-6 border border-slate-200 rounded-lg">
              <h4 class="font-semibold text-lg mb-2 text-slate-800">Are the QR codes free?</h4>
              <p class="text-slate-600">Yes! All our QR codes are completely free to generate and use. No hidden fees or subscriptions required.</p>
            </div>
            
            <div class="p-6 border border-slate-200 rounded-lg">
              <h4 class="font-semibold text-lg mb-2 text-slate-800">Can I customize my QR code?</h4>
              <p class="text-slate-600">Absolutely! You can add logos, change colors, adjust sizes, and apply different frames to make your QR code unique.</p>
            </div>
          </div>
          
          <div class="text-center mt-8 py-6">
            <p class="text-slate-500 italic">More FAQ content will load here...</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Renderer map: maps qrType to renderer function
export const renderers = {
  scanner: renderScanner,
  faq: renderFAQ,
  // Add more page-specific renderers here as needed
  // privacy: renderPrivacy,
  // support: renderSupport,
  // download: renderDownload,
};

// Export default renderer for QR generator pages
export { renderDefault };
