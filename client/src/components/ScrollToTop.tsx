import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const location = useLocation();
  const { pathname, search, state } = location;

  useLayoutEffect(() => {
    // Don't auto-scroll if state contains scrollTo instruction
    // This allows pages to handle their own scroll behavior
    if (state && (state as any).scrollTo) {
      return;
    }
    
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, state]);

  return null;
}
