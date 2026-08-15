CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.grant_first_user_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.grant_first_user_admin();

CREATE TABLE public.properties (
  id text PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'Residential Plots',
  size text NOT NULL DEFAULT '',
  size_sqft integer NOT NULL DEFAULT 0,
  price text NOT NULL DEFAULT '',
  price_value numeric NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  highlights text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'For Sale',
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  parking integer NOT NULL DEFAULT 0,
  amenities text[] NOT NULL DEFAULT '{}',
  latitude numeric NOT NULL DEFAULT 0,
  longitude numeric NOT NULL DEFAULT 0,
  created_at date NOT NULL DEFAULT current_date,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Properties are publicly viewable" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admins can insert properties" ON public.properties FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update properties" ON public.properties FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete properties" ON public.properties FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER properties_set_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.properties (id, name, location, city, type, size, size_sqft, price, price_value, image, images, highlights, description, status, bedrooms, bathrooms, parking, amenities, latitude, longitude, created_at) VALUES
('shanti-greens-plots', 'Shanti Greens Plots', 'Inner Ring Road', 'Agra', 'Residential Plots', '1000 – 2000 sq.ft.', 1000, '₹32 Lakh onwards', 32, '/images/prop-plots.jpg', ARRAY['/images/prop-plots.jpg','/images/prop-villa2.jpg','/images/prop-commercial.jpg']::text[], ARRAY['Gated township','Clear title','Ready for registry']::text[], 'Registry-ready residential plots of 1000–2000 sq.ft. inside a gated township on Inner Ring Road, Agra, with clear title, wide internal roads and park-facing options starting at ₹32 Lakh.', 'For Sale', 0, 0, 2, ARRAY['Gated Security','Wide Internal Roads','Park Facing','Power Backup','Underground Wiring','Water Supply']::text[], 27.1592, 77.991, '2026-01-08'),
('krishna-metro-city', 'Krishna Metro City', 'Ring Road', 'Agra', 'Residential Plots', '900 – 2000 sq.ft.', 900, '₹28 Lakh onwards', 28, '/images/prop-plots.jpg', ARRAY['/images/prop-plots.jpg','/images/hero-villa.jpg','/images/prop-apartment.jpg']::text[], ARRAY['Gated township','Ring Road frontage','Registry ready','Parks & wide roads']::text[], 'Krishna Metro City is a gated plotted township on Ring Road, Agra offering 900–2000 sq.ft. registry-ready residential plots with wide roads, parks, underground wiring and excellent appreciation potential from ₹28 Lakh.', 'For Sale', 0, 0, 2, ARRAY['Gated Security','Parks & Green Belt','Wide Roads','Underground Wiring','Street Lighting','Registry Ready']::text[], 27.213, 78.008, '2026-02-02'),
('riverfront-villa', 'Riverfront Signature Villa', 'Fatehabad Road', 'Agra', 'Villas', '3200 sq.ft. / 4 BHK', 3200, '₹2.45 Crore', 245, '/images/hero-villa.jpg', ARRAY['/images/hero-villa.jpg','/images/prop-villa2.jpg','/images/prop-apartment.jpg']::text[], ARRAY['Private lawn','Corner plot','Modular interiors']::text[], 'A 3200 sq.ft. 4 BHK signature villa on Fatehabad Road, Agra with a private lawn, corner-plot frontage and modular interiors — a ready luxury home priced at ₹2.45 Crore.', 'For Sale', 4, 4, 2, ARRAY['Private Lawn','Modular Kitchen','Air Conditioning','Security','Power Backup','Furnished']::text[], 27.1585, 78.05, '2026-01-20'),
('expressway-heights', 'Expressway Heights', 'Sector 150', 'Noida', 'Flats & Apartments', '1450 sq.ft. / 3 BHK', 1450, '₹1.35 Crore', 135, '/images/prop-apartment.jpg', ARRAY['/images/prop-apartment.jpg','/images/prop-villa2.jpg','/images/prop-commercial.jpg']::text[], ARRAY['Ready to move','Club & pool','High rental yield']::text[], 'Ready-to-move 3 BHK apartment of 1450 sq.ft. in Sector 150, Noida with clubhouse, pool and strong rental yield along the Noida Expressway, priced at ₹1.35 Crore.', 'For Sale', 3, 3, 1, ARRAY['Swimming Pool','Gymnasium','Clubhouse','Security','Power Backup','Balcony']::text[], 28.43, 77.53, '2026-01-15'),
('sanjay-place-office', 'Sanjay Place Corporate Floor', 'Sanjay Place', 'Agra', 'Commercial Properties', '2100 sq.ft.', 2100, '₹1.10 Crore', 110, '/images/prop-commercial.jpg', ARRAY['/images/prop-commercial.jpg','/images/prop-apartment.jpg','/images/prop-plots.jpg']::text[], ARRAY['Pre-leased option','Prime frontage','Ample parking']::text[], 'A 2100 sq.ft. corporate floor in Sanjay Place, Agra''s prime business belt — pre-leased option, prime frontage and ample parking at ₹1.10 Crore.', 'For Sale', 0, 2, 6, ARRAY['Lift Access','Power Backup','Security','Ample Parking','Air Conditioning','Prime Frontage']::text[], 27.199, 78.008, '2025-12-28'),
('jewar-land-bank', 'Jewar Growth Land Bank', 'Yamuna Expressway', 'Greater Noida', 'Investment Properties', '1800 sq.ft.', 1800, '₹58 Lakh', 58, '/images/prop-plots.jpg', ARRAY['/images/prop-plots.jpg','/images/prop-commercial.jpg','/images/prop-villa2.jpg']::text[], ARRAY['Airport corridor','High appreciation','Authority approved']::text[], '1800 sq.ft. authority-approved investment land on the Yamuna Expressway near the Jewar Airport corridor, Greater Noida — high appreciation potential at ₹58 Lakh.', 'For Sale', 0, 0, 2, ARRAY['Authority Approved','Airport Corridor','Wide Roads','Clear Title']::text[], 28.12, 77.61, '2026-01-05'),
('palm-court-villa', 'Palm Court Duplex Villa', 'Ajmer Road', 'Jaipur', 'Villas', '2400 sq.ft. / 4 BHK', 2400, '₹1.65 Crore', 165, '/images/prop-villa2.jpg', ARRAY['/images/prop-villa2.jpg','/images/hero-villa.jpg','/images/prop-apartment.jpg']::text[], ARRAY['JDA approved','Landscaped garden','Vastu compliant']::text[], 'JDA-approved 4 BHK duplex villa of 2400 sq.ft. on Ajmer Road, Jaipur with a landscaped garden and Vastu-compliant layout, priced at ₹1.65 Crore.', 'For Sale', 4, 4, 2, ARRAY['Landscaped Garden','Vastu Compliant','Security','Power Backup','Balcony','Modular Kitchen']::text[], 26.87, 75.7, '2026-02-10'),
('shaheed-path-homes', 'Shaheed Path Smart Homes', 'Shaheed Path', 'Lucknow', 'Flats & Apartments', '1150 sq.ft. / 2 BHK', 1150, '₹72 Lakh', 72, '/images/prop-apartment.jpg', ARRAY['/images/prop-apartment.jpg','/images/prop-villa2.jpg','/images/prop-plots.jpg']::text[], ARRAY['Bank loan approved','Under construction','Flexi payment']::text[], 'Bank loan approved 2 BHK smart home of 1150 sq.ft. on Shaheed Path, Lucknow — under construction with flexi payment plans at ₹72 Lakh.', 'For Sale', 2, 2, 1, ARRAY['Clubhouse','Gymnasium','Security','Power Backup','Kids Play Area','Balcony']::text[], 26.78, 80.98, '2026-01-30'),
('golf-extn-residences', 'Golf Extension Residences', 'Golf Course Extn. Road', 'Gurugram', 'Flats & Apartments', '2650 sq.ft. / 4 BHK', 2650, '₹4.20 Crore', 420, '/images/prop-apartment.jpg', ARRAY['/images/prop-apartment.jpg','/images/hero-villa.jpg','/images/prop-commercial.jpg']::text[], ARRAY['Low density','Concierge services','Metro connectivity']::text[], 'Low-density 4 BHK residence of 2650 sq.ft. on Golf Course Extension Road, Gurugram with concierge services and metro connectivity, priced at ₹4.20 Crore.', 'For Sale', 4, 4, 2, ARRAY['Swimming Pool','Gymnasium','Concierge','Security','Air Conditioning','Power Backup']::text[], 28.42, 77.07, '2026-02-05');

CREATE POLICY "Admins can read property images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload property images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update property images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete property images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));