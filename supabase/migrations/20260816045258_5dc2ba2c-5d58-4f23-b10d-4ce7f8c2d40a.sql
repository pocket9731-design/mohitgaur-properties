DROP POLICY "Published upcoming projects are viewable" ON public.upcoming_projects;

CREATE POLICY "Published upcoming projects are viewable"
  ON public.upcoming_projects FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can view all upcoming projects"
  ON public.upcoming_projects FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));