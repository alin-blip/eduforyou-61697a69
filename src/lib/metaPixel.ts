/**
 * Meta Pixel (Facebook Pixel) Helper
 * Pixel ID: 1930929073773570
 *
 * Fires standard Meta Pixel events for conversion tracking.
 * The base pixel code (PageView) is loaded in index.html on every page.
 * This module provides helpers for standard and custom events.
 *
 * FIX (2025-03): Added user data (email, phone) to Lead events for
 * improved Meta match quality and more accurate attribution.
 * User data is hashed client-side via SHA-256 before being sent to Meta.
 */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

const isPixelLoaded = (): boolean => typeof window !== "undefined" && typeof window.fbq === "function";

/**
 * SHA-256 hash a string (for PII hashing before sending to Meta).
 * Meta requires lowercase, trimmed values before hashing.
 */
async function sha256(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  const msgBuffer = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Build a userData object for Meta Pixel advanced matching.
 * Hashes email and phone before passing to fbq.
 * See: https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching
 */
export async function buildUserData(params: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<Record<string, string>> {
  const userData: Record<string, string> = {};
  if (params.email) {
    userData.em = await sha256(params.email);
  }
  if (params.phone) {
    // Normalize phone: strip spaces, dashes, parentheses; keep + prefix
    const normalizedPhone = params.phone.replace(/[\s\-().]/g, "");
    userData.ph = await sha256(normalizedPhone);
  }
  if (params.firstName) {
    userData.fn = await sha256(params.firstName);
  }
  if (params.lastName) {
    userData.ln = await sha256(params.lastName);
  }
  return userData;
}

/** Track a standard Meta Pixel event */
export const trackPixelEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
  if (!isPixelLoaded()) return;
  if (params) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }
};

/** Track a standard Meta Pixel event with user data (advanced matching) */
export const trackPixelEventWithUserData = async (
  eventName: string,
  params?: Record<string, string | number | boolean>,
  userData?: { email?: string; phone?: string; firstName?: string; lastName?: string }
) => {
  if (!isPixelLoaded()) return;
  if (userData) {
    const hashedUserData = await buildUserData(userData);
    // fbq('track', eventName, params, { eventID: ..., userData: ... })
    window.fbq("track", eventName, params || {}, { userData: hashedUserData });
  } else {
    trackPixelEvent(eventName, params);
  }
};

/** Track a custom Meta Pixel event */
export const trackPixelCustomEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
  if (!isPixelLoaded()) return;
  if (params) {
    window.fbq("trackCustom", eventName, params);
  } else {
    window.fbq("trackCustom", eventName);
  }
};

/** Pre-defined conversion events for EduForYou */
export const pixelEvents = {
  /** User views content (ebook page, audiobook page, course pages) */
  viewContent: (contentName: string, contentType?: string, value?: number, currency?: string) =>
    trackPixelEvent("ViewContent", {
      content_name: contentName,
      ...(contentType && { content_type: contentType }),
      ...(value !== undefined && { value }),
      ...(currency && { currency }),
    }),

  /** User clicks "Buy Now" / "Cumpara Acum" button */
  addToCart: (contentName: string, value: number, currency: string = "GBP") =>
    trackPixelEvent("AddToCart", { content_name: contentName, value, currency }),

  /** User starts ebook/audiobook checkout (Stripe session created) */
  initiateCheckout: (bookName: string, price: number) =>
    trackPixelEvent("InitiateCheckout", { content_name: bookName, value: price, currency: "GBP" }),

  /** User completes ebook/audiobook purchase (Thank You page) */
  purchase: (bookName: string, price: number) =>
    trackPixelEvent("Purchase", { content_name: bookName, value: price, currency: "GBP" }),

  /**
   * User completes eligibility form or Ikigai assessment.
   * FIX: Now accepts email + phone for advanced matching (hashed client-side).
   */
  lead: (
    contentName: string,
    userData?: { email?: string; phone?: string; firstName?: string; lastName?: string },
    extra?: Record<string, string | number | boolean>
  ) => {
    const params = { content_name: contentName, ...extra };
    if (userData?.email || userData?.phone) {
      // Fire with user data for better match quality
      trackPixelEventWithUserData("Lead", params, userData);
    } else {
      trackPixelEvent("Lead", params);
    }
  },

  /** User completes eligibility quiz (alias for lead) */
  quizCompleted: (
    eligible: boolean,
    userData?: { email?: string; phone?: string; firstName?: string; lastName?: string }
  ) => {
    const params = { content_name: "Eligibility Quiz", eligible: String(eligible) };
    if (userData?.email || userData?.phone) {
      trackPixelEventWithUserData("Lead", params, userData);
    } else {
      trackPixelEvent("Lead", params);
    }
  },

  /** User signs up / registers an account */
  completeRegistration: (
    method: string = "email",
    userData?: { email?: string; phone?: string; firstName?: string; lastName?: string }
  ) => {
    const params = { content_name: "Account Registration", status: "complete", method };
    if (userData?.email || userData?.phone) {
      trackPixelEventWithUserData("CompleteRegistration", params, userData);
    } else {
      trackPixelEvent("CompleteRegistration", params);
    }
  },

  /** User submits contact form */
  contactFormSubmitted: (
    subject: string,
    userData?: { email?: string; phone?: string }
  ) => {
    const params = { content_name: subject };
    if (userData?.email || userData?.phone) {
      trackPixelEventWithUserData("Contact", params, userData);
    } else {
      trackPixelEvent("Contact", params);
    }
  },

  /** User registers for webinar */
  webinarRegistered: (userData?: { email?: string; phone?: string; firstName?: string }) => {
    const params = { content_name: "Webinar" };
    if (userData?.email || userData?.phone) {
      trackPixelEventWithUserData("Lead", params, userData);
    } else {
      trackPixelEvent("Lead", params);
    }
  },

  /** User downloads a free guide */
  guideDownloaded: (guideName: string) =>
    trackPixelEvent("Lead", { content_name: guideName }),

  /** User subscribes to newsletter */
  newsletterSubscribed: (userData?: { email?: string }) => {
    const params = { content_name: "Newsletter" };
    if (userData?.email) {
      trackPixelEventWithUserData("Lead", params, userData);
    } else {
      trackPixelEvent("Subscribe", params);
    }
  },

  /** User applies for a career position */
  careerApplied: (position: string) =>
    trackPixelEvent("SubmitApplication", { content_name: position }),
};
