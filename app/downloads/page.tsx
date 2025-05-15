'use client';

export default function Downloads() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Downloads</h1>

        <div className="space-y-4">
          <a
            href="https://library.bracu.ac.bd/sites/default/files/2025-02/Ayesha_Abed_Library_Handout_Spring-25.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Ayesha Abed Library Handout
          </a>

          <a
            href="https://library.bracu.ac.bd/sites/default/files/2024-12/cctv-request-form-1_0.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Book Requisition Form
          </a>

          <a
            href="https://library.bracu.ac.bd/sites/default/files/2024-12/cctv-request-form-1_0.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Part Time Faculty Membership Form
          </a>

          <a
            href="https://library.bracu.ac.bd/sites/default/files/2024-12/cctv-request-form-1_0.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Request Form for CCTV Recordings
          </a>
        </div>
      </div>
    </div>
  );
}