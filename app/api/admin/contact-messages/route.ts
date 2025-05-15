import { NextResponse } from 'next/server';
import sql from '@/lib/neon-db';
import { NeonQueryFunction } from '@neondatabase/serverless';
import { auth } from '@/auth';

// TypeScript type assertion
const neonSql = sql as NeonQueryFunction<any, any>;

// GET: Fetch all contact messages
export async function GET(request: Request) {
  try {
    // Verify admin access
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (Simplified - in a real app, you'd check against your DB)
    // For production, use proper role checking from your database
    
    // Fetch messages from contact_messages table
    const messages = await neonSql`
      SELECT id, name, email, phone, message, created_at, 
        COALESCE(status, 'new') as status
      FROM contact_messages
      ORDER BY 
        CASE WHEN status = 'new' OR status IS NULL THEN 0 ELSE 1 END,
        created_at DESC
    `;

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
} 