-- Phonics Learning App - Supabase Schema
-- Run this in Supabase SQL Editor to set up your database

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  letter      CHAR(1) NOT NULL UNIQUE,
  sound       TEXT NOT NULL,
  word        TEXT NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id       BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  option1  TEXT NOT NULL,
  option2  TEXT NOT NULL,
  option3  TEXT NOT NULL,
  option4  TEXT NOT NULL,
  answer   TEXT NOT NULL
);

-- Progress table (one row per student)
CREATE TABLE IF NOT EXISTS progress (
  id                BIGSERIAL PRIMARY KEY,
  student_name      TEXT NOT NULL UNIQUE,
  lesson_completed  INTEGER NOT NULL DEFAULT 0,
  quiz_score        INTEGER NOT NULL DEFAULT 0,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (recommended)
ALTER TABLE lessons  ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read on lessons and quizzes
CREATE POLICY "Public read lessons"  ON lessons  FOR SELECT USING (true);
CREATE POLICY "Public read quizzes"  ON quizzes  FOR SELECT USING (true);

-- Allow anyone to upsert their own progress
CREATE POLICY "Anyone can upsert progress" ON progress
  FOR ALL USING (true) WITH CHECK (true);

-- Seed lessons
INSERT INTO lessons (title, letter, sound, word, image_url) VALUES
  ('Apple', 'A', '/æ/', 'Apple', NULL),
  ('Ball',  'B', '/b/',  'Ball',  NULL),
  ('Cat',   'C', '/k/',  'Cat',   NULL),
  ('Dog',   'D', '/d/',  'Dog',   NULL),
  ('Egg',   'E', '/ɛ/',  'Egg',   NULL),
  ('Fish',  'F', '/f/',  'Fish',  NULL),
  ('Goat',  'G', '/ɡ/',  'Goat',  NULL),
  ('Hat',   'H', '/h/',  'Hat',   NULL),
  ('Igloo', 'I', '/ɪ/',  'Igloo', NULL),
  ('Jar',   'J', '/dʒ/', 'Jar',   NULL),
  ('Kite',  'K', '/k/',  'Kite',  NULL),
  ('Lion',  'L', '/l/',  'Lion',  NULL),
  ('Moon',  'M', '/m/',  'Moon',  NULL),
  ('Nest',  'N', '/n/',  'Nest',  NULL),
  ('Owl',   'O', '/ɒ/',  'Owl',   NULL),
  ('Pen',   'P', '/p/',  'Pen',   NULL),
  ('Queen', 'Q', '/kw/', 'Queen', NULL),
  ('Rat',   'R', '/r/',  'Rat',   NULL),
  ('Sun',   'S', '/s/',  'Sun',   NULL),
  ('Tiger', 'T', '/t/',  'Tiger', NULL),
  ('Umbrella','U','/ʌ/', 'Umbrella',NULL),
  ('Van',   'V', '/v/',  'Van',   NULL),
  ('Whale', 'W', '/w/',  'Whale', NULL),
  ('X-ray', 'X', '/ks/', 'X-ray', NULL),
  ('Yak',   'Y', '/j/',  'Yak',   NULL),
  ('Zebra', 'Z', '/z/',  'Zebra', NULL)
ON CONFLICT (letter) DO NOTHING;
