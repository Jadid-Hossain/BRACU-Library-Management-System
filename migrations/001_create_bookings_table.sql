/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `reservation_code` (text, unique)
      - `date` (date)
      - `facility_type` (text)
      - `room` (text)
      - `email` (text)
      - `slots` (text array)
      - `created_at` (timestamp)
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_code text UNIQUE NOT NULL,
  date date NOT NULL,
  facility_type text NOT NULL,
  room text NOT NULL,
  email text NOT NULL,
  slots text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create additional tables
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL, 
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_help_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  file_name text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS similarity_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  file_name text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
); 