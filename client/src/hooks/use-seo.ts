import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOByRoute, updatePageSEO } from '@/lib/seo-config';

export function useSEO(qrType?: string) {
  const location = useLocation();

  useEffect(() => {
    const route = location.pathname;
    const seoConfig = getSEOByRoute(route);
    updatePageSEO(seoConfig);
  }, [location.pathname, qrType]);
}
