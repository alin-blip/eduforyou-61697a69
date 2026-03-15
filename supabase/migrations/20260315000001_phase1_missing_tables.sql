-- Phase 1: Missing tables for EduForYou platform upgrade
-- Tables that already exist (DO NOT recreate):
-- abandoned_carts, applications, appointments, blog_posts, campuses, ceo_okrs, ceo_tasks,
-- contacts, email_send_log, email_send_state, email_sends, email_templates, email_unsubscribe_tokens,
-- ikigai_results, messages, offers, orders, outreach_templates, profiles, quiz_results,
-- referrals, skill_entries, sms_logs, social_profiles, student_cv, student_documents,
-- student_gamification, suppressed_emails, user_roles

-- 1. deals (pipeline management)
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),
  title TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead','discovery_call','eligibility_check','application','documents','finance_application','admission_test','enrolled','lost')),
  value NUMERIC DEFAULT 0,
  course_slug TEXT,
  campus_id UUID REFERENCES campuses(id),
  probability INT DEFAULT 10,
  expected_close_date TIMESTAMPTZ,
  lost_reason TEXT,
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. touchpoints (contact activity timeline)
CREATE TABLE IF NOT EXISTS touchpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  type TEXT NOT NULL CHECK (type IN ('email','call','meeting','note','system','form','chat')),
  title TEXT,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. edu_applications (E.D.U. journey tracker)
CREATE TABLE IF NOT EXISTS edu_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  current_phase TEXT DEFAULT 'evaluate' CHECK (current_phase IN ('evaluate','deliver','unlock')),
  current_step INT DEFAULT 1,
  assigned_consultant UUID,
  university_choice TEXT,
  course_choice TEXT,
  application_status TEXT,
  documents_status TEXT,
  finance_status TEXT,
  eligibility_status TEXT,
  course_match_status TEXT,
  test_prep_status TEXT,
  cv_status TEXT,
  university_response TEXT,
  offer_status TEXT,
  enrollment_confirmed BOOLEAN DEFAULT false,
  edu_plan_status TEXT,
  ikigai_top_domain TEXT,
  ikigai_second_domain TEXT,
  ikigai_recommended_courses JSONB,
  ikigai_completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. edu_application_steps (per-step tracking)
CREATE TABLE IF NOT EXISTS edu_application_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES edu_applications(id),
  step_key TEXT NOT NULL,
  step_label TEXT,
  phase TEXT CHECK (phase IN ('evaluate','deliver','unlock')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','skipped')),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. user_badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_key TEXT NOT NULL,
  badge_name TEXT,
  badge_description TEXT,
  badge_icon TEXT,
  badge_color TEXT,
  points_reward INT DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_key)
);

-- 6. eligibility_results
CREATE TABLE IF NOT EXISTS eligibility_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email TEXT,
  name TEXT,
  phone TEXT,
  years_of_financing INT,
  qualification TEXT,
  age INT,
  residency_years INT,
  immigration_status TEXT,
  date_of_birth DATE,
  eligible BOOLEAN,
  eligibility_type TEXT,
  eligible_levels JSONB,
  reason TEXT,
  max_years INT,
  email_sent BOOLEAN DEFAULT false,
  ikigai_completed BOOLEAN DEFAULT false,
  application_started BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. AI Agent System tables
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('active','idle','error','disabled','paused')),
  description TEXT,
  config JSONB,
  department TEXT,
  system_prompt TEXT,
  autonomy_level TEXT DEFAULT 'semi_auto',
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id),
  action TEXT,
  input JSONB,
  output JSONB,
  success BOOLEAN,
  duration_ms INT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('urgent','high','medium','low')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','overdue','cancelled')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID,
  agent_id UUID,
  contact_id UUID,
  deal_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID,
  type TEXT CHECK (type IN ('urgent','warning','info','opportunity')),
  title TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT,
  content TEXT,
  meta_description TEXT,
  tags JSONB,
  topic TEXT,
  tone TEXT,
  language TEXT DEFAULT 'ro',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  created_by_agent UUID,
  cmo_score INT,
  publish_date DATE,
  published_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_content_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week INT,
  year INT,
  plan JSONB,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Commissions tracking
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  deal_id UUID,
  student_id UUID,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('enrollment','referral','bonus')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','paid')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Agent memberships
CREATE TABLE IF NOT EXISTS agent_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT DEFAULT 'standard',
  status TEXT DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Test prep tables
