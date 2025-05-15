import { NextRequest, NextResponse } from 'next/server';
import { saveFileLocally } from '@/lib/file-storage';
import sql from '@/lib/neon-db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const service = formData.get('service') as string;
    const type = formData.get('type') as string; // 'similarity' or 'research'
    const email = formData.get('email') as string;
    const topic = formData.get('topic') as string; // Only for research help
    
    console.log('Received upload request:', { service, type, fileName: file?.name, email });
    
    if (!service || !type || !email) {
      console.error('Missing required fields:', { service, type, email });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let filePath = null;
    let fileName = null;
    let fileId = null;

    // If file is provided, save it to the local storage
    if (file) {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      console.log('File converted to buffer, uploading to local storage...');
      
      // Determine the folder based on the type
      const folder = type === 'similarity' ? 'similarity-checks' : 'research-help';
      
      // Save file to local storage (public/uploads/folder)
      const fileInfo = await saveFileLocally(buffer, file.name, folder);
      
      filePath = fileInfo.filePath;
      fileName = fileInfo.fileName;
      fileId = fileInfo.fileId;
      
      console.log('File saved to:', filePath);
    }

    // Save submission to database - we'll check the table structure first
    try {
      if (type === 'similarity') {
        // First, let's check if the table has the required columns
        const tableInfo = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'similarity_submissions'
        `;
        
        const columns = tableInfo.map(col => col.column_name);
        console.log('Similarity submissions table columns:', columns);
        
        const hasFilePath = columns.includes('file_path');
        
        if (hasFilePath) {
          const result = await sql`
            INSERT INTO similarity_submissions (service, file_name, file_path, email, status)
            VALUES (${service}, ${fileName || file.name}, ${filePath}, ${email}, 'pending')
            RETURNING id
          `;
          console.log('Similarity submission saved to database with ID:', result[0]?.id);
        } else {
          const result = await sql`
            INSERT INTO similarity_submissions (service, file_name, email, status)
            VALUES (${service}, ${fileName || file.name}, ${email}, 'pending')
            RETURNING id
          `;
          console.log('Similarity submission saved to database with ID (without file_path):', result[0]?.id);
        }
      } else if (type === 'research') {
        // First, let's check if the table has the required columns
        const tableInfo = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'research_help_requests'
        `;
        
        const columns = tableInfo.map(col => col.column_name);
        console.log('Research help requests table columns:', columns);
        
        const hasFilePath = columns.includes('file_path');
        const hasTopic = columns.includes('topic');
        
        if (hasFilePath && hasTopic) {
          const result = await sql`
            INSERT INTO research_help_requests (service, file_name, file_path, email, status, topic)
            VALUES (${service}, ${fileName || file?.name || null}, ${filePath}, ${email}, 'pending', ${topic || null})
            RETURNING id
          `;
          console.log('Research help request saved to database with ID:', result[0]?.id);
        } else if (hasFilePath) {
          const result = await sql`
            INSERT INTO research_help_requests (service, file_name, file_path, email, status)
            VALUES (${service}, ${fileName || file?.name || null}, ${filePath}, ${email}, 'pending')
            RETURNING id
          `;
          console.log('Research help request saved to database with ID (without topic):', result[0]?.id);
        } else if (hasTopic) {
          const result = await sql`
            INSERT INTO research_help_requests (service, file_name, email, status, topic)
            VALUES (${service}, ${fileName || file?.name || null}, ${email}, 'pending', ${topic || null})
            RETURNING id
          `;
          console.log('Research help request saved to database with ID (without file_path):', result[0]?.id);
        } else {
          const result = await sql`
            INSERT INTO research_help_requests (service, file_name, email, status)
            VALUES (${service}, ${fileName || file?.name || null}, ${email}, 'pending')
            RETURNING id
          `;
          console.log('Research help request saved to database with ID (minimal):', result[0]?.id);
        }
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if database insert fails
      // We'll still return success since the file was saved
    }

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully',
      filePath,
      fileName: fileName || file?.name
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
} 