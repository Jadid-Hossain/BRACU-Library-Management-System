'use client';

import { useState } from 'react';
import sql from '@/lib/neon-db';

export default function ResearchHelp() {
  const [selectedService, setSelectedService] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const services = [
    'Topic Selection Help',
    'Literature Review Writing',
    'Thesis Proofreading',
    'Formatting Services',
    'Chapter-by-Chapter Feedback',
    'Reference Management Help'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      if (!selectedFile.type.includes('pdf')) {
        alert('Only PDF files are allowed');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !file) {
      alert('Please select a service and upload a file');
      return;
    }

    try {
      // Store file path and submission details in database
      await sql`
        INSERT INTO research_help_requests (
          service,
          file_name,
          status
        ) VALUES (
          ${selectedService},
          ${file.name},
          'pending'
        )
      `;

      alert('Request submitted successfully!');
      setSelectedService('');
      setFile(null);
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error submitting request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Research & Thesis Writing Support</h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">Available Services:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Topic Selection Help – Suggest unique and relevant research topics based on user's field.</li>
            <li>Literature Review Writing – Assist in writing or improving literature review sections.</li>
            <li>Thesis Proofreading – Check for grammar, coherence, and clarity.</li>
            <li>Formatting Services – Format the thesis according to university/research standards.</li>
            <li>Chapter-by-Chapter Feedback – Allow users to get feedback on individual chapters.</li>
            <li>Reference Management Help – Help with using tools like Zotero, Mendeley, or EndNote.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose a service</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (PDF only, max 10MB)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}