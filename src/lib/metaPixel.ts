// Meta Pixel helpers
// Re-exports from tracking.ts for convenience + additional Meta-specific helpers

export { initMetaPixel, trackLead, trackPurchase, trackInitiateCheckout, trackCompleteRegistration } from './tracking';

export const trackMetaEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

export const trackMetaCustomEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }
};

export const trackAddToCart = (product: string, value: number) => {
  trackMetaEvent('AddToCart', { content_name: product, value, currency: 'GBP' });
};

export const trackContact = (source: string) => {
  trackMetaEvent('Contact', { content_name: source });
};

export const trackStartTrial = (product: string) => {
  trackMetaEvent('StartTrial', { content_name: product });
};

export const trackSubscribe = (source: string) => {
  trackMetaEvent('Subscribe', { content_name: source });
};
