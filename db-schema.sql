-- Create bookings table for facility reservations
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  reservation_code VARCHAR(255) NOT NULL UNIQUE,
  date DATE NOT NULL,
  facility_type VARCHAR(255) NOT NULL,
  room VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  slots TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_info table for storing user details
CREATE TABLE IF NOT EXISTS user_info (
  id SERIAL PRIMARY KEY,
  reservation_code VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reservation_code) REFERENCES bookings(reservation_code) ON DELETE CASCADE
);

-- Create similarity_submissions table
CREATE TABLE IF NOT EXISTS similarity_submissions (
  id SERIAL PRIMARY KEY,
  service VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create research_help_requests table
CREATE TABLE IF NOT EXISTS research_help_requests (
  id SERIAL PRIMARY KEY,
  service VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_bookings_date_room ON bookings(date, room);
CREATE INDEX IF NOT EXISTS idx_bookings_reservation_code ON bookings(reservation_code);
CREATE INDEX IF NOT EXISTS idx_user_info_reservation_code ON user_info(reservation_code);
CREATE INDEX IF NOT EXISTS idx_similarity_submissions_email ON similarity_submissions(email);
CREATE INDEX IF NOT EXISTS idx_research_help_email ON research_help_requests(email); 