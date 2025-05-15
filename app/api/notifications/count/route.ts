import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/database/drizzle';
import { notifications } from '@/lib/db/schema';
import { and, eq, count } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify the authenticated user matches the requested userId
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      );

    return NextResponse.json({
      count: result[0]?.count || 0,
    });
  } catch (error) {
    console.error('Failed to fetch notification count:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 