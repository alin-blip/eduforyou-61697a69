
-- job_positions
CREATE TABLE public.job_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text,
  location text,
  type text DEFAULT 'full-time',
  description text,
  requirements text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.job_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active positions" ON public.job_positions FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage positions" ON public.job_positions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- job_applications
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id uuid REFERENCES public.job_positions(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  cv_url text,
  cover_letter text,
  status text DEFAULT 'submitted',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit job applications" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage job applications" ON public.job_applications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- deals
CREATE TABLE public.deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES public.contacts(id),
  agent_id uuid,
  title text,
  value numeric DEFAULT 0,
  stage text DEFAULT 'lead',
  status text DEFAULT 'open',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage deals" ON public.deals FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view own deals" ON public.deals FOR SELECT USING (auth.uid() = agent_id);

-- touchpoints
CREATE TABLE public.touchpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES public.contacts(id),
  deal_id uuid REFERENCES public.deals(id),
  type text NOT NULL,
  content text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.touchpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage touchpoints" ON public.touchpoints FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- agent_workflow_runs
CREATE TABLE public.agent_workflow_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name text NOT NULL,
  status text DEFAULT 'running',
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb,
  error text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE public.agent_workflow_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage workflow runs" ON public.agent_workflow_runs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- commissions
CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  referral_id uuid REFERENCES public.referrals(id),
  amount numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage commissions" ON public.commissions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view own commissions" ON public.commissions FOR SELECT USING (auth.uid() = agent_id);

-- ceo_agent_messages
CREATE TABLE public.ceo_agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  content text NOT NULL,
  user_id uuid,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ceo_agent_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage ceo messages" ON public.ceo_agent_messages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- agent_approvals
CREATE TABLE public.agent_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'pending',
  details jsonb DEFAULT '{}'::jsonb,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage approvals" ON public.agent_approvals FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view own approvals" ON public.agent_approvals FOR SELECT USING (auth.uid() = agent_id);

-- Add notes column to referrals table
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS notes text;
