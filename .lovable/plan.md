

## Plan: Fix eligibility submit timeout

Fișierul `src/pages/Eligibility.tsx` nu a fost modificat în GitHub — codul este același. Trebuie aplicat fix-ul planificat anterior.

### Changes in `src/pages/Eligibility.tsx`

1. **Increase safety timeout** from 12s → 25s (line 101)
2. **Add `.select()` to contacts insert** (line 104) — ensures Supabase JS resolves the promise
3. **Make `quiz_results` insert fire-and-forget** — don't await it, don't let it block the user from seeing results
4. **Add console.log** before/after contacts insert for debugging (temporary)

### Technical detail
- Supabase JS v2 `.insert()` without `.select()` returns `{ count: null, data: null, error: null }` but can sometimes hang waiting for the PostgREST response header `Prefer: return=minimal`. Adding `.select()` forces `Prefer: return=representation` which resolves reliably.
- The `quiz_results` insert is secondary data — if it fails, we log it but don't block the user.

### Files
- `src/pages/Eligibility.tsx` — single file change

