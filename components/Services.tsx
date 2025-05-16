"use client";

import Link from "next/link";
import { Book, User, HelpCircle, GraduationCap, Search } from "lucide-react";

const Services = () => {
  const topServices = [
    {
      icon: Book,
      title: "Borrow, Renew & Return Library Items",
      description: "Learn how to use your library materials",
      links: [
        { text: "Library", url: "/library" },
        { text: "Tutorial", url: "/borrowing" },
      ],
    },
    {
      icon: User,
      title: "My Account",
      description:
        "Log in to your account for placing holds, checking and renewing loans.",
      links: [
        { text: "Login", url: "/sign-in" },
        { text: "Register", url: "/sign-up" },
      ],
    },
  ];

  const bottomServices = [
    {
      icon: HelpCircle,
      title: "Research Help",
      description:
        "We're here to answer your questions and help connect you to the resources you need to get your work done.",
      link: "/research-help",
    },
    {
      icon: GraduationCap,
      title: "Information Literacy Session",
      description:
        "The main purpose is to acquaint individuals with the resources and techniques to retrieve the resources.",
      link: "/information-literacy",
    },
    {
      icon: Search,
      title: "Similarity Check",
      description:
        "Identify unoriginal content with the plagiarism detection tool",
      link: "/similarity-check",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">
          Using the Library
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Use our tools and services to improve your library experience and save
          time
        </p>

        {/* Top Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {topServices.map((service) => (
            <div
              key={service.title}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <service.icon className="w-12 h-12 text-[var(--primary-color)] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-center text-gray-600 mb-4">
                {service.description}
              </p>
              <div className="flex gap-4">
                {service.links.map((link) => (
                  <Link
                    key={link.text}
                    href={link.url}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bottomServices.map((service) => (
            <Link key={service.title} href={service.link}>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <service.icon className="w-12 h-12 text-[var(--primary-color)] mb-4" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-center text-gray-600">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
