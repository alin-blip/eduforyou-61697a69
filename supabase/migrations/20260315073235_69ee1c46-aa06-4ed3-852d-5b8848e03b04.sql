
-- ai_content
CREATE TABLE public.ai_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  content text NOT NULL,
  content_type text DEFAULT 'blog',
  status text DEFAULT 'draft',
  tone text,
  topic text,
  scheduled_for timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage ai content" ON public.ai_content FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- ai_content_calendar
CREATE TABLE public.ai_content_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content_type text DEFAULT 'blog',
  scheduled_date date,
  status text DEFAULT 'planned',
  content_id uuid REFERENCES public.ai_content(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_content_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage content calendar" ON public.ai_content_calendar FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- ai_alerts
CREATE TABLE public.ai_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text,
  type text DEFAULT 'info',
  severity text DEFAULT 'low',
  read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage alerts" ON public.ai_alerts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- agent_workflows
CREATE TABLE public.agent_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger_type text,
  steps jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_workflows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage workflows" ON public.agent_workflows FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- written_questions
CREATE TABLE public.written_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  category text,
  difficulty text DEFAULT 'medium',
  max_words integer,
  course_slug text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.written_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active questions" ON public.written_questions FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage questions" ON public.written_questions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
