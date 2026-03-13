
-- Student gamification table
CREATE TABLE public.student_gamification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  points integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  streak_days integer NOT NULL DEFAULT 0,
  last_activity_date date,
  badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.student_gamification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gamification" ON public.student_gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own gamification" ON public.student_gamification FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gamification" ON public.student_gamification FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all gamification" ON public.student_gamification FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_student_gamification_updated_at BEFORE UPDATE ON public.student_gamification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Student CV data
CREATE TABLE public.student_cv (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  personal_statement text,
  education jsonb NOT NULL DEFAULT '[]'::jsonb,
  experience jsonb NOT NULL DEFAULT '[]'::jsonb,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  languages jsonb NOT NULL DEFAULT '[]'::jsonb,
  certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.student_cv ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own CV" ON public.student_cv FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all CVs" ON public.student_cv FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_student_cv_updated_at BEFORE UPDATE ON public.student_cv FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CEO tasks table
CREATE TABLE public.ceo_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'todo',
  category text,
  due_date date,
  assigned_to uuid,
  created_by uuid,
  ai_generated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ceo_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage tasks" ON public.ceo_tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_ceo_tasks_updated_at BEFORE UPDATE ON public.ceo_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CEO OKRs table
CREATE TABLE public.ceo_okrs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  objective text NOT NULL,
  key_results jsonb NOT NULL DEFAULT '[]'::jsonb,
  quarter text NOT NULL,
  progress integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'on-track',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ceo_okrs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage OKRs" ON public.ceo_okrs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_ceo_okrs_updated_at BEFORE UPDATE ON public.ceo_okrs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
