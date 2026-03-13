
-- Campuses table
CREATE TABLE public.campuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  address_line1 text,
  address_line2 text,
  city text NOT NULL,
  postcode text,
  country text NOT NULL DEFAULT 'United Kingdom',
  phone text,
  email text,
  google_maps_url text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active campuses" ON public.campuses FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage campuses" ON public.campuses FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Appointments table
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  user_id uuid,
  campus_id uuid REFERENCES public.campuses(id) ON DELETE SET NULL,
  course_interest text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  preferred_date date,
  preferred_time text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);

-- SMS logs table
CREATE TABLE public.sms_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_phone text NOT NULL,
  recipient_name text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'sent',
  provider_id text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sms logs" ON public.sms_logs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Abandoned carts table
CREATE TABLE public.abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  full_name text,
  phone text,
  page_url text NOT NULL,
  product_type text,
  step_reached text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  recovered boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert abandoned carts" ON public.abandoned_carts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage abandoned carts" ON public.abandoned_carts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_campuses_updated_at BEFORE UPDATE ON public.campuses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
