ALTER TABLE public.project_enquiries
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS admin_note text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS replied_at timestamptz;

ALTER TABLE public.project_enquiries
  ADD CONSTRAINT project_enquiries_status_check CHECK (status IN ('pending','replied'));

CREATE POLICY "Admins can update project enquiries"
ON public.project_enquiries FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND length(admin_note) <= 2000 AND status IN ('pending','replied'));

CREATE POLICY "Admins can delete project enquiries"
ON public.project_enquiries FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

GRANT UPDATE, DELETE ON public.project_enquiries TO authenticated;