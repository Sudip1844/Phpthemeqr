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
  const aboutSection = config.aboutSection;
  const howToUse = config.howToUse;
  const whyChoose = config.whyChoose;
  const qrTypeCards = config.qrTypeCards || [];
  
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

/**
 * Privacy page renderer
 */
function renderPrivacy(config) {
  const h1Text = config.headings?.h1 || 'Privacy Policy';
  const h2List = config.headings?.h2 || [];
  
  return `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
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
              We do not collect, store, or track any information you enter into our QR code generators. 
              Your URLs, email addresses, contact information, and all other data remain completely private.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-slate-800">No Registration Required</h2>
            <p class="text-slate-700 leading-relaxed">
              Use all features without creating an account. No email, no password, no personal information needed.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-slate-800">Cookies & Analytics</h2>
            <p class="text-slate-700 leading-relaxed">
              We use minimal, privacy-friendly analytics to understand general usage patterns. 
              No personally identifiable information is collected or shared with third parties.
            </p>
          </section>
          
          <div class="bg-emerald-50 p-6 rounded-lg mt-8">
            <p class="text-emerald-800 font-medium">
              🔒 Your privacy is our priority. All processing happens in your browser, ensuring complete data security.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Support page renderer
 */
function renderSupport(config) {
  const h1Text = config.headings?.h1 || 'Contact & Support';
  const h2List = config.headings?.h2 || [];
  
  return `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div class="container max-w-6xl mx-auto px-4 py-12">
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h1 class="text-5xl font-bold mb-6 text-slate-800">${h1Text}</h1>
          ${h2List.map(h2 => `<h2 class="sr-only">${h2}</h2>`).join('\n          ')}
          <p class="text-slate-600 text-xl max-w-2xl mx-auto">
            Have questions? We're here to help!
          </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div class="bg-white rounded-xl p-8 shadow-lg">
            <h2 class="text-2xl font-semibold mb-6 text-slate-800">Get in Touch</h2>
            <p class="text-slate-600 mb-6">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <div class="space-y-4">
              <div class="text-center py-8 text-slate-500 italic">
                Contact form will load here...
              </div>
            </div>
          </div>
          
          <div>
            <div class="bg-white rounded-xl p-8 shadow-lg mb-6">
              <h3 class="text-xl font-semibold mb-4 text-slate-800">Quick Help</h3>
              <p class="text-slate-600 mb-4">
                Before contacting us, check out our FAQ page for instant answers to common questions.
              </p>
              <a href="/faq" class="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700">
                Visit FAQ Page
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </a>
            </div>
            
            <div class="bg-white rounded-xl p-8 shadow-lg">
              <h3 class="text-xl font-semibold mb-4 text-slate-800">Feature Requests</h3>
              <p class="text-slate-600">
                Have an idea for a new QR code type or feature? We'd love to hear from you! 
                Your feedback helps us improve our tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Download page renderer
 */
function renderDownload(config) {
  const h1Text = config.headings?.h1 || 'Download QR Scanner App';
  const h2List = config.headings?.h2 || [];
  
  return `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div class="container max-w-4xl mx-auto px-4 py-12">
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-600">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
          </div>
          <h1 class="text-5xl font-bold mb-6 text-slate-800">${h1Text}</h1>
          ${h2List.map(h2 => `<h2 class="sr-only">${h2}</h2>`).join('\n          ')}
          <p class="text-slate-600 text-xl max-w-2xl mx-auto">
            Get the best QR code scanning experience with our mobile app
          </p>
        </div>
        
        <div class="bg-white rounded-xl p-10 shadow-lg mb-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-semibold mb-4 text-slate-800">Available on All Platforms</h2>
            <p class="text-slate-600 text-lg">
              No installation required! Use our web-based scanner directly in your browser.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="p-6 border-2 border-slate-200 rounded-lg text-center">
              <div class="mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-700">
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Mobile Devices</h3>
              <p class="text-slate-600 mb-4">iOS & Android compatible</p>
              <a href="/scanner" class="inline-block px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                Open Scanner
              </a>
            </div>
            
            <div class="p-6 border-2 border-slate-200 rounded-lg text-center">
              <div class="mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-700">
                  <rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Desktop</h3>
              <p class="text-slate-600 mb-4">Works on all browsers</p>
              <a href="/scanner" class="inline-block px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                Open Scanner
              </a>
            </div>
          </div>
          
          <div class="bg-blue-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold mb-3 text-blue-900">Why Use Our Web Scanner?</h3>
            <ul class="space-y-2 text-blue-800">
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>No app installation or permissions required</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>100% secure - all processing happens in your browser</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Always up-to-date with latest features</span>
              </li>
            </ul>
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
  privacy: renderPrivacy,
  support: renderSupport,
  download: renderDownload,
};

// Export default renderer for QR generator pages
export { renderDefault };
