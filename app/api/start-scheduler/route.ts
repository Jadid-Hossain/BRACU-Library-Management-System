import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { startScheduledJobs, runJobsManually } from '@/lib/tasks/scheduler';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is admin
    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!userRecord || userRecord.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Start scheduled jobs
    startScheduledJobs();
    
    return NextResponse.json({ success: true, message: 'Scheduler started' });
  } catch (error) {
    console.error('Error starting scheduler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is admin
    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!userRecord || userRecord.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Run jobs manually
    const result = await runJobsManually();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Jobs run manually',
      result
    });
  } catch (error) {
    console.error('Error running jobs manually:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 