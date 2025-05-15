import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/neon-db';
import { auth } from "@/auth";

// This route handles updating a similarity submission status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin access
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the ID from params
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }
    
    // Get the new status from the request body
    const { status } = await request.json();
    if (!status || !['pending', 'completed', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update the submission status in the database
    const result = await sql`
      UPDATE similarity_submissions
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id, status
    `;
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating similarity submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
} 