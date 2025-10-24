import { createContext, useContext, ReactNode } from 'react';
import { updatePageSEO, getSEOByRoute, type SEOConfig } from '@/lib/seo-config';

interface SEOContextType {
  updateSEO: (config: SEOConfig) => void;
  updateSEOByRoute: (route: string) => void;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within SEOProvider');
  }
  return context;
};

export const SEOProvider = ({ children }: { children: ReactNode }) => {
  const updateSEO = (config: SEOConfig) => {
    updatePageSEO(config);
  };

  const updateSEOByRoute = (route: string) => {
    const config = getSEOByRoute(route);
    updatePageSEO(config);
  };

  return (
    <SEOContext.Provider value={{ updateSEO, updateSEOByRoute }}>
      {children}
    </SEOContext.Provider>
  );
};
