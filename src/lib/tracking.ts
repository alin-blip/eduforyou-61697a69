// Tracking utilities for Meta Pixel and GA4
// Pixel ID and GA4 Measurement ID should be set via env vars or config

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Meta Pixel
export const initMetaPixel = (pixelId?: string) => {
  if (!pixelId || typeof window === 'undefined') return;
  if (window.fbq) return; // already initialized

  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  // NoScript fallback
  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
};

// Initialize GA4
export const initGA4 = (measurementId?: string) => {
  if (!measurementId || typeof window === 'undefined') return;
  if (document.querySelector(`script[src*="${measurementId}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  const configScript = document.createElement('script');
  configScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(configScript);
};

// Track events
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }

  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Common tracking events
export const trackPageView = (pageName: string) => {
  trackEvent('PageView', { page_title: pageName });
};

export const trackLead = (source: string, extra?: Record<string, any>) => {
  trackEvent('Lead', { content_name: source, ...extra });
};

export const trackCompleteRegistration = (method: string) => {
  trackEvent('CompleteRegistration', { content_name: method });
};

export const trackInitiateCheckout = (product: string, value?: number) => {
  trackEvent('InitiateCheckout', { content_name: product, value, currency: 'GBP' });
};

export const trackPurchase = (product: string, value: number) => {
  trackEvent('Purchase', { content_name: product, value, currency: 'GBP' });
};

export const trackViewContent = (contentType: string, contentId: string) => {
  trackEvent('ViewContent', { content_type: contentType, content_id: contentId });
};

export const trackSchedule = (source: string) => {
  trackEvent('Schedule', { content_name: source });
};

export const trackSearch = (query: string) => {
  trackEvent('Search', { search_string: query });
};
