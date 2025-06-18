import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { useLanguage } from '../contexts/LanguageContext';
import { debounce } from '../utils/helpers';

/**
 * Hook for tracking page views and user interactions
 */
export function useAnalytics() {
  const location = useLocation();
  const { language } = useLanguage();

  // Track page views
  useEffect(() => {
    const pageName = getPageNameFromPath(location.pathname);
    
    analyticsService.trackPageView({
      pageName,
      pageUrl: location.pathname + location.search,
      referrer: document.referrer,
      language
    });
  }, [location, language]);

  // Debounced scroll tracking
  const trackScrollDepth = useCallback(
    debounce((scrollDepth: number) => {
      if (scrollDepth > 0.8) { // 80% scroll depth
        const pageName = getPageNameFromPath(location.pathname);
        analyticsService.trackServicePageVisit({
          serviceName: pageName,
          scrollDepth,
          language
        });
      }
    }, 1000),
    [location.pathname, language]
  );

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = scrollTop / docHeight;
      
      trackScrollDepth(scrollDepth);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);

  // Track time spent on page
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const timeSpent = Date.now() - startTime;
      const pageName = getPageNameFromPath(location.pathname);
      
      if (timeSpent > 5000) { // Only track if spent more than 5 seconds
        analyticsService.trackServicePageVisit({
          serviceName: pageName,
          timeSpent,
          language
        });
      }
    };
  }, [location.pathname, language]);

  return {
    trackCustomEvent: analyticsService.trackEvent.bind(analyticsService)
  };
}

/**
 * Get readable page name from pathname
 */
function getPageNameFromPath(pathname: string): string {
  const pathMap: { [key: string]: string } = {
    '/': 'Home',
    '/business-cards': 'Business Cards',
    '/brochures': 'Brochures',
    '/flyers': 'Flyers',
    '/banners': 'Banners',
    '/posters': 'Posters',
    '/logo-design': 'Logo Design',
    '/brand-identity': 'Brand Identity',
    '/packaging': 'Packaging',
    '/illustration': 'Illustration'
  };

  return pathMap[pathname] || pathname.replace('/', '').replace('-', ' ');
}

/**
 * Hook for tracking intersection observer events (for proactive messages)
 */
export function useIntersectionTracking(
  elementRef: React.RefObject<HTMLElement>,
  threshold: number = 0.5,
  delay: number = 15000
) {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Set timeout for proactive message
            const timer = setTimeout(() => {
              const pageName = getPageNameFromPath(location.pathname);
              analyticsService.trackProactiveMessage({
                triggerType: 'intersection',
                pageName,
                messageContent: `Proactive message on ${pageName}`,
                language
              });
            }, delay);

            // Cleanup timer if element goes out of view
            const cleanup = () => clearTimeout(timer);
            entry.target.addEventListener('intersectionOut', cleanup);
            
            return () => {
              clearTimeout(timer);
              entry.target.removeEventListener('intersectionOut', cleanup);
            };
          }
        });
      },
      { threshold }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, threshold, delay, language, location.pathname]);
}
