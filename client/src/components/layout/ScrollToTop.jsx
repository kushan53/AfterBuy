import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls window to top (x: 0, y: 0) on every route navigation
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigating to an anchor link on the same page (e.g. #features), let browser handle anchor
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant', // Instant prevents disorienting jumps
      });
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
};