CREATE TABLE IF NOT EXISTS written_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug TEXT NOT NULL,
  question_text TEXT NOT NULL,
  model_answer TEXT,
  min_words INT,
  max_words INT,
  max_score INT,
  order_index INT,
  evaluation_criteria JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_slug TEXT NOT NULL,
  attempt_type TEXT CHECK (attempt_type IN ('written','oral')),
  answers JSONB,
  feedback JSONB,
  score INT,
  max_score INT,
  passed BOOLEAN,
  time_taken INT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress','submitted','evaluated','failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  evaluated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS personalized_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_slug TEXT NOT NULL,
  personal_info JSONB,
  generated_content TEXT,
  status TEXT DEFAULT 'generating' CHECK (status IN ('generating','completed','failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS edu_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_slug TEXT,
  course_name TEXT,
  eligibility_data JSONB,
  generated_content TEXT,
  status TEXT DEFAULT 'generating' CHECK (status IN ('generating','completed','failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Agent workflow system
CREATE TABLE IF NOT EXISTS agent_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  department TEXT,
  steps JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES agent_workflows(id),
  workflow_name TEXT,
  current_step INT DEFAULT 0,
  total_steps INT,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued','running','waiting_approval','completed','failed','cancelled')),
  input JSONB,
  output JSONB,
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_run_id UUID REFERENCES agent_workflow_runs(id),
  agent_type TEXT,
  type TEXT CHECK (type IN ('content_review','publish','email_send','ad_launch','calendar_approve')),
  title TEXT,
  description TEXT,
  preview_data JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Finance estimates
CREATE TABLE IF NOT EXISTS finance_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID,
  user_id UUID,
  email TEXT,
  course_id TEXT,
  tuition_fee NUMERIC,
  maintenance_loan NUMERIC,
  total_estimate NUMERIC,
  living_location TEXT,
  household_income NUMERIC,
  inputs JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. CEO agent messages
CREATE TABLE IF NOT EXISTS ceo_agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT CHECK (role IN ('user','assistant')),
  content TEXT,
  source TEXT DEFAULT 'dashboard',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Job positions and applications
CREATE TABLE IF NOT EXISTS job_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT DEFAULT 'remote',
  status TEXT DEFAULT 'active',
  requirements TEXT,
  questions JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID REFERENCES job_positions(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  years_experience INT,
  cv_file_url TEXT,
  answers JSONB,
  score INT,
  status TEXT DEFAULT 'new',
  ai_analysis_summary TEXT,
  ai_analysis_match_percent INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  source TEXT,
  lead_magnet TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  gdpr_consent BOOLEAN DEFAULT false,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- 16. Email sequences
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 17. Test prep attempts
CREATE TABLE IF NOT EXISTS test_prep_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_slug TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('written','interview','ai_personalized')),
  score INT,
  total_questions INT,
  answers JSONB,
  feedback JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 18. Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  contract_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  terms JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 19. Careers
CREATE TABLE IF NOT EXISTS careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  department TEXT,
  location TEXT,
  type TEXT DEFAULT 'full-time',
  description TEXT,
  requirements JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 20. Career applications
CREATE TABLE IF NOT EXISTS career_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id UUID REFERENCES careers(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cv_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'deals','touchpoints','edu_applications','edu_application_steps',
    'user_badges','eligibility_results',
    'ai_agents','ai_agent_logs','ai_tasks','ai_alerts',
    'ai_content','ai_content_calendar','commissions','agent_memberships',
    'written_questions','test_attempts','personalized_tests','edu_plans',
    'agent_workflows','agent_workflow_runs','agent_approvals',
    'finance_estimates','ceo_agent_messages','job_positions','job_applications',
    'newsletter_subscribers','email_sequences','test_prep_attempts','contracts',
    'careers','career_applications'
  ])
  LOOP
    EXECUTE format('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY', tbl);
  END LOOP;
END $$;

-- RLS Policies: Admin full access on all tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'deals','touchpoints','edu_applications','edu_application_steps',
    'user_badges','eligibility_results',
    'ai_agents','ai_agent_logs','ai_tasks','ai_alerts',
    'ai_content','ai_content_calendar','commissions','agent_memberships',
    'written_questions','test_attempts','personalized_tests','edu_plans',
    'agent_workflows','agent_workflow_runs','agent_approvals',
    'finance_estimates','ceo_agent_messages','job_positions','job_applications',
    'newsletter_subscribers','email_sequences','test_prep_attempts','contracts',
    'careers','career_applications'
  ])
  LOOP
    EXECUTE format(
      'CREATE POLICY "Admin full access on %I" ON %I FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = ''admin''))',
      tbl, tbl
    );
  END LOOP;
END $$;

-- User-specific policies
CREATE POLICY "Users own edu_applications" ON edu_applications FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own edu_application_steps" ON edu_application_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM edu_applications WHERE id = edu_application_steps.application_id AND user_id = auth.uid())
);
CREATE POLICY "Users own badges" ON user_badges FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users own eligibility" ON eligibility_results FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own test_attempts" ON test_attempts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own personalized_tests" ON personalized_tests FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own edu_plans" ON edu_plans FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own test_prep_attempts" ON test_prep_attempts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own finance_estimates" ON finance_estimates FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own commissions" ON commissions FOR SELECT USING (agent_id = auth.uid());
CREATE POLICY "Users own agent_memberships" ON agent_memberships FOR SELECT USING (user_id = auth.uid());

-- Public access policies
CREATE POLICY "Public newsletter subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public careers view" ON careers FOR SELECT USING (is_active = true);
CREATE POLICY "Public career applications insert" ON career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public job positions view" ON job_positions FOR SELECT USING (status = 'active');
CREATE POLICY "Public job applications insert" ON job_applications FOR INSERT WITH CHECK (true);
