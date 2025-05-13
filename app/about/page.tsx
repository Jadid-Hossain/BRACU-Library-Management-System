'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Ayesha Abed Library</h1>

        <div className="prose max-w-none">
          <p className="mb-8">
            The Ayesha Abed Library at BRAC University aims to become a world-class Knowledge Resource Centre and provide innovative new services and a wider collection of books and resources to the teaching, learning and research communities, using the latest technological developments of the 21st century. The development, organization and maintenance of archives in multiple locations; access to world-class resources; personalized assistance in the use of library and information resources; and instruction on research strategies and tools have made this one of the richest libraries in the country.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Mission</h2>
            <p>
              The Library's mission is to provide comprehensive resources and services in support of the research, teaching, and learning needs of the University community.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Vision</h2>
            <p>
              Develop a world-class Knowledge Resource Centre and provide innovative new services and collections to the teaching, learning and research communities, using latest technological developments of 21st century.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}