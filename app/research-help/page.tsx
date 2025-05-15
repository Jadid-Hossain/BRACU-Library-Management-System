'use client';

import Link from 'next/link';

export default function ResearchHelp() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Research & Thesis Writing Support</h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">Our Services:</h2>
          <ul className="list-disc pl-5 space-y-4">
            <li>
              <strong>Topic Selection Help</strong> – Our experts suggest unique and relevant research topics based on your field of study, ensuring your research stands out.
            </li>
            <li>
              <strong>Literature Review Writing</strong> – Get professional assistance in writing or improving literature review sections, ensuring comprehensive coverage of relevant sources.
            </li>
            <li>
              <strong>Thesis Proofreading</strong> – Our team checks your thesis for grammar, coherence, and clarity, ensuring a polished final document.
            </li>
            <li>
              <strong>Formatting Services</strong> – We format your thesis according to BRACU or other academic standards, ensuring compliance with required guidelines.
            </li>
            <li>
              <strong>Chapter-by-Chapter Feedback</strong> – Submit individual chapters to receive targeted feedback and suggestions for improvement.
            </li>
            <li>
              <strong>Reference Management Help</strong> – Get assistance with using tools like Zotero, Mendeley, or EndNote to manage your citations effectively.
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">How It Works:</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>Fill out our request form specifying which service you need</li>
            <li>Upload any relevant files or documents (optional)</li>
            <li>Receive a confirmation email with your request details</li>
            <li>Our team will review your request and contact you with next steps</li>
            <li>Receive personalized assistance from our library experts</li>
          </ol>
        </div>

        <div className="text-center mb-8">
          <Link href="/research-help/submit">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Submit Your Request
            </button>
          </Link>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Contact Information:</h2>
          <p className="mb-2">For any questions regarding our research help services, please contact:</p>
          <p className="mb-1"><strong>Email:</strong> library.research@bracu.ac.bd</p>
          <p><strong>Phone:</strong> +880 2-222264051-4</p>
        </div>
      </div>
    </div>
  );
}