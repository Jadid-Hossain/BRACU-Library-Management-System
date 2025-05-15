import { NextResponse } from 'next/server';
import sql from '@/lib/neon-db';

export async function GET() {
  try {
    console.log('Checking contact_messages table...');
    
    // In development mode, just return success
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Assuming contact_messages table exists');
      return NextResponse.json({ 
        success: true, 
        exists: true,
        dev_note: 'This is a simulated response in development mode'
      });
    }
    
    // First check if the table exists
    const tableCheckResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'contact_messages'
      ) as exists
    `;
    
    // Handle result safely
    let tableExists = false;
    if (Array.isArray(tableCheckResult) && tableCheckResult.length > 0 && 
        typeof tableCheckResult[0] === 'object' && tableCheckResult[0] !== null) {
      tableExists = 'exists' in tableCheckResult[0] ? !!tableCheckResult[0].exists : false;
    }
    
    if (!tableExists) {
      console.log('contact_messages table does not exist, creating it...');
      // Create the table
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
      return NextResponse.json({ success: true, created: true });
    }
    
    return NextResponse.json({ success: true, exists: true });
  } catch (error: any) {
    console.error('Error checking contact table:', error);
    
    // In development, return success even on error
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Simulating successful table check');
      return NextResponse.json({ 
        success: true, 
        exists: true,
        dev_note: 'This is a simulated success response in development mode'
      });
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check contact table' },
      { status: 500 }
    );
  }
} 