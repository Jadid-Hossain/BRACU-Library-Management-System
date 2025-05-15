"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function SimilarityCheckSubmitPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const services = [
    'Plagiarism Check',
    'Paraphrasing Service',
    'Citation Fixing',
    'Similarity Reduction Suggestions',
    'Turnitin Report Upload',
    'Plagiarism Clearance Certificate'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check if file is PDF
      if (selectedFile.type !== "application/pdf" && selectedFile.type !== "application/msword" && 
          selectedFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setError("Please upload a PDF or DOC file");
        return;
      }
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please provide your email address");
      return;
    }

    if (!selectedService) {
      setError("Please select a service");
      return;
    }

    if (!file) {
      setError("Please upload a document for check");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);
      formData.append("service", selectedService);
      formData.append("type", "similarity");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/similarity-check/success");
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/similarity-check" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Similarity Check
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8">Submit Document for Check</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Your document has been successfully submitted! Redirecting...
          </div>
        ) : (
          <>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  We'll send the check results to this email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File (PDF or DOC, max 10MB)
                </label>
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 