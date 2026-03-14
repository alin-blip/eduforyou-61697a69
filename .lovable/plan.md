

# Stripe Payments Implementation Plan

## Summary
Integrate Stripe checkout for 3 products: Ebook (£5 one-time), Audiobook (£7 one-time), and Agent subscription (£97/month recurring).

## Stripe Products & Prices (already created)
- **Ebook**: `price_1T92CgBm1vxHnsGAuKMOu0Yn` (£5, one-time)
- **Audiobook**: `price_1TAvO5Bm1vxHnsGAlsOUCU0n` (£7, one-time)
- **Agent Standard**: `price_1TAvO7Bm1vxHnsGAIKsBV4N7` (£97/month, recurring)

## Implementation Steps

### 1. Edge Function: `create-checkout`
Single edge function handling all 3 products. Receives `priceId` and `mode` (payment/subscription) from frontend. Creates Stripe checkout session with authenticated user's email. Returns checkout URL.

### 2. Edge Function: `check-subscription`
Checks if user has active Agent subscription. Called from AuthContext on login/page load. Returns `{ subscribed, product_id, subscription_end }`.

### 3. Edge Function: `customer-portal`
Creates Stripe billing portal session for subscription management.

### 4. Update `AuthContext.tsx`
Add subscription state (`isSubscribed`, `subscriptionEnd`). Call `check-subscription` after auth state changes.

### 5. Update Ebook Page (`src/pages/Ebook.tsx`)
- Wire "Get the Book — £5" button to call `create-checkout` with ebook price
- Add Audiobook section with £7 checkout button
- Add success/cancel URL handling

### 6. Create Payment Success Page (`src/pages/PaymentSuccess.tsx`)
Simple confirmation page shown after successful checkout.

### 7. Update Agents Page (`src/pages/Agents.tsx`)
Add "Subscribe — £97/month" CTA button calling `create-checkout` with agent subscription price.

### 8. Update Routing (`src/App.tsx`)
Add `/payment-success` route.

### 9. Update `supabase/config.toml`
Register new edge functions with `verify_jwt = false`.

## Notes
- No webhooks needed -- subscription status checked via Stripe API directly
- Guest checkout supported for ebook/audiobook (no login required)
- Agent subscription requires authentication (agent role)

