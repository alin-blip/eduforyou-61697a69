

## Plan: Eligibility Result — Lead Pixel + Account Creation

### What changes

**1. Fire Meta Pixel Lead event on step 4 (result page)**
- When step becomes 4 (after submit), fire `fbq('track', 'Lead')` directly using the pixel ID `1930929073773570`
- Fire unconditionally — regardless of whether user sets a password
- Also fire via the existing `trackLead()` utility for GA4

**2. Add password setup form on the result screen (step 4)**
- Below the existing "A consultant will contact you" text and summary card, add a section:
  - Title: "Create your account" / "Set a password to access your dashboard"
  - Password + Confirm password fields
  - "Create Account" button
- On submit: call `supabase.auth.signUp({ email: form.email, password, options: { data: { full_name: form.fullName } } })`
- Show success toast on account creation
- This is optional — the user can skip it, the lead is already captured

**3. Pixel initialization**
- The pixel is already on the page (user confirmed). Use `window.fbq('track', 'Lead')` directly in the step transition, no need to re-initialize.

### Files to modify
- `src/pages/Eligibility.tsx` — add password form on step 4, fire pixel on reaching step 4

