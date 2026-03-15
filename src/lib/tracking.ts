/**
 * E.D.U. Method - Event Tracking System
 * Tracks user interactions for lead scoring and funnel analytics
 * Integrated with Meta Pixel + Google Analytics
 *
 * FIX (2025-03): Updated all Lead-generating events to pass user data
 * (email, phone) to Meta Pixel for improved match quality and attribution.
 */

import { pixelEvents } from "./metaPixel";
import { gaEvents, gtagPageView } from "./googleAnalytics";

export interface TrackingEvent {
  event: string;
  category: "page_view" | "engagement" | "conversion" | "form" | "quiz" | "calculator" | "webinar" | "course" | "sales";
  properties?: Record<string, string | number | boolean>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

// Generate session ID
const getSessionId = (): string => {
  let sid = sessionStorage.getItem("edu_session_id");
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("edu_session_id", sid);
  }
  return sid;
};

// Event queue for batching
let eventQueue: TrackingEvent[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

const flushEvents = () => {
  if (eventQueue.length === 0) return;
  const events = [...eventQueue];
  eventQueue = [];

  // Store locally for lead scoring
  const stored = JSON.parse(localStorage.getItem("edu_events") || "[]");
  localStorage.setItem("edu_events", JSON.stringify([...stored, ...events].slice(-500)));
};

export const track = (
  event: string,
  category: TrackingEvent["category"],
  properties?: Record<string, string | number | boolean>
) => {
  const trackingEvent: TrackingEvent = {
    event,
    category,
    properties,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    userId: localStorage.getItem("edu_user_id") || undefined,
  };

  eventQueue.push(trackingEvent);

  // Flush after 2 seconds of inactivity
  if (flushTimeout) clearTimeout(flushTimeout);
  flushTimeout = setTimeout(flushEvents, 2000);
};

// Lead scoring based on events
export interface LeadScore {
  total: number;
  breakdown: {
    engagement: number;
    intent: number;
    fit: number;
  };
  grade: "A" | "B" | "C" | "D";
}

export const calculateLeadScore = (): LeadScore => {
  const events: TrackingEvent[] = JSON.parse(localStorage.getItem("edu_events") || "[]");

  let engagement = 0;
  let intent = 0;
  let fit = 0;

  events.forEach((e) => {
    switch (e.event) {
      case "page_view": engagement += 1; break;
      case "course_viewed": intent += 5; break;
      case "quiz_started": intent += 10; break;
      case "quiz_completed": intent += 20; fit += 15; break;
      case "calculator_used": intent += 15; break;
      case "webinar_registered": intent += 25; engagement += 10; break;
      case "contact_form_submitted": intent += 30; break;
      case "course_applied": intent += 40; fit += 20; break;
      default: engagement += 1;
    }
  });

  // Cap scores
  engagement = Math.min(engagement, 30);
  intent = Math.min(intent, 40);
  fit = Math.min(fit, 30);

  const total = engagement + intent + fit;
  const grade = total >= 70 ? "A" : total >= 50 ? "B" : total >= 25 ? "C" : "D";

  return { total, breakdown: { engagement, intent, fit }, grade };
};

// Initialize Meta Pixel — call once on app start
export const initMetaPixel = (_pixelId: string) => {
  // Meta Pixel init handled via index.html snippet; this is a no-op placeholder
  // for environments where dynamic init is needed.
};

// Initialize GA4 — call once on app start
export const initGA4 = (_measurementId: string) => {
  // GA4 init handled via index.html snippet; this is a no-op placeholder
  // for environments where dynamic init is needed.
};

// Track a lead event — wraps trackEvents.leadCaptured for convenience
export const trackLead = (data: { email?: string; phone?: string; name?: string; source?: string }) => {
  track("lead_captured", "conversion", { ...data });
};

// Track page views — fires internal + GA + Meta Pixel
export const trackPageView = (path: string, title?: string) => {
  track("page_view", "page_view", { path, title: title || document.title });
  gtagPageView(path, title);
  // Meta Pixel PageView fires automatically from index.html on each page load
};

// Predefined tracking events — fires internal + Meta Pixel + GA
export const trackEvents = {
  /** User views a content page (ebook, audiobook, course) — fires ViewContent */
  contentViewed: (contentName: string, contentType?: string, value?: number) => {
    track("content_viewed", "page_view", { contentName, ...(value !== undefined && { value }) });
    pixelEvents.viewContent(contentName, contentType, value, value !== undefined ? "GBP" : undefined);
  },

  /** User views a course detail page — fires ViewContent */
  courseViewed: (courseId: string, courseName: string) => {
    track("course_viewed", "course", { courseId, courseName });
    pixelEvents.viewContent(courseName, "course");
  },

  /** User clicks "Buy Now" / "Cumpara Acum" — fires AddToCart */
  addToCart: (contentName: string, price: number) => {
    track("add_to_cart", "conversion", { contentName, price });
    pixelEvents.addToCart(contentName, price, "GBP");
  },

  quizStarted: () => {
    track("quiz_started", "quiz");
  },

  /**
   * User completes eligibility quiz — fires Lead with user data for matching.
   * FIX: Now passes email + phone for better Meta attribution.
   */
  quizCompleted: (
    eligible: boolean,
    userData?: { email?: string; phone?: string; firstName?: string; lastName?: string }
  ) => {
    track("quiz_completed", "quiz", { eligible });
    pixelEvents.quizCompleted(eligible, userData);
    gaEvents.quizCompleted(eligible);
  },

  /**
   * User completes eligibility form — fires Lead with user data for matching.
   * FIX: Now passes email + phone for better Meta attribution.
   */
  eligibilityCompleted: (
    eligible: boolean,
    userData?: { email?: string; phone?: string; firstName?: string; lastName?: string }
  ) => {
    track("eligibility_completed", "form", { eligible });
    pixelEvents.lead("Eligibility Form", userData, { eligible: String(eligible) });
  },

  /** User completes Ikigai assessment — fires Lead with user data */
  ikigaiCompleted: (email?: string, phone?: string) => {
    track("ikigai_completed", "quiz", { ...(email && { email }) });
    pixelEvents.lead("Ikigai Assessment", { email, phone });
  },

  /** User submits lead magnet form — fires Lead */
  leadMagnetSubmitted: (guideName: string, userData?: { email?: string; phone?: string }) => {
    track("lead_magnet_submitted", "form", { guideName });
    pixelEvents.lead(guideName, userData);
  },

  /**
   * User creates an account — fires CompleteRegistration with user data.
   * FIX: Now passes email + phone for better Meta attribution.
   */
  accountCreated: (
    method: string = "email",
    userData?: { email?: string; phone?: string; firstName?: string; lastName?: string }
  ) => {
    track("account_created", "conversion", { method });
    pixelEvents.completeRegistration(method, userData);
  },

  calculatorUsed: (amount: number) => {
    track("calculator_used", "calculator", { estimatedAmount: amount });
    gaEvents.calculatorUsed(amount);
  },

  /**
   * User registers for webinar — fires Lead with user data.
   * FIX: Now fires Lead (not CompleteRegistration) with email + phone for matching.
   */
  webinarRegistered: (email: string, phone?: string, firstName?: string) => {
    track("webinar_registered", "webinar", { email });
    pixelEvents.webinarRegistered({ email, phone, firstName });
    gaEvents.webinarRegistered();
  },

  /**
   * User submits contact form — fires Contact with user data.
   * FIX: Now passes email + phone for better Meta attribution.
   */
  contactFormSubmitted: (subject: string, userData?: { email?: string; phone?: string }) => {
    track("contact_form_submitted", "form", { subject });
    pixelEvents.contactFormSubmitted(subject, userData);
    gaEvents.contactFormSubmitted(subject);
  },

  courseApplied: (courseId: string) => {
    track("course_applied", "conversion", { courseId });
  },

  ctaClicked: (ctaName: string, location: string) => {
    track("cta_clicked", "engagement", { ctaName, location });
  },

  /** User initiates Stripe checkout — fires InitiateCheckout */
  ebookCheckoutStarted: (bookName: string, price: number) => {
    track("ebook_checkout_started", "conversion", { bookName, price });
    pixelEvents.initiateCheckout(bookName, price);
    gaEvents.beginCheckout(bookName, price);
  },

  /** User completes a purchase — fires Purchase */
  ebookPurchased: (bookName: string, price: number) => {
    track("ebook_purchased", "conversion", { bookName, price });
    pixelEvents.purchase(bookName, price);
    gaEvents.purchase(bookName, price);
  },

  guideDownloaded: (guideName: string) => {
    track("guide_downloaded", "conversion", { guideName });
    pixelEvents.guideDownloaded(guideName);
    gaEvents.guideDownloaded(guideName);
  },

  newsletterSubscribed: (email?: string) => {
    track("newsletter_subscribed", "conversion", {});
    pixelEvents.newsletterSubscribed(email ? { email } : undefined);
    gaEvents.newsletterSubscribed();
  },

  careerApplied: (position: string) => {
    track("career_applied", "form", { position });
    pixelEvents.careerApplied(position);
    gaEvents.careerApplied(position);
  },
};
