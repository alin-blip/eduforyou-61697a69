import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { render } from "npm:@react-email/render@0.0.12";
import { PurchaseConfirmationEmail } from "../_shared/email-templates/purchase-confirmation.tsx";

const PRICE_TO_PRODUCT: Record<string, { type: string; name: string; downloadUrl?: string }> = {
  "price_1T92CgBm1vxHnsGAuKMOu0Yn": {
    type: "ebook",
    name: "EduForYou Ebook",
    downloadUrl: "https://eduforyou.co.uk/downloads/ebook",
  },
  "price_1TAvO5Bm1vxHnsGAlsOUCU0n": {
    type: "audiobook",
    name: "EduForYou Audiobook",
    downloadUrl: "https://eduforyou.co.uk/downloads/audiobook",
  },
  "price_1TAvO7Bm1vxHnsGAIKsBV4N7": {
    type: "agent_subscription",
    name: "Agent Standard Plan",
  },
};

const FROM_ADDRESS = "EduForYou <noreply@notify.eduforyou.co.uk>";

const logStep = (step: string, details?: unknown) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    logStep("Missing signature or webhook secret");
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    logStep("Signature verification failed", { error: (err as Error).message });
    return new Response(`Webhook signature verification failed`, { status: 400 });
  }

  logStep("Event received", { type: event.type, id: event.id });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    logStep("Processing checkout.session.completed", { sessionId: session.id });

    // Retrieve line items to get price ID
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    const priceId = lineItems.data[0]?.price?.id;
    const productInfo = priceId ? PRICE_TO_PRODUCT[priceId] : null;

    const customerEmail = session.customer_details?.email || session.customer_email || "";
    const customerName = session.customer_details?.name || "Customer";

    // Find user_id by email if they have an account
    let userId: string | null = null;
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", (await supabase.rpc("get_user_by_email", { email: customerEmail }).catch(() => ({ data: null }))).data)
      .limit(1);

    // Fallback: try auth admin to find user
    if (!userId) {
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const matchedUser = usersData?.users?.find(u => u.email === customerEmail);
      if (matchedUser) userId = matchedUser.id;
    }

    // Insert order
    const { error: orderError } = await supabase.from("orders").insert({
      user_id: userId,
      customer_email: customerEmail,
      stripe_session_id: session.id,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      product_type: productInfo?.type || "unknown",
      price_id: priceId || "unknown",
      amount_total: session.amount_total || 0,
      currency: session.currency || "gbp",
      status: "completed",
    });

    if (orderError) {
      logStep("Order insert failed", { error: orderError.message });
    } else {
      logStep("Order recorded successfully");
    }

    // Send confirmation email with download link
    const amount = session.amount_total
      ? `£${(session.amount_total / 100).toFixed(2)}`
      : "£0.00";

    const html = render(
      PurchaseConfirmationEmail({
        fullName: customerName,
        productName: productInfo?.name || "EduForYou Product",
        downloadUrl: productInfo?.downloadUrl,
        amount,
      })
    );

    const messageId = `purchase-${crypto.randomUUID()}`;
    const subject = `Your ${productInfo?.name || "purchase"} is ready — EduForYou`;

    // Check suppression
    const { data: suppressed } = await supabase
      .from("suppressed_emails")
      .select("id")
      .eq("email", customerEmail)
      .limit(1);

    if (suppressed && suppressed.length > 0) {
      logStep("Email suppressed", { email: customerEmail });
      await supabase.from("email_send_log").insert({
        message_id: messageId,
        template_name: "purchase-confirmation",
        recipient_email: customerEmail,
        status: "suppressed",
        metadata: { productType: productInfo?.type },
      });
    } else {
      // Log and enqueue
      await supabase.from("email_send_log").insert({
        message_id: messageId,
        template_name: "purchase-confirmation",
        recipient_email: customerEmail,
        status: "pending",
        metadata: { productType: productInfo?.type },
      });

      await supabase.rpc("enqueue_email", {
        queue_name: "transactional_emails",
        payload: JSON.stringify({
          message_id: messageId,
          to: customerEmail,
          subject,
          html,
          from: FROM_ADDRESS,
        }),
      });

      logStep("Confirmation email enqueued", { email: customerEmail });

      // Mark download sent
      await supabase
        .from("orders")
        .update({ download_sent: true })
        .eq("stripe_session_id", session.id);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
