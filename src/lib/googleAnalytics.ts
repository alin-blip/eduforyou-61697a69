/**
 * Google Analytics (gtag.js) Helper
 * Measurement ID: G-XZSG2SSFVS
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = "G-XZSG2SSFVS";

const isGtagLoaded = (): boolean => typeof window !== "undefined" && typeof window.gtag === "function";

/** Send a GA4 event */
export const gtagEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
  if (!isGtagLoaded()) return;
  window.gtag("event", eventName, params);
};

/** Track a page view (called automatically by gtag config, but can be used for SPA navigation) */
export const gtagPageView = (path: string, title?: string) => {
  if (!isGtagLoaded()) return;
  window.gtag("config", GA_ID, {
    page_path: path,
    page_title: title || document.title,
  });
};

/** Pre-defined GA4 events for EduForYou */
export const gaEvents = {
  /** User completes eligibility quiz */
  quizCompleted: (eligible: boolean) =>
    gtagEvent("quiz_completed", { eligible: String(eligible), event_category: "engagement" }),

  /** User starts ebook checkout */
  beginCheckout: (bookName: string, price: number) =>
    gtagEvent("begin_checkout", { currency: "GBP", value: price, items: bookName }),

  /** User completes purchase */
  purchase: (bookName: string, price: number) =>
    gtagEvent("purchase", { currency: "GBP", value: price, transaction_id: `txn_${Date.now()}`, items: bookName }),

  /** User submits contact form */
  contactFormSubmitted: (subject: string) =>
    gtagEvent("generate_lead", { event_category: "contact", event_label: subject }),

  /** User registers for webinar */
  webinarRegistered: () =>
    gtagEvent("sign_up", { method: "webinar" }),

  /** User downloads a free guide */
  guideDownloaded: (guideName: string) =>
    gtagEvent("generate_lead", { event_category: "guide_download", event_label: guideName }),

  /** User subscribes to newsletter */
  newsletterSubscribed: () =>
    gtagEvent("sign_up", { method: "newsletter" }),

  /** User applies for career */
  careerApplied: (position: string) =>
    gtagEvent("generate_lead", { event_category: "career_application", event_label: position }),

  /** Calculator used */
  calculatorUsed: (amount: number) =>
    gtagEvent("calculator_used", { event_category: "engagement", value: amount }),
};
