"use client";

import Link from 'next/link';

export default function ResearchHelpSuccessPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Submission Successful!</h1>
        </div>

        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <p className="text-lg mb-4">
            Thank you for submitting your research help request. Our team will review your submission and respond to you via email soon.
          </p>
          <p className="mb-4">
            You'll receive a confirmation email with your request details shortly.
          </p>
          <p>
            If you have any questions, please contact our library research team at library.research@bracu.ac.bd.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">What's Next?</h3>
          <p className="text-gray-700 mb-4">
            Here's what you can expect:
          </p>
          <ol className="text-left list-decimal pl-8 mb-6 inline-block">
            <li className="mb-2">Our librarians will review your request within 1 business day.</li>
            <li className="mb-2">You'll receive personalized research assistance via email.</li>
            <li className="mb-2">For complex requests, we may reach out to schedule a consultation.</li>
            <li className="mb-2">You can expect a response within 2-3 business days.</li>
          </ol>
        </div>

        <div>
          <Link href="/research-help">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Return to Research Help
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 