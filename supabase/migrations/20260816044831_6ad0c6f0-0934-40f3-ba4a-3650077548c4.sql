CREATE TABLE public.upcoming_projects (
  id text PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT 'Agra',
  type text NOT NULL DEFAULT 'Residential Plots',
  expected_launch text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  sizes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Coming Soon',
  published boolean NOT NULL DEFAULT true,
  image text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  highlights text[] NOT NULL DEFAULT '{}',
  amenities text[] NOT NULL DEFAULT '{}',
  timeline text[] NOT NULL DEFAULT '{}',
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text NOT NULL DEFAULT '',
  overview text NOT NULL DEFAULT '',
  connectivity text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.upcoming_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.upcoming_projects TO authenticated;
GRANT ALL ON public.upcoming_projects TO service_role;

ALTER TABLE public.upcoming_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published upcoming projects are viewable"
  ON public.upcoming_projects FOR SELECT
  USING (published = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert upcoming projects"
  ON public.upcoming_projects FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update upcoming projects"
  ON public.upcoming_projects FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete upcoming projects"
  ON public.upcoming_projects FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER upcoming_projects_set_updated_at
  BEFORE UPDATE ON public.upcoming_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.project_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text NOT NULL,
  project text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  buyer_type text NOT NULL DEFAULT 'Buyer',
  message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.project_enquiries TO anon;
GRANT SELECT, INSERT ON public.project_enquiries TO authenticated;
GRANT ALL ON public.project_enquiries TO service_role;

ALTER TABLE public.project_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a project enquiry"
  ON public.project_enquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(mobile) BETWEEN 6 AND 20
    AND length(project) <= 150
    AND length(budget) <= 100
    AND length(message) <= 1000
  );

CREATE POLICY "Admins can read project enquiries"
  ON public.project_enquiries FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER project_enquiries_set_updated_at
  BEFORE UPDATE ON public.project_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.upcoming_projects
  (id, name, location, city, type, expected_launch, price, sizes, status, image, images, highlights, amenities, timeline, faqs, description, overview, connectivity, sort_order)
VALUES
  ('vrindavan-greens-phase-2', 'Vrindavan Greens — Phase 2', 'Inner Ring Road', 'Agra', 'Residential Plots', 'Q4 2026', '₹34 Lakh onwards', '1000 / 1500 / 2000 sq.ft.', 'Pre-Launch', '/images/prop-plots.jpg', ARRAY['/images/prop-plots.jpg','/images/prop-villa2.jpg'],
   ARRAY['Pre-launch pricing for early buyers','Gated plotted township','Registry-ready titles','Wide 30 ft internal roads'],
   ARRAY['Landscaped parks','Gated security','Underground wiring','Rainwater harvesting','Clubhouse','Jogging track'],
   ARRAY['Bookings open — Q2 2026','Development approval — Q3 2026','Official launch — Q4 2026','Possession — 2028'],
   '[{"q":"Is the project approved?","a":"Approvals are in the final stage; complete documentation is shared with every registered buyer."},{"q":"Can I book at pre-launch price?","a":"Yes, limited pre-launch inventory is offered at introductory pricing to registered buyers."}]'::jsonb,
   'Vrindavan Greens Phase 2 on Inner Ring Road, Agra — a pre-launch gated plotted township with 1000–2000 sq.ft. registry-ready plots from ₹34 Lakh.',
   'Phase 2 extends the successful Vrindavan Greens township with a low-density plotted layout, landscaped parks and a gated perimeter, planned for families and long-term investors.',
   '8 minutes from Inner Ring Road junction, 20 minutes to Taj Mahal, close to upcoming metro corridor and Agra–Lucknow Expressway entry.', 1),
  ('jewar-airport-corridor-villas', 'Airport Corridor Villas', 'Yamuna Expressway', 'Greater Noida', 'Villas', 'Q2 2027', '₹1.65 Cr onwards', '2200 – 3000 sq.ft.', 'Coming Soon', '/images/hero-villa.jpg', ARRAY['/images/hero-villa.jpg','/images/prop-villa2.jpg'],
   ARRAY['Minutes from Jewar Airport','Low-density villa community','Strong appreciation corridor','Private lawns with every villa'],
   ARRAY['Clubhouse','Swimming pool','Gym','24x7 security','Power backup','Kids play area'],
   ARRAY['Interest registration — 2026','Pre-launch allotment — Q4 2026','Launch — Q2 2027','Possession — 2029'],
   '[{"q":"How far is Jewar Airport?","a":"The site is a short drive from the Jewar Airport access road along the Yamuna Expressway."},{"q":"Are home loans available?","a":"Yes, leading banks are expected to be approved at launch and we assist with the full process."}]'::jsonb,
   'Airport Corridor Villas on Yamuna Expressway, Greater Noida — upcoming 2200–3000 sq.ft. luxury villas near Jewar Airport from ₹1.65 Crore.',
   'A gated villa community planned along the Jewar Airport growth corridor, offering independent villas with private lawns and full clubhouse amenities.',
   'Direct Yamuna Expressway access, minutes from Jewar International Airport and the Film City corridor, 45 minutes to Noida Sector 18.', 2);
