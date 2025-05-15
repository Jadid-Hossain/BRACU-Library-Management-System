import { NextResponse } from 'next/server';
import sql from '@/lib/neon-db';
import { NeonQueryFunction } from '@neondatabase/serverless';
import { auth } from '@/auth';

// TypeScript type assertion
const neonSql = sql as NeonQueryFunction<any, any>;

interface UpdateResult {
  id: number;
}

// PATCH: Update a contact message status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the message ID from the URL parameters
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid message ID' },
        { status: 400 }
      );
    }

    // Parse the request body to get the new status
    const { status } = await request.json();
    if (!status || (status !== 'new' && status !== 'read')) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "new" or "read"' },
        { status: 400 }
      );
    }

    // Update the message status in the database
    const result = await neonSql<UpdateResult[]>`
      UPDATE contact_messages
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id
    `;

    // Check if the message was found and updated
    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Message status updated successfully',
      id: result[0].id
    });
  } catch (error: any) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update message status' },
      { status: 500 }
    );
  }
} 