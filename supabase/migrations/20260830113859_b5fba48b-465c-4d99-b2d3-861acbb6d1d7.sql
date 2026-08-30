ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS project_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS developer_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS rera_status text NOT NULL DEFAULT 'Not Registered',
  ADD COLUMN IF NOT EXISTS rera_registration_number text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS rera_authority text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS rera_project_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS rera_verification_status text NOT NULL DEFAULT 'Unverified',
  ADD COLUMN IF NOT EXISTS rera_last_verified_date date,
  ADD COLUMN IF NOT EXISTS possession_status text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS authority_approval_status text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS verified_listing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_developer boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gated_society boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS parking_available boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS security_cctv boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS road_facing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS corner_property boolean NOT NULL DEFAULT false;

ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_rera_status_check;
ALTER TABLE public.properties
  ADD CONSTRAINT properties_rera_status_check
  CHECK (rera_status IN ('Registered', 'Not Registered', 'Applied', 'Expired'));

ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_rera_verification_status_check;
ALTER TABLE public.properties
  ADD CONSTRAINT properties_rera_verification_status_check
  CHECK (rera_verification_status IN ('Verified', 'Unverified', 'Pending'));