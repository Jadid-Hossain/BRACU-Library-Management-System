import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon-db';
import { auth } from "@/auth";

// This route handles fetching all research help requests for the admin panel
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin access
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // In a real application, you'd check if the user has admin rights
    // For example: if (session.user.role !== 'admin') { ... }
    
    // Fetch all research help requests from the database
    const requests = await sql`
      SELECT id, service, file_name, file_path, email, status, created_at
      FROM research_help_requests
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching research help requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research help requests' },
      { status: 500 }
    );
  }
} 