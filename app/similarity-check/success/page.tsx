"use client";

import Link from 'next/link';

export default function SimilarityCheckSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <div className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Similarity Check</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold mb-4">Submission Successful!</h2>
        
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <p className="text-lg mb-4">
            Thank you for submitting your document for a similarity check. Our team will review your submission and provide the similarity report soon.
          </p>
          <p>
            You will receive the similarity report at your provided email address within 24 hours.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">What's Next?</h3>
          <p className="text-gray-700 mb-4">
            Once your document has been processed:
          </p>
          <ul className="text-left list-disc pl-8 mb-6 inline-block">
            <li className="mb-2">You'll receive an email with your similarity report.</li>
            <li className="mb-2">The report will highlight any matching content with existing sources.</li>
            <li className="mb-2">If needed, you can request additional checks (up to 2-3 times per paper).</li>
          </ul>
        </div>

        <div>
          <Link href="/similarity-check">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Return to Similarity Check
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 