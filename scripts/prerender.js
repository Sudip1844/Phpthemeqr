import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { seoConfigs, defaultSEO } from '../shared/seo-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = process.env.VITE_SITE_URL || 'https://myqrcodetool.com';

if (!process.env.VITE_SITE_URL) {
  console.warn('⚠️  Warning: VITE_SITE_URL is not set. Using default: https://myqrcodetool.com');
  console.warn('   Set VITE_SITE_URL environment variable for correct canonical URLs on other domains.\n');
}

function generateJSONLD(config) {
  const schemas = [];
  const canonicalUrl = `${SITE_URL}${config.route}`;
  
  // Add BreadcrumbList schema if breadcrumb data exists
  if (config.breadcrumb && config.breadcrumb.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": config.breadcrumb.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url === "/" ? SITE_URL : `${SITE_URL}${item.url}`
      }))
    });
  }
  
  // Determine page type based on qrType
  const isScanner = config.qrType === 'scanner';
  const isFAQ = config.qrType === 'faq';
  const isPrivacy = config.qrType === 'privacy';
  const isSupport = config.qrType === 'support';
  const isDownload = config.qrType === 'download';
  
  if (isFAQ) {
    // FAQ Page schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": config.title,
      "description": config.description,
      "url": canonicalUrl
    });
  } else if (isScanner) {
    // Scanner WebApplication schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": config.title,
      "description": config.description,
      "url": canonicalUrl,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "My Qrcode Tool"
      }
    });
  } else if (isPrivacy) {
    // Privacy Page schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": config.title,
      "description": config.description,
      "url": canonicalUrl
    });
  } else if (isSupport) {
    // Support ContactPage schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": config.title,
      "description": config.description,
      "url": canonicalUrl
    });
  } else {
    // QR Generator WebApplication schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": config.title,
      "description": config.description,
      "url": canonicalUrl,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "My Qrcode Tool"
      }
    });
    
    // Add per-QR-type FAQ schema if faqItems exist
    if (config.faqItems && config.faqItems.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "name": `${config.title} - FAQ`,
        "description": `Frequently asked questions about ${config.qrType} QR codes`,
        "url": canonicalUrl,
        "mainEntity": config.faqItems.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }
  }
  
  // Generate script tags for all schemas
  return schemas.map(schema => 
    `    <script type="application/ld+json">\n${JSON.stringify(schema, null, 2).split('\n').map(line => '    ' + line).join('\n')}\n    </script>`
  ).join('\n');
}

