
-- Email Templates table
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  category text DEFAULT 'custom',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates" ON public.email_templates
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Email Sends tracking table
CREATE TABLE public.email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  status text DEFAULT 'sent',
  sent_at timestamptz DEFAULT now()
);

ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email sends" ON public.email_sends
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));
