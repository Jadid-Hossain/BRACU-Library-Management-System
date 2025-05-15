import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Base upload directory 
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directories exist
export function ensureDirectories() {
  const directories = [
    path.join(UPLOAD_DIR, 'similarity-checks'),
    path.join(UPLOAD_DIR, 'research-help')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

/**
 * Saves a file to the local filesystem
 * @param fileBuffer The file buffer to save
 * @param originalFilename The original filename
 * @param folder The subfolder to save to (e.g., 'similarity-checks' or 'research-help')
 * @returns Object with file path and ID
 */
export async function saveFileLocally(
  fileBuffer: Buffer, 
  originalFilename: string,
  folder: string
): Promise<{ filePath: string; fileName: string; fileId: string }> {
  ensureDirectories();
  
  const fileId = randomUUID();
  const fileExtension = path.extname(originalFilename);
  const sanitizedName = originalFilename
    .replace(fileExtension, '') // Remove extension
    .replace(/[^a-zA-Z0-9]/g, '_') // Replace non-alphanumeric with underscores
    .substring(0, 50); // Limit length
  
  const fileName = `${Date.now()}-${fileId}${fileExtension}`;
  const uploadPath = path.join(UPLOAD_DIR, folder, fileName);
  const publicPath = `/uploads/${folder}/${fileName}`;
  
  console.log(`Saving file to: ${uploadPath}`);
  
  try {
    // Write file to disk
    await fs.promises.writeFile(uploadPath, fileBuffer);
    
    console.log(`File saved successfully: ${fileName}`);
    
    return {
      filePath: publicPath,
      fileName: originalFilename,
      fileId: fileId
    };
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file to disk');
  }
}

/**
 * Delete a file from the local filesystem
 * @param filePath The path to the file (from the public directory)
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      console.log(`File deleted: ${fullPath}`);
      return true;
    } else {
      console.log(`File not found: ${fullPath}`);
      return false;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
} 