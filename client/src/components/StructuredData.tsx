import { useEffect } from 'react';
import { getSEOByQRType, seoConfigs, SITE_URL } from '@/lib/seo-config';
import { faqData } from '@/lib/faq';
import { seoConfigs as fullSeoConfigs } from '../../../shared/seo-data.js';

interface StructuredDataProps {
  qrType?: string;
  pageType?: 'generator' | 'scanner' | 'faq' | 'privacy' | 'download' | 'support';
}

const StructuredData = ({ qrType, pageType = 'generator' }: StructuredDataProps) => {
  useEffect(() => {
    const seoConfig = qrType ? getSEOByQRType(qrType) : null;
    const fullConfig = qrType ? fullSeoConfigs[qrType] : null;
    
    const schemas: any[] = [];

    // Add BreadcrumbList schema for pages with breadcrumb data
    if (fullConfig?.breadcrumb && fullConfig.breadcrumb.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": fullConfig.breadcrumb.map((item: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url === "/" ? SITE_URL : `${SITE_URL}${item.url}`
        }))
      });
    }

    if (pageType === 'faq') {
      // FAQ Page Schema
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "name": "QR Code Generator FAQ",
        "description": "Frequently asked questions about QR code generation and scanning",
        "url": window.location.href,
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    } else if (pageType === 'scanner') {
      // Scanner Page Schema
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "QR Code Scanner Online - Free QR Scanner",
        "description": "Fast and secure online QR code scanner. Scan QR codes from camera, upload images, or use webcam. Works on all devices.",
        "url": window.location.href,
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
    } else if (pageType === 'privacy') {
      // Privacy Page Schema
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Privacy Policy - My Qrcode Tool",
        "description": "Privacy policy for My Qrcode Tool QR code generator and scanner services",
        "url": window.location.href
      });
    } else if (pageType === 'support') {
      // Support Page Schema
      schemas.push({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Support - My Qrcode Tool",
        "description": "Get support for My Qrcode Tool QR code generator and scanner services",
        "url": window.location.href
      });
    } else {
      // Generator Page Schema
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": seoConfig ? seoConfig.title : "QR Code Generator - Free Online Tool",
        "description": seoConfig ? seoConfig.description : "Generate QR codes for URLs, emails, text, phone numbers, WiFi, contacts, events, and images. Fast, free, and easy to use.",
        "url": window.location.href,
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
        },
        "potentialAction": [
          {
            "@type": "CreateAction",
            "object": {
              "@type": "QRCode",
              "name": seoConfig ? `${seoConfig.qrType.toUpperCase()} QR Code` : "QR Code"
            }
          }
        ]
      });

      // Add SoftwareApplication schema for all QR types
      schemas.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": Object.values(seoConfigs)
          .filter(config => config.qrType !== 'scanner' && config.qrType !== 'download' && config.qrType !== 'faq' && config.qrType !== 'privacy' && config.qrType !== 'support')
          .map((config, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "SoftwareApplication",
              "name": config.title,
              "description": config.description,
              "url": `${SITE_URL}${config.route}`,
              "applicationCategory": "QRCodeGenerator",
              "keywords": config.keywords.join(", ")
            }
          }))
      });

      // Add per-QR-type FAQ schema if faqItems exist
      if (fullConfig?.faqItems && fullConfig.faqItems.length > 0) {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "name": `${seoConfig?.title} - Frequently Asked Questions`,
          "description": `Common questions about ${seoConfig?.qrType} QR codes`,
          "url": window.location.href,
          "mainEntity": fullConfig.faqItems.map((faq: any) => ({
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

    // Remove all existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add all new structured data schemas as separate script tags
    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, [qrType, pageType]);

  return null;
};

export default StructuredData;
