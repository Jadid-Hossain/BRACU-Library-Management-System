import { NextResponse } from 'next/server';
import { startScheduledJobs } from '@/lib/tasks/scheduler';

// Flag to track if we've already initialized
let isInitialized = false;

export async function GET() {
  try {
    if (!isInitialized) {
      console.log('Initializing notification scheduler...');
      
      try {
        // Start the scheduled jobs with error handling
        startScheduledJobs();
        
        isInitialized = true;
        return NextResponse.json({ success: true, message: 'Notification scheduler initialized' });
      } catch (err) {
        console.error('Failed to start notification jobs:', err);
        return NextResponse.json(
          { success: false, message: 'Failed to initialize notification scheduler' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({ success: true, message: 'Notification scheduler already running' });
  } catch (error) {
    console.error('Error in init endpoint:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error in init endpoint' },
      { status: 500 }
    );
  }
} 