import { NextResponse } from 'next/server';
import sql from '@/lib/neon-db';

interface InsertResult {
  id: number;
}

export async function POST(request: Request) {
  try {
    // Log that we've received a request
    console.log('Contact form submission received');
    
    // Parse request data
    const { name, email, phone, subject, message } = await request.json();
    console.log('Contact form data:', { name, email, phone, subject: subject?.substring(0, 20) + '...' });

    // Validate inputs
    if (!name || !email || !message) {
      console.log('Missing required fields in contact form submission');
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // First, ensure the contact_messages table exists with the correct schema
    try {
      const tableResponse = await fetch(new URL('/api/check-contact-table', request.url));
      if (!tableResponse.ok) {
        console.warn('Warning: Contact table check failed, but continuing with submission');
      }
    } catch (error) {
      console.error('Error checking contact table:', error);
      // Continue with the submission even if the check fails
    }

    // Attempt to insert into database
    try {
      console.log('Attempting to save contact message to database...');
      
      const result = await sql`
        INSERT INTO contact_messages (
          name,
          email,
          phone,
          message
        ) VALUES (
          ${name},
          ${email},
          ${phone || null},
          ${message}
        ) RETURNING id
      `;
      
      // Handle result safely with type checking
      let id: number;
      if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object' && result[0] !== null) {
        id = 'id' in result[0] ? (result[0].id as number) : Date.now();
      } else {
        id = Date.now();
      }
      
      console.log('Contact message saved successfully with ID:', id);
      return NextResponse.json({ success: true, id });
      
    } catch (dbError: any) {
      // Specific error for database operations
      console.error('Database operation failed:', dbError);
      
      // In development, simulate success even if the database operation fails
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode: Simulating successful message submission');
        return NextResponse.json({ 
          success: true, 
          id: Date.now(),
          dev_note: 'This is a simulated success response in development mode'
        });
      }
      
      return NextResponse.json(
        { error: 'Database error. Please try again later.', details: process.env.NODE_ENV === 'development' ? dbError.message : undefined },
        { status: 500 }
      );
    }
  } catch (error: any) {
    // General error handling
    console.error('Error processing contact form submission:', error);
    
    // In development, simulate success even if there's a general error
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Simulating successful message submission after error');
      return NextResponse.json({ 
        success: true, 
        id: Date.now(),
        dev_note: 'This is a simulated success response in development mode'
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    );
  }
} 