'use client';

export default function InformationLiteracy() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Information Literacy Session</h1>

        <div className="prose max-w-none">
          <p className="mb-8">
            BRAC University Library offers a number of programs throughout the year to assist students, researchers and faculty members in developing research skills and to use the full range of information resources available at the library. Our objective is to promote user understanding and use of information in the discovery, creation and transmission of knowledge to enhance their academic experience and lifelong learning. Library is also creating subject specific Research Guides and Online Tutorials for the users on the library website.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Library Sessions and Workshops</h2>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-2">Face-to-face assistance</h3>
              <p>Available via Zoom or Google Meet on request, 9am-5pm Sunday- Thursday for All Discipline areas & Year Levels. This session will be available for individual users by appointment to assist them for fulfilling their needs.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-2">Online Drop-in Sessions</h3>
              <p>All Discipline areas Year Levels.</p>
              <p>Online drop-in sessions are open to all BRAC University students (undergraduate and postgraduate) and faculty from each discipline area. The librarian will assist students, faculty, researchers with finding resources for their assignment and research or information on how to reference, and to develop skills beyond the basics.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-2">Library Orientation Sessions</h3>
              <p>A quick overview of the library and its services, spaces and resources tailored for new students. Library can provide sessions for students online or onsite.</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Target Group: Freshers</li>
                <li>Average Session Length: 10-15 minutes</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-2">One-hour Library Sessions/Workshops</h3>
              <p>Overviews of discipline-specific collections and research practices, working in conjunction with faculty requests.</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Target Group: First Year to Final Year Students, Researchers, Faculty members</li>
                <li>Average Session Length: One-hour sessions, 15-minute Q/A</li>
              </ul>

              <h4 className="font-bold mt-4 mb-2">Contents covered:</h4>
              <ul className="list-disc pl-5">
                <li>Introduction to the library website</li>
                <li>Finding Books and Other Items in the Catalog</li>
                <li>Formulating Information Search Strategies</li>
                <li>Finding Articles with Databases</li>
                <li>Finding previous theses and other projects</li>
                <li>Advanced Search Techniques</li>
                <li>Internet Resources</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-2">Workshop on Subject Specific Research Database</h3>
              <p>Participants are introduced to subject databases, resources, and will learn basic to advance search strategies and techniques relevant to conducting research within a specific discipline or field of study. Each workshop is tailored to the specific objectives of the class and content reflects assignment requirements and research expectations.</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Target Group: First Year to Final Year Students, Researchers, Faculty members</li>
                <li>Average Session Length: One hour</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-2">Citation Management Workshop</h3>
              <ul className="list-disc pl-5">
                <li>Target Group: First Year to Final Year Students, Researchers, Faculty members</li>
                <li>Average Session Length: One hour</li>
              </ul>

              <h4 className="font-bold mt-4 mb-2">Citation:</h4>
              <ul className="list-disc pl-5">
                <li>Why Cite - Learn multiple purposes of citing sources, and why citation is so important to scholars.</li>
                <li>How to cite- Learn the basic information needed in any citation, and the main purposes and forms that most citations take.</li>
              </ul>

              <h4 className="font-bold mt-4 mb-2">Citation Management Tool –Mendeley and Zotero</h4>
              <p>This session will explain the benefits of using a citation management tool and introduce the basic functions of Mendeley and Zotero.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-2">Academic Integrity Workshop</h3>
              <ul className="list-disc pl-5">
                <li>Target Group: First Year to Final Year Students, Researchers, Faculty members</li>
                <li>Average Session Length: One hour</li>
              </ul>

              <p className="mt-4">The online workshop is for students starting or continuing their studies at BRAC University.</p>
              <p>In this workshop students will learn:</p>
              <ul className="list-disc pl-5">
                <li>What academic integrity means at BRAC University? BRAC University Academic Integrity Policy.</li>
                <li>Why it is important to present authentic work and acknowledge the work of others</li>
                <li>How to check similarity into Anti-Plagiarism Tool Turnitin and how to manage account.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}