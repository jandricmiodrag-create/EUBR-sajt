-- Šema koju obrazac koristi; ista tabela postoji u bazi
-- `eurobroker-contact-submissions` (napravio je Next.js projekat).
-- Ovdje stoji da bi lokalni `wrangler pages dev` imao istu tabelu.
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
);
