CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL DEFAULT '',
  page_type text NOT NULL DEFAULT 'page',
  entity_id text NOT NULL DEFAULT '',
  entity_name text NOT NULL DEFAULT '',
  visitor_id text NOT NULL DEFAULT '',
  referrer text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.page_views TO anon;
GRANT SELECT, INSERT, DELETE ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a page view"
ON public.page_views FOR INSERT TO anon, authenticated
WITH CHECK (
  length(path) <= 300 AND length(page_type) <= 40 AND length(entity_id) <= 120
  AND length(entity_name) <= 200 AND length(visitor_id) <= 64 AND length(referrer) <= 300
);

CREATE POLICY "Admins can read page views"
ON public.page_views FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete page views"
ON public.page_views FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX page_views_created_at_idx ON public.page_views (created_at DESC);
CREATE INDEX page_views_entity_idx ON public.page_views (page_type, entity_id);