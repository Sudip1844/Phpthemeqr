import { useEffect } from 'react';

interface PrefetchConfig {
  currentPage: 'generator' | 'scanner';
  delay?: number;
}

export const usePrefetch = ({ currentPage, delay = 1000 }: PrefetchConfig) => {
  useEffect(() => {
    const prefetchOtherPages = () => {
      if (currentPage === 'generator') {
        setTimeout(() => {
          import('../pages/Scanner');
        }, delay);

        setTimeout(() => {
          import('../pages/Download');
          import('../pages/FAQ');
          import('../pages/Privacy');
        }, delay + 2000);
      } else if (currentPage === 'scanner') {
        setTimeout(() => {
          import('../pages/Index');
        }, delay);

        setTimeout(() => {
          import('../pages/Download');
          import('../pages/FAQ');
          import('../pages/Privacy');
        }, delay + 2000);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => prefetchOtherPages(), { timeout: 2000 });
    } else {
      setTimeout(prefetchOtherPages, delay);
    }
  }, [currentPage, delay]);
};
