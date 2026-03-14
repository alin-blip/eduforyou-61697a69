
-- 1. skill_entries table
CREATE TABLE public.skill_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill text NOT NULL,
  category text NOT NULL DEFAULT 'technical',
  confidence integer NOT NULL DEFAULT 3,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.skill_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own skills" ON public.skill_entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all skills" ON public.skill_entries FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 2. ikigai_results table
CREATE TABLE public.ikigai_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  what_you_love jsonb NOT NULL DEFAULT '[]',
  what_youre_good_at jsonb NOT NULL DEFAULT '[]',
  what_world_needs jsonb NOT NULL DEFAULT '[]',
  what_you_can_be_paid_for jsonb NOT NULL DEFAULT '[]',
  ikigai_statements jsonb NOT NULL DEFAULT '[]',
  service_angles jsonb NOT NULL DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ikigai_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ikigai" ON public.ikigai_results FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ikigai" ON public.ikigai_results FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 3. offers table
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  smv text,
  target_market text,
  pricing_justification text,
  starter_package jsonb,
  standard_package jsonb,
  premium_package jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own offers" ON public.offers FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all offers" ON public.offers FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 4. social_profiles table
CREATE TABLE public.social_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  platform text NOT NULL,
  bio text,
  headline text,
  about text,
  hashtags jsonb DEFAULT '[]',
  content_pillars jsonb DEFAULT '[]',
  cta text,
  username_suggestions jsonb DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

ALTER TABLE public.social_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own social profiles" ON public.social_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all social profiles" ON public.social_profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 5. outreach_templates table
CREATE TABLE public.outreach_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  platform text NOT NULL,
  template_type text,
  subject text,
  content text NOT NULL,
  sequence_order integer DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.outreach_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own outreach templates" ON public.outreach_templates FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all outreach templates" ON public.outreach_templates FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
