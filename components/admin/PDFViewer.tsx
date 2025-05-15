"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface PDFViewerProps {
  filePath: string;
  fileName: string;
}

/**
 * Component for viewing PDFs with different rendering options
 */
const PDFViewer = ({ filePath, fileName }: PDFViewerProps) => {
  const [viewMethod, setViewMethod] = useState<'iframe' | 'object' | 'embed'>('iframe');
  
  // Ensure the file path starts with a forward slash
  const fullPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  
  // Create download URL
  const downloadUrl = fullPath;
  const downloadFilename = fileName || 'document.pdf';

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{fileName}</h3>
        
        <div className="flex items-center gap-4">
          <Select
            value={viewMethod}
            onValueChange={(value) => setViewMethod(value as 'iframe' | 'object' | 'embed')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iframe">IFrame</SelectItem>
              <SelectItem value="object">Object</SelectItem>
              <SelectItem value="embed">Embed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button asChild>
            <a 
              href={downloadUrl} 
              download={downloadFilename}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </Button>
        </div>
      </div>
      
      <div className="w-full h-[70vh] border rounded-md overflow-hidden bg-gray-50">
        {viewMethod === 'iframe' && (
          <iframe 
            src={fullPath} 
            className="w-full h-full"
            title={fileName}
          />
        )}
        
        {viewMethod === 'object' && (
          <object 
            data={fullPath} 
            type="application/pdf" 
            className="w-full h-full"
          >
            <p>Your browser does not support PDF viewing. Please <a href={downloadUrl}>download the PDF</a> to view it.</p>
          </object>
        )}
        
        {viewMethod === 'embed' && (
          <embed 
            src={fullPath} 
            type="application/pdf" 
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer; 