import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import sql from '@/lib/neon-db';
import { NeonQueryFunction } from '@neondatabase/serverless';
import { auth } from '@/auth';

// TypeScript type assertion
const neonSql = sql as NeonQueryFunction<any, any>;

interface InsertResult {
  id: number;
}

export async function POST(req: NextRequest) {
  try {
    const { subject, description, fileUrl, fileName } = await req.json();
    
    // Validate required fields
    if (!subject || !description) {
      return NextResponse.json(
        { error: 'Subject and description are required' },
        { status: 400 }
      );
    }
    
    // Get user session if available (optional)
    let userId = null;
    let userName = null;
    let email = null;
    
    try {
      const session = await getServerSession();
      if (session?.user) {
        userId = session.user.id;
        userName = session.user.name;
        email = session.user.email;
      }
    } catch (error) {
      console.error('Error getting session:', error);
      // Continue without user data
    }
    
    // Insert into database
    const result = await sql`
      INSERT INTO research_queries (
        user_id,
        user_name,
        email,
        subject,
        description,
        file_url,
        file_name,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        ${userName},
        ${email},
        ${subject},
        ${description},
        ${fileUrl || null},
        ${fileName || null},
        ${'pending'},
        NOW(),
        NOW()
      ) RETURNING id
    `;
    
    return NextResponse.json({ success: true, id: result[0].id });
    
  } catch (error: any) {
    console.error('Error submitting research query:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit research query' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const researchQueries = await sql`
      SELECT * FROM research_queries 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(researchQueries);
  } catch (error: any) {
    console.error('Error fetching research queries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch research queries' },
      { status: 500 }
    );
  }
} 