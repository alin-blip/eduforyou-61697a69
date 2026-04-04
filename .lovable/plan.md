

# Fix: Eligibility contact insert RLS error

## Root cause

The `contacts` insert on line 105-113 of `Eligibility.tsx` chains `.select()` after `.insert()`. This triggers both INSERT and SELECT policies. The INSERT policy allows anyone, but the SELECT policy only allows admins and agents. Since the eligibility form is used by unauthenticated or student users, the SELECT check fails.

The same pattern exists in multiple pages: `Apply.tsx`, `ApplyRo.tsx`, `Contact.tsx`, `WebinarUniversity.tsx`, `WebinarIkigai.tsx`, `WebinarAgents.tsx`.

## Fix

Remove `.select()` from all `contacts` insert calls where the caller doesn't need the returned data. This is the simplest and most secure fix — no need to weaken RLS policies.

### Files to edit:
1. **`src/pages/Eligibility.tsx`** — remove `.select()` from contacts insert (line 113)
2. **`src/pages/Apply.tsx`** — remove `.select()` from contacts insert
3. **`src/pages/ApplyRo.tsx`** — remove `.select()` from contacts insert
4. **`src/pages/Contact.tsx`** — remove `.select()` if present
5. **`src/pages/webinar/WebinarUniversity.tsx`** — remove `.select()` if present
6. **`src/pages/webinar/WebinarIkigai.tsx`** — remove `.select()` if present
7. **`src/pages/webinar/WebinarAgents.tsx`** — remove `.select()` if present
8. **`src/components/webinar/IkigaiSignupForm.tsx`** — remove `.select()` if present

### Edge function build errors

Two additional build errors to fix in the same pass:

1. **`supabase/functions/send-transactional-email/index.ts`** — remove `@react-email/render` import (npm package not available in Deno). Replace with inline HTML string handling.

2. **`supabase/functions/process-email-queue/index.ts`** — add explicit types to `.map((msg: any)` and `.filter((id: any)` to fix implicit `any` errors.

---

## Regarding GitHub sync

Sincronizarea cu GitHub funcționează bidirecțional — modificările din GitHub se sincronizează automat în Lovable și invers. Dacă ai făcut modificări pe GitHub și nu le vezi reflectate, verifică în Settings → GitHub dacă repository-ul este conectat corect. Modificările ar trebui să apară automat în câteva secunde după push.

