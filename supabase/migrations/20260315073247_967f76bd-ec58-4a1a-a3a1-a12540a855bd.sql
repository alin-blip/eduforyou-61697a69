
ALTER TABLE public.ai_content_calendar ADD COLUMN IF NOT EXISTS week integer;
ALTER TABLE public.ai_content_calendar ADD COLUMN IF NOT EXISTS year integer;
