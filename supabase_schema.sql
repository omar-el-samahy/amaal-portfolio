-- SUPABASE DATABASE SCHEMA
-- Run this in the Supabase SQL Editor

-- 1. Create Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  category TEXT,
  description_en TEXT,
  description_ar TEXT,
  image_url TEXT,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Site Settings Table (For Logo, Global Text, etc.)
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  logo_url TEXT,
  favicon_url TEXT,
  hero_title_en TEXT,
  hero_title_ar TEXT,
  hero_sub_en TEXT,
  hero_sub_ar TEXT,
  hero_desc_en TEXT,
  hero_desc_ar TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Profile Table (for About/Contact)
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT,
  role TEXT,
  bio_en TEXT,
  bio_ar TEXT,
  email TEXT,
  whatsapp TEXT,
  linkedin TEXT,
  behance TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Everyone can read, only authenticated admin can write
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin Manage Projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin Manage Settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public Read Profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Admin Manage Profile" ON profile FOR ALL USING (auth.role() = 'authenticated');

-- Initialize Site Settings
INSERT INTO site_settings (id, hero_title_en, hero_title_ar) VALUES (1, 'Amaal Abdou', 'آمال عبده') ON CONFLICT (id) DO NOTHING;
