import fs from 'fs';
import path from 'path';
import sql from './neon-db';

/**
 * Initialize database tables for the file upload system
 */
export async function initializeDatabase() {
  try {
    console.log('Initializing database tables...');
    
    // Create file_uploads table
    await sql`
      CREATE TABLE IF NOT EXISTS file_uploads (
        id SERIAL PRIMARY KEY,
        file_id TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        upload_type TEXT NOT NULL,
        service TEXT NOT NULL,
        email TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created file_uploads table');
    
    // Create similarity_submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS similarity_submissions (
        id SERIAL PRIMARY KEY,
        service TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        email TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        report_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created similarity_submissions table');
    
    // Create research_help_submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS research_help_submissions (
        id SERIAL PRIMARY KEY,
        research_area TEXT NOT NULL,
        question TEXT NOT NULL,
        file_name TEXT,
        file_path TEXT,
        email TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        response_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created research_help_submissions table');
    
    // Create contact_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created contact_messages table');
    
    // Create facility_booking table
    await sql`
      CREATE TABLE IF NOT EXISTS facility_booking (
        id SERIAL PRIMARY KEY,
        reservation_code TEXT NOT NULL,
        date DATE NOT NULL,
        facility_type TEXT NOT NULL,
        room TEXT NOT NULL,
        email TEXT NOT NULL,
        slots TEXT[] NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, room, reservation_code)
      )
    `;
    console.log('Created facility_booking table');
    
    console.log('Database initialization completed');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

/**
 * Check if required tables exist
 */
export async function checkDatabaseSetup() {
  try {
    // Check if at least one of our tables exists
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'file_uploads'
      ) as exists
    `;
    
    const tablesExist = result[0]?.exists || false;
    
    if (!tablesExist) {
      console.log('Tables do not exist, initializing database...');
      return await initializeDatabase();
    }
    
    console.log('Database tables already exist');
    return true;
  } catch (error) {
    console.error('Error checking database setup:', error);
    return false;
  }
} 