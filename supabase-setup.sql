-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('standard', 'premium')) NOT NULL,
  description TEXT NOT NULL,
  contents JSONB NOT NULL,
  "imageUrl" TEXT NOT NULL
);

-- Create Stories Table
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Members Table
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  "joinDate" TEXT NOT NULL,
  role TEXT CHECK (role IN ('member', 'volunteer', 'moderator', 'admin')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) NOT NULL,
  bio TEXT,
  "imageUrl" TEXT
);

-- Create Join Requests Table
CREATE TABLE IF NOT EXISTS join_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  "requestDate" TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL DEFAULT 'pending'
);

-- Create Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  "donorName" TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('completed', 'pending')) NOT NULL DEFAULT 'completed'
);

-- Seed Products
INSERT INTO products (id, name, type, description, contents, "imageUrl") 
VALUES
('1', 'Standard Kit', 'standard', 'Essential menstrual hygiene kit with washable pads and accessories designed for everyday use and long-term sustainability.', '["5 Reusable Organic Cotton Pads (washable)", "Organic Cotton Undergarments (2)", "Carrying Pouch", "Menstrual Health Educational Booklet", "Eco-friendly Disposal Bags"]'::jsonb, '/images/product-standard.png'),
('2', 'Premium Kit', 'premium', 'Complete menstrual wellness solution with organic products, menstrual cup, and comprehensive health education materials.', '["10 Organic Reusable Pads (premium quality)", "Organic Cotton Undergarments (3 sets)", "Medical-Grade Menstrual Cup", "Luxury Carrying Pouch", "Organic Intimate Wash (100ml)", "Natural Pain Relief Patches", "Comprehensive Health & Hygiene Guide (Urdu & English)", "Eco-friendly Disposal System"]'::jsonb, '/images/product-premium.png')
ON CONFLICT (id) DO NOTHING;

-- Seed Stories
INSERT INTO stories (id, title, content, author, date, "imageUrl", featured)
VALUES
('1', 'From School Absence to Top Grades', 'I was missing 5 days every month from school because I didn''t have access to proper hygiene products. Floravia Pal changed my life. Now I attend all classes and my grades have improved from C to A. I want to become a doctor and help other girls.', 'Aisha, Age 16, Karachi', '2024-06-10', '/images/story-1.png', true),
('2', 'Empowering the Next Generation', 'As a teacher for 15 years, I''ve seen the direct impact. Girls who receive these kits have better attendance, confidence, and academic performance. Floravia Pal''s educational materials help us break the stigma around menstruation in our schools.', 'Fatima Khan, Secondary School Teacher', '2024-05-15', '/images/story-2.png', true),
('3', 'A Mother''s Peace of Mind', 'Raising three daughters in Pakistan was a financial challenge. Floravia Pal''s kits gave me peace of mind knowing my daughters have access to dignified period management. It''s more than products - it''s respect and equality.', 'Rabia Ahmed, Mother of 3', '2024-04-20', '/images/story-3.png', false)
ON CONFLICT (id) DO NOTHING;

-- Seed Members
INSERT INTO members (id, name, email, "joinDate", role, status)
VALUES
('1', 'Dr. Hina Malik', 'hina@floravia.com', '2023-01-15', 'admin', 'active'),
('2', 'Saira Hussain', 'saira@floravia.com', '2023-03-20', 'moderator', 'active'),
('3', 'Amina Yousaf', 'amina@floravia.com', '2024-01-10', 'volunteer', 'active'),
('4', 'Zainab Ali', 'zainab@floravia.com', '2024-02-05', 'volunteer', 'active'),
('5', 'Bushra Khan', 'bushra@floravia.com', '2024-03-12', 'member', 'active')
ON CONFLICT (id) DO NOTHING;

-- Disable Row Level Security (RLS) for testing or enable public access
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
