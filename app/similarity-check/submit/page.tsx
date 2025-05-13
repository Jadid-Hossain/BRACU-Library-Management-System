'use client';

import { useState } from 'react';
import sql from '@/lib/neon-db';

export default function SubmitCheck() {
  const [selectedService, setSelectedService] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const services = [
    'Plagiarism Check',
    'Paraphrasing Service',
    'Citation Fixing',
    'Similarity Reduction Suggestions',
    'Turnitin Report Upload',
    'Plagiarism Clearance Certificate'
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
      // Store submission details in database
      await sql`
        INSERT INTO similarity_submissions (
          service,
          file_name,
          status
        ) VALUES (
          ${selectedService},
          ${file.name},
          'pending'
        )
      `;

      alert('Submission successful!');
      setSelectedService('');
      setFile(null);
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error submitting. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Submit Document for Check</h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">Available Services:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Plagiarism Check – Scan the uploaded document and provide a detailed report.</li>
            <li>Paraphrasing Service – Help rewrite plagiarized or poorly written content.</li>
            <li>Citation Fixing – Check for proper citations (APA, MLA, IEEE, etc.) and fix them if needed.</li>
            <li>Similarity Reduction Suggestions – Suggest specific changes to lower plagiarism scores.</li>
            <li>Turnitin Report Upload – Let users attach existing reports for analysis.</li>
            <li>Plagiarism Clearance Certificate – Provide a certificate of originality for submission.</li>
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