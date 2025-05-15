'use client';

import Link from 'next/link';

const LibraryFacilities = () => {
  const facilities = [
    {
      title: 'DIGITAL SCHOLARSHIP LAB',
      features: [
        'Media Lab',
        ['Podcast Station', 'Video Production Studio'],
        'Consultation, Training & Workshop',
        'Research & Publishing Support',
        'Library Systems Development & Support',
        'Service Point'
      ],
      image: '/digital-lab.png'
    },
    {
      title: 'SPACE',
      features: [
        'Group Discussion Room',
        'Individual Study Pod',
        'Silent Study Zone',
        'Learning Stair',
        'Carrels for personal study',
        'Coffee Corner'
      ],
      image: '/study-space.png'
    }
  ];

  return (
    <>
      <div className="w-full h-64 bg-cover bg-center" style={{ backgroundImage: 'url("/library-timing.png")' }} />
      
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Library Facilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((facility) => (
              <div key={facility.title} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${facility.image})` }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">{facility.title}</h3>
                  <ul className="space-y-3">
                    {facility.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {Array.isArray(feature) ? (
                          <ul className="ml-6 space-y-2">
                            {feature.map((subFeature, subIndex) => (
                              <li key={subIndex} className="flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                                {subFeature}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <>
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                            {feature}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href={facility.title === 'SPACE' ? '/facility-booking/details' : '#'} 
                    className="inline-block mt-4 text-blue-500 hover:text-blue-700"
                  >
                    details &gt;&gt;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default LibraryFacilities; 