-- Storage bucket for student documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage RLS: users can upload their own documents
CREATE POLICY "Users can upload own documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own documents" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins can view all documents" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));

-- Referrals table for agent tracking
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  referred_name text NOT NULL,
  referred_email text NOT NULL,
  referred_phone text,
  course_interest text,
  status text DEFAULT 'pending',
  commission_amount numeric DEFAULT 0,
  commission_paid boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  converted_at timestamptz
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view own referrals" ON public.referrals
FOR SELECT USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert referrals" ON public.referrals
FOR INSERT WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Admins can manage referrals" ON public.referrals
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Student documents metadata table
CREATE TABLE public.student_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  document_type text NOT NULL DEFAULT 'other',
  status text DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents" ON public.student_documents
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON public.student_documents
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