function generatePageContent(config) {
  // Generate full page content with all sections
  const h1Text = config.headings?.h1 || "Create Professional QR Codes in Seconds";
  const h2List = config.headings?.h2 || [];
  
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
                Generate custom QR codes for your business, events, and personal use. Add logos, customize colors, choose frames, and track performance - all for free!
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
            <div class="text-center py-12">
              <p class="text-lg text-slate-600">QR Code generator loading...</p>
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
          
          <div class="mt-16 py-16 px-4 bg-emerald-500 text-white rounded-lg mx-4">
            <div class="max-w-3xl mx-auto">
              <h2 class="text-xl font-medium mb-3">What are QR Codes?</h2>
              <h3 class="text-4xl font-bold mb-6">QR stands for 'Quick Response'</h3>
              
              <p class="mb-6 text-lg opacity-90">
                QR Codes were invented in 1994 by Denso Wave for tracking automotive parts during manufacturing. 
                They gained massive popularity with the rise of smartphones, making it possible to scan codes 
                directly with your phone's camera.
              </p>
              
              <p class="mb-8 text-lg opacity-90">
                Today, QR Codes have revolutionized how we share information instantly. Let me show you the key 
                benefits and most popular QR Code applications that can transform your business.
              </p>
            </div>
          </div>
          
          <div class="mt-16 py-16 px-4">
            <div class="text-center mb-12">
              <div class="inline-block px-6 py-2 bg-emerald-500 text-white rounded-full font-medium mb-6">
                How to Use
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Creating QR Codes with My Qrcode Tool is Simple and Fast
              </h2>
              <p class="text-xl text-slate-600 max-w-2xl mx-auto">
                Get started in minutes with our intuitive QR Code generator. Create unlimited dynamic and static QR Codes for any purpose.
              </p>
            </div>
          </div>
        </main>
      </div>
  `;
}

function cleanAndInjectMetaTags(html, config) {
  const canonicalUrl = `${SITE_URL}${config.route}`;
  const ogImageUrl = config.ogImage ? `${SITE_URL}${config.ogImage}` : `${SITE_URL}/og-image.png`;
  
  let processedHtml = html;
  
  const seoMetaBlock = `<!-- SEO Meta Tags -->
    <title>${config.title}</title>
    <meta name="description" content="${config.description}" />
    <meta name="keywords" content="${config.keywords.join(', ')}" />
    <meta name="robots" content="${config.robots}" />
    <link rel="canonical" href="${canonicalUrl}" />`;
  
  const ogMetaBlock = `<!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${config.ogTitle || config.title}" />
    <meta property="og:description" content="${config.ogDescription || config.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="My Qrcode Tool" />
    <meta property="og:image" content="${ogImageUrl}" />`;
  
  const twitterMetaBlock = `<!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${config.twitterTitle || config.ogTitle || config.title}" />
    <meta name="twitter:description" content="${config.twitterDescription || config.ogDescription || config.description}" />
    <meta name="twitter:image" content="${ogImageUrl}" />`;
  
  const additionalSeoBlock = `<!-- Additional SEO -->
    <meta name="author" content="My Qrcode Tool" />
    <meta name="theme-color" content="#10b981" />`;
  
  processedHtml = processedHtml.replace(/<!--\s*SEO Meta Tags\s*-->[\s\S]*?(?=\s*<!--\s*Open Graph)/i, seoMetaBlock + '\n    \n    ');
  processedHtml = processedHtml.replace(/<!--\s*Open Graph Meta Tags\s*-->[\s\S]*?(?=\s*<!--\s*Twitter)/i, ogMetaBlock + '\n    \n    ');
  processedHtml = processedHtml.replace(/<!--\s*Twitter Card Meta Tags\s*-->[\s\S]*?(?=\s*<!--\s*Additional SEO)/i, twitterMetaBlock + '\n    \n    ');
  processedHtml = processedHtml.replace(/<!--\s*Additional SEO\s*-->[\s\S]*?(?=\s*<!--\s*Performance)/i, additionalSeoBlock + '\n    \n    ');
  
  // Replace the entire body content with our generated page content
  const pageContent = generatePageContent(config);
  processedHtml = processedHtml.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${pageContent}</div>`
  );
  
  return processedHtml;
}

function prerender() {
  const distPath = join(__dirname, '../dist');
  const indexHtmlPath = join(distPath, 'index.html');
  
  if (!existsSync(indexHtmlPath)) {
    console.error('Error: dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }
  
  const templateHtml = readFileSync(indexHtmlPath, 'utf-8');
  
  console.log('🚀 Starting prerender process...\n');
  
  // Process all seoConfigs routes
  Object.values(seoConfigs).forEach(config => {
    const route = config.route.slice(1);
    const routePath = join(distPath, route);
    const routeIndexPath = join(routePath, 'index.html');
    
    if (!existsSync(routePath)) {
      mkdirSync(routePath, { recursive: true });
    }
    
    const customHtml = cleanAndInjectMetaTags(templateHtml, config);
    const jsonLD = generateJSONLD(config);
    const finalHtml = customHtml.replace('</head>', `${jsonLD}\n  </head>`);
    
    writeFileSync(routeIndexPath, finalHtml);
    console.log(`✅ Generated: ${route}/index.html with H1/H2 headings and JSON-LD`);
  });
  
  // Also process root index.html with defaultSEO
  const rootHtml = cleanAndInjectMetaTags(templateHtml, defaultSEO);
  const rootJsonLD = generateJSONLD(defaultSEO);
  const finalRootHtml = rootHtml.replace('</head>', `${rootJsonLD}\n  </head>`);
  writeFileSync(indexHtmlPath, finalRootHtml);
  console.log(`✅ Generated: / (root) with H1/H2 headings and JSON-LD`);
  
  console.log('\n✨ Prerender complete! All routes have dedicated HTML files with:');
  console.log('   ✓ SEO meta tags (title, description, keywords)');
  console.log('   ✓ H1 and H2 semantic headings for SEO');
  console.log('   ✓ JSON-LD structured data');
  console.log('   ✓ Canonical URLs and Open Graph tags\n');
}

prerender();
