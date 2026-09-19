-- SUPABASE DATABASE SCHEMA
-- Run this in the Supabase SQL Editor

-- 1. Create Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Profile Table (for About/Contact)
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

-- 3. Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- 4. Policies: Everyone can read, only authenticated admin can write
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin Manage Projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public Read Profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Admin Manage Profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
