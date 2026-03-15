
-- 1. edu_applications
CREATE TABLE public.edu_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_slug text,
  course_name text,
  status text NOT NULL DEFAULT 'in_progress',
  eligibility_data jsonb,
  generated_content text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.edu_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own edu applications" ON public.edu_applications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage edu applications" ON public.edu_applications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. edu_application_steps
CREATE TABLE public.edu_application_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.edu_applications(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.edu_application_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own edu steps" ON public.edu_application_steps FOR ALL USING (
  EXISTS (SELECT 1 FROM public.edu_applications ea WHERE ea.id = application_id AND ea.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.edu_applications ea WHERE ea.id = application_id AND ea.user_id = auth.uid())
);
CREATE POLICY "Admins can manage edu steps" ON public.edu_application_steps FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. career_applications
CREATE TABLE public.career_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  cv_url text,
  cover_letter text,
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit career applications" ON public.career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage career applications" ON public.career_applications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. newsletter_subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  source text DEFAULT 'website',
  lead_magnet text,
  gdpr_consent boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage subscribers" ON public.newsletter_subscribers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. contracts
CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  contract_type text DEFAULT 'standard',
  status text NOT NULL DEFAULT 'draft',
  signed_at timestamptz,
  expires_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage contracts" ON public.contracts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view own contracts" ON public.contracts FOR SELECT USING (auth.uid() = agent_id);

-- 6. eligibility_results
CREATE TABLE public.eligibility_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  eligible boolean,
  qualification text,
  age integer,
  email_sent boolean DEFAULT false,
  ikigai_completed boolean DEFAULT false,
  application_started boolean DEFAULT false,
  answers jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.eligibility_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert eligibility results" ON public.eligibility_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own results" ON public.eligibility_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage eligibility results" ON public.eligibility_results FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. email_sequences
CREATE TABLE public.email_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trigger_event text,
  is_active boolean DEFAULT true,
  steps jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage email sequences" ON public.email_sequences FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. agent_memberships
CREATE TABLE public.agent_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  tier text NOT NULL DEFAULT 'Starter',
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents can view own membership" ON public.agent_memberships FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "Admins can manage memberships" ON public.agent_memberships FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 9. courses
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category text,
  level text,
  duration text,
  campus text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 10. edu_plans
CREATE TABLE public.edu_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_slug text,
  course_name text,
  plan_items jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.edu_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own edu plans" ON public.edu_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage edu plans" ON public.edu_plans FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 11. test_attempts
CREATE TABLE public.test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_slug text,
  test_type text,
  attempt_type text,
  answers jsonb DEFAULT '{}'::jsonb,
  feedback jsonb,
  score integer,
  max_score integer,
  passed boolean,
  time_taken integer,
  duration_seconds integer,
  total_words integer,
  questions_answered integer,
  total_questions integer,
  submitted_at timestamptz,
  status text DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  evaluated_at timestamptz
);
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own test attempts" ON public.test_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage test attempts" ON public.test_attempts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
