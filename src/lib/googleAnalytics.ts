// Google Analytics 4 helpers
// Re-exports from tracking.ts for convenience + additional GA-specific helpers

export { initGA4, trackEvent, trackPageView } from './tracking';

export const trackGA4Event = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackConversion = (conversionId: string, value?: number) => {
  trackGA4Event('conversion', {
    send_to: conversionId,
    value,
    currency: 'GBP',
  });
};

export const trackFormSubmission = (formName: string, formId?: string) => {
  trackGA4Event('form_submission', { form_name: formName, form_id: formId });
};

export const trackCTAClick = (ctaName: string, location: string) => {
  trackGA4Event('cta_click', { cta_name: ctaName, cta_location: location });
};

export const trackEligibilityCheck = (result: 'eligible' | 'not_eligible', details?: Record<string, any>) => {
  trackGA4Event('eligibility_check', { result, ...details });
};
