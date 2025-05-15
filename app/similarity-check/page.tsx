'use client';

import Link from 'next/link';

export default function SimilarityCheck() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <div className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Similarity Check</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">Access to Turnitin:</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Faculty Members</h3>
                <p>
                  Faculty members are entitled to get access to Turnitin on request. For Instructor account please mail at{' '}
                  <a href="mailto:librarian@bracu.ac.bd" className="text-blue-600 hover:text-blue-800">
                    librarian@bracu.ac.bd
                  </a>
                  .
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Students</h3>
                <p>
                  As we are subscribing to a limited number of student accounts, therefore we are only providing student accounts on a course basis. 
                  Students can check the similarity index of their writings through course instructor, thesis/internship supervisor or library.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Report/Write-up Submission Process:</h2>
            <p className="mb-4">
              You are requested to submit your report{' '}
              <Link href="/similarity-check/submit" className="text-blue-600 hover:text-blue-800 underline">
                Here
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Document Format:</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Document should be in PDF or Doc format.</li>
              <li>You are requested to send a complete document (final draft) for similarity checking.</li>
              <li>
                For better result please attach your report excluding the following parts:
                <ul className="list-disc pl-5 mt-2">
                  <li>Declaration</li>
                  <li>List of Tables</li>
                  <li>Approval</li>
                  <li>List of Figures</li>
                  <li>Ethics Statement</li>
                  <li>List of Acronyms</li>
                  <li>Dedication</li>
                  <li>Reference</li>
                  <li>Acknowledgement</li>
                  <li>Cover</li>
                  <li>Table of Contents</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Special Instructions for Students:</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Library staff will provide a similarity index report up to 2-3 times for each paper.</li>
              <li>Papers with less than 10 percent similarity index will not be rechecked.</li>
              <li>For group work, please send a request from only one member.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Similarity Report Delivery:</h2>
            <p>We will send the similarity report within 24hours.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Working Hours:</h2>
            <p>Sunday -Thursday: 9.00AM – 5.00PM</p>
            <p>(Except public holidays)</p>
          </section>
        </div>
      </div>
    </div>
  );
}