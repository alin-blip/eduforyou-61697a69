/**
 * useTracking hook — Wraps client-side tracking + server-side Supabase tracking
 * Fires page views automatically on mount and provides event helpers.
 */
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trackPageView, trackEvents } from "@/lib/tracking";

/**
 * Automatically tracks a page view on mount (client-side + server-side).
 * Returns trackEvents for manual event firing.
 */
export function useTracking(pageName: string, pageCategory?: string) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    // Client-side tracking (GA + Meta Pixel)
    trackPageView(window.location.pathname, pageName);

    // Server-side tracking via Supabase
    supabase.from("events").insert({
      event_type: "page_view",
      event_category: pageCategory || "page_view",
      page: window.location.pathname,
      referrer: document.referrer || null,
      metadata: { pageName },
    } as any).then(/* fire-and-forget */);
  }, [pageName]);

  // Return client-side events + a helper to fire both client + server tracking
  return {
    clientEvents: trackEvents,
    // Convenience: fire both client + server tracking for a single event
    fireEvent: (eventType: string, category: string, metadata?: Record<string, unknown>) => {
      supabase.from("events").insert({
        event_type: eventType,
        event_category: category,
        page: window.location.pathname,
        metadata: metadata as Record<string, string | number | boolean> | undefined,
      } as any).then(/* fire-and-forget */);
    },
  };
}

/**
 * Track abandoned cart on checkout page.
 * Call this when user enters email and starts checkout.
 */
export function useAbandonedCartTracking() {
  return {
    trackCheckoutStarted: (email: string, product: string, productName?: string, price?: string) => {
      supabase.from("events").insert({
        event_type: "checkout_started",
        event_category: "abandoned_cart",
        page: window.location.pathname,
        metadata: {
          email,
          product,
          productName: productName || null,
          price: price || null,
        },
      } as any).then(/* fire-and-forget */);
    },
  };
}
