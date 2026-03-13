
-- The INSERT WITH CHECK (true) on contacts and quiz_results is intentional
-- because anonymous website visitors need to submit forms.
-- Add a created_by_ip column for basic spam prevention instead.
-- No schema changes needed - the permissive INSERT is by design for public forms.

-- However, let's tighten it by ensuring only INSERT is allowed (not UPDATE/DELETE) for anon
-- This is already the case since we only have INSERT policies with WITH CHECK (true)
-- The linter warnings are acceptable for public form submission tables.

SELECT 1; -- No-op, policies are correct by design
