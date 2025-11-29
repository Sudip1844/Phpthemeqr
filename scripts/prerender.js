import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { seoConfigs, defaultSEO } from '../shared/seo-data.js';
import { renderers, renderDefault } from './ssr-render.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = process.env.VITE_SITE_URL || 'https://myqrcodetool.com';

if (!process.env.VITE_SITE_URL) {
  console.warn('⚠️  Warning: VITE_SITE_URL is not set. Using default: https://myqrcodetool.com');
  console.warn('   Set VITE_SITE_URL environment variable for correct canonical URLs on other domains.\n');
}

// Helper function to ensure trailing slash for non-root routes
function normalizeRoute(route) {
  if (route === '/') return '/';
  return route.endsWith('/') ? route : `${route}/`;
}

function generateJSONLD(config) {
  const schemas = [];
  const normalizedRoute = normalizeRoute(config.route);
  const canonicalUrl = `${SITE_URL}${normalizedRoute}`;
  
  // Add BreadcrumbList schema if breadcrumb data exists
  if (config.breadcrumb && config.breadcrumb.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": config.breadcrumb.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url === "/" ? SITE_URL + "/" : `${SITE_URL}${normalizeRoute(item.url)}`
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

/**
 * Deep merge defaultSEO sections into config
 * Only merges shared informational sections (aboutSection, howToUse, whyChoose, qrTypeCards)
 * Preserves route-specific content and nested objects
 */
function mergeDefaultSections(config) {
  // Create merged config
  const mergedConfig = {
    ...defaultSEO,
    ...config,
    // Deep merge nested objects
    headings: {
      ...defaultSEO.headings,
      ...config.headings
    }
  };
  
  // Only merge shared sections if config doesn't have them (avoid overwriting specialized content)
  if (!config.aboutSection && defaultSEO.aboutSection) {
    mergedConfig.aboutSection = defaultSEO.aboutSection;
  }
  if (!config.howToUse && defaultSEO.howToUse) {
    mergedConfig.howToUse = defaultSEO.howToUse;
  }
  if (!config.whyChoose && defaultSEO.whyChoose) {
    mergedConfig.whyChoose = defaultSEO.whyChoose;
  }
  if (!config.qrTypeCards && defaultSEO.qrTypeCards) {
    mergedConfig.qrTypeCards = defaultSEO.qrTypeCards;
  }
  
  // Preserve route-specific uniqueContent if it exists
  if (config.uniqueContent) {
    mergedConfig.uniqueContent = {
      ...defaultSEO.uniqueContent,
      ...config.uniqueContent
    };
  }
  
  return mergedConfig;
}

function generatePageContent(config) {
  // Use specialized renderer if available, otherwise use default
  const qrType = config.qrType;
  const renderer = renderers[qrType] || renderDefault;
  
  // Merge default sections ONLY for QR generator pages
  // Skip for specialized pages (scanner, faq, privacy, support, download, notfound, etc.)
  const specializedTypes = ['scanner', 'faq', 'privacy', 'support', 'download', 'notfound'];
  const shouldMerge = !specializedTypes.includes(qrType) && renderer === renderDefault;
  const finalConfig = shouldMerge ? mergeDefaultSections(config) : config;
  
  return renderer(finalConfig);
}

function cleanAndInjectMetaTags(html, config) {
  const normalizedRoute = normalizeRoute(config.route);
  const canonicalUrl = `${SITE_URL}${normalizedRoute}`;
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
  console.log('   ✓ Canonical URLs and Open Graph tags');
  console.log('   ✓ Full page content (SSR rendered for specialized pages)\n');
}

prerender();
