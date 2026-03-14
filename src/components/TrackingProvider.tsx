import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel, initGA4, trackPageView } from '@/lib/tracking';

// Set these to your actual IDs when ready
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

const TrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'all') {
      initMetaPixel(META_PIXEL_ID);
      initGA4(GA4_MEASUREMENT_ID);
    }
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return <>{children}</>;
};

export default TrackingProvider;
