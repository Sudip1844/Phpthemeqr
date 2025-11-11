export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface UniqueContent {
  headline: string;
  benefits: string[];
  useCases: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOConfigData {
  title: string;
  description: string;
  keywords: string[];
  route: string;
  qrType: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  breadcrumb?: BreadcrumbItem[];
  uniqueContent?: UniqueContent;
  faqItems?: FAQItem[];
}

export const seoConfigs: Record<string, SEOConfigData>;
export const defaultSEO: SEOConfigData;
