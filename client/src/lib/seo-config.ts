export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  route: string;
  qrType: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  headings?: {
    h1: string;
    h2: string[];
  };
}

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://myqrcodetool.com';

export const getCanonicalURL = (route: string): string => {
  return `${SITE_URL}${route}`;
};

import { seoConfigs as importedSeoConfigs, defaultSEO } from '../../../shared/seo-data.js';

export const seoConfigs: Record<string, SEOConfig> = importedSeoConfigs as Record<string, SEOConfig>;

export const getDefaultSEO = (): SEOConfig => defaultSEO as SEOConfig;

export const getSEOByRoute = (route: string): SEOConfig => {
  const config = Object.values(seoConfigs).find(config => config.route === route);
  return config || getDefaultSEO();
};

export const getSEOByQRType = (qrType: string): SEOConfig => {
  return seoConfigs[qrType] || getDefaultSEO();
};

const updateMetaTag = (attr: string, content: string, attrType: 'property' | 'name' = 'property') => {
  let metaTag = document.querySelector(`meta[${attrType}="${attr}"]`);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attrType, attr);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', content);
};

export const updatePageSEO = (config: SEOConfig) => {
  document.title = config.title;
  
  const canonicalUrl = getCanonicalURL(config.route);
  
  // Update meta description
  updateMetaTag('description', config.description, 'name');
  
  // Update meta keywords
  updateMetaTag('keywords', config.keywords.join(', '), 'name');
  
  // Update robots meta tag
  if (config.robots) {
    updateMetaTag('robots', config.robots, 'name');
  }
  
  // Update canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);
  
  // Update Open Graph tags
  updateMetaTag('og:title', config.ogTitle || config.title, 'property');
  updateMetaTag('og:description', config.ogDescription || config.description, 'property');
  updateMetaTag('og:type', 'website', 'property');
  updateMetaTag('og:url', canonicalUrl, 'property');
  updateMetaTag('og:site_name', 'My Qrcode Tool', 'property');
  
  if (config.ogImage) {
    updateMetaTag('og:image', SITE_URL + config.ogImage, 'property');
  }
  
  // Update Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image', 'name');
  updateMetaTag('twitter:title', config.twitterTitle || config.ogTitle || config.title, 'name');
  updateMetaTag('twitter:description', config.twitterDescription || config.ogDescription || config.description, 'name');
  
  if (config.twitterImage || config.ogImage) {
    updateMetaTag('twitter:image', SITE_URL + (config.twitterImage || config.ogImage), 'name');
  }
};

export const generateSiteLinks = (currentType?: string) => {
  return Object.values(seoConfigs)
    .filter(config => config.qrType !== currentType)
    .slice(0, 8) // Show first 8 as site links
    .map(config => ({
      title: config.qrType.charAt(0).toUpperCase() + config.qrType.slice(1) + ' QR',
      url: config.route,
      description: config.description.substring(0, 80) + '...'
    }));
};