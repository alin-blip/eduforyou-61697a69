-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete contacts
CREATE POLICY "Admins can delete contacts" ON public.contacts
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));