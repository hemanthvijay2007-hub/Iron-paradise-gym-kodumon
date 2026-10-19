-- ==============================================================================
-- IRON PARADISE GYM KODUMON - SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase project dashboard (https://supabase.com).
-- 2. Go to the "SQL Editor" tab on the left sidebar.
-- 3. Click "New Query", paste this entire SQL script, and click "RUN".
-- ==============================================================================

-- 1. SITE INFO TABLE (Homepage headlines, contact numbers, hours, location)
CREATE TABLE IF NOT EXISTS public.gym_site_info (
  id INT PRIMARY KEY DEFAULT 1,
  gym_name TEXT NOT NULL DEFAULT 'IRON PARADISE',
  phone TEXT NOT NULL DEFAULT '+91 99615 12136',
  whatsapp_number TEXT NOT NULL DEFAULT '919961512136',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/iron_paradise_multi_gym/',
  location_url TEXT DEFAULT 'https://share.google/YxMJbJvSD5aDmA17K',
  address_placeholder TEXT DEFAULT 'IRON PARADISE Multi-Gym, Kodumon (Tap location reference for Google Maps directions)',
  hours_placeholder TEXT DEFAULT 'Mon - Sat: 5:30 AM - 10:00 PM | Sun: Inquire [Editable in Admin]',
  hero_headline TEXT DEFAULT 'BUILD STRENGTH. BECOME UNSTOPPABLE.',
  hero_tagline TEXT DEFAULT 'Step into an elite fitness atmosphere engineered for high-performance training, iron discipline, and relentless transformation.',
  about_heading TEXT DEFAULT 'WHERE DEDICATION MEETS PURE IRON',
  about_text TEXT DEFAULT 'IRON PARADISE was forged for those who refuse to settle. Whether you are lifting for the first time or chasing heavyweight personal records, our environment offers heavy iron, modern racks, and an intense community focused on authentic results.',
  about_mission TEXT DEFAULT 'To deliver a distraction-free, high-standard fitness space where anyone with the will to work can unlock peak physical performance.',
  about_vision TEXT DEFAULT 'To be the leading strength and bodybuilding destination known for real discipline, top equipment, and an unbreakable community.',
  facilities_note TEXT DEFAULT 'Facility features & equipment specs are customizable in the Admin Panel.',
  notice_banner TEXT DEFAULT '⚡ Welcome to IRON PARADISE! Join now or inquire on WhatsApp to start your fitness journey.',
  show_notice_banner BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MEMBERSHIP PLANS TABLE
CREATE TABLE IF NOT EXISTS public.gym_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  billing TEXT NOT NULL DEFAULT 'Monthly',
  badge TEXT DEFAULT '',
  is_popular BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  description TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COACHES / TRAINERS TABLE (Stores public cloud image URLs)
CREATE TABLE IF NOT EXISTS public.gym_trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  bio TEXT DEFAULT '',
  image TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GALLERY TABLE (Stores public cloud image URLs, category, caption)
CREATE TABLE IF NOT EXISTS public.gym_gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Gym Floor',
  image TEXT NOT NULL,
  caption TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.gym_enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  plan_interest TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.gym_settings (
  id INT PRIMARY KEY DEFAULT 1,
  theme_accent TEXT DEFAULT 'red',
  enable_notice_banner BOOLEAN DEFAULT true,
  show_quick_whatsapp_button BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- STORAGE BUCKET FOR CLOUD IMAGES
-- ==============================================================================
-- Create 'gym-images' public bucket if not already present
INSERT INTO storage.buckets (id, name, public)
VALUES ('gym-images', 'gym-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on all tables
ALTER TABLE public.gym_site_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_settings ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ ACCESS: Anyone on any device can read website data & images
CREATE POLICY "Public can view site info" ON public.gym_site_info FOR SELECT USING (true);
CREATE POLICY "Public can view plans" ON public.gym_plans FOR SELECT USING (true);
CREATE POLICY "Public can view trainers" ON public.gym_trainers FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON public.gym_gallery FOR SELECT USING (true);
CREATE POLICY "Public can view settings" ON public.gym_settings FOR SELECT USING (true);

-- 2. PUBLIC CAN SUBMIT ENQUIRIES: Visitors can send contact forms
CREATE POLICY "Public can submit enquiries" ON public.gym_enquiries FOR INSERT WITH CHECK (true);

-- 3. WRITE PERMISSIONS: Allow authenticated admins (and anon with key) to manage gym content
-- (You can restrict to authenticated users only if using Supabase Auth)
CREATE POLICY "Allow write site info" ON public.gym_site_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write plans" ON public.gym_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write trainers" ON public.gym_trainers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write gallery" ON public.gym_gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write enquiries" ON public.gym_enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write settings" ON public.gym_settings FOR ALL USING (true) WITH CHECK (true);

-- 4. STORAGE POLICIES FOR 'gym-images' BUCKET
CREATE POLICY "Public Access To Gym Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gym-images');

CREATE POLICY "Allow Upload To Gym Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gym-images');

CREATE POLICY "Allow Update To Gym Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gym-images');

CREATE POLICY "Allow Delete From Gym Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'gym-images');

-- ==============================================================================
-- ENABLE REALTIME ON PUBLIC TABLES
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.gym_gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gym_trainers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gym_site_info;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gym_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gym_enquiries;
