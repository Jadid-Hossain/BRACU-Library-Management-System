'use client';

export default function Membership() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Library Membership Activation</h1>

        <div className="prose max-w-none">
          <p className="mb-8">
            All students, faculty, and staff of Brac University are automatically members of the library. 
            Borrowers must complete a Google form to activate their library account.
          </p>

          <div className="flex gap-4 mb-8">
            <a 
              href="/membership/signup" 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Student Account
            </a>
            <a 
              href="https://forms.google.com/dummy-form" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Faculty & Staff Membership Form
            </a>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="font-bold mb-2">Note:</h3>
            <p>BracU Provided G-Suite Email is required to fill up this form. Please contact with BracU IT Systems if you still haven't received your G-Suite Email.</p>
            <p className="mt-2">You don't need a physical card for library membership. Your student ID card or employee ID card will serve as your library membership card.</p>
          </div>
        </div>
      </div>
    </div>
  );
}