import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseSetup } from '@/lib/db-setup';
import { ensureDirectories } from '@/lib/file-storage';

export async function GET(request: NextRequest) {
  try {
    // Ensure storage directories exist
    ensureDirectories();
    
    // Check and initialize database
    const dbResult = await checkDatabaseSetup();
    
    return NextResponse.json({
      success: true,
      message: 'Initialization completed',
      databaseInitialized: dbResult
    });
  } catch (error: any) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Initialization failed'
      },
      { status: 500 }
    );
  }
}