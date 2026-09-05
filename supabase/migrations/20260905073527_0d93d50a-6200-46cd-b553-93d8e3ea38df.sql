ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS offer text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.properties.offer IS 'Short special offer tagline shown on listing cards and detail pages.';