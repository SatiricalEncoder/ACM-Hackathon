"use client";

import React from "react";

// Define the type for the functional component
const HomePage: React.FC = () => {
  // --- MOCK DATA (Typed implicitly/explicitly by usage) ---
  const user = {
    username: "JaneDoe",
    level: 15,
    joinDate: "Jan 2024",
    rank: 7,
    progress: 75, // percentage
  };

  const badges = [
    { id: 1, color: "bg-blue-600", tooltip: "Data Structures Master" },
    { id: 2, color: "bg-green-600", tooltip: "Web Development Whiz" },
    { id: 3, color: "bg-yellow-600", tooltip: "HackerRank Challenger" },
    { id: 4, color: "bg-red-600", tooltip: "AI Enthusiast" },
  ];

  // --- REUSABLE COMPONENTS ---

  // Card component for grouping content with a rounded border and light background
  const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <div className="p-5 bg-blue-50/70 border border-blue-100 rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-blue-900 border-b border-blue-200 pb-2 uppercase tracking-wider">
        {title}
      </h2>
      {children}
    </div>
  );

  // --- MAIN COMPONENT RENDER ---

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <img
            src="/images/acm udst logo.svg"
            alt="ACM UDST Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
          />
          <h1 className="font-bold text-lg sm:text-xl">
            UDST'S ACM STUDENT CHAPTER
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            About Us
          </a>
          <a href="#" className="hover:underline">
            Events
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Login
          </button>
        </nav>
      </header>
      {/* Main content - Dashboard Layout */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8 sm:py-12 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">
          Welcome, {"{" + user.username + "}!"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile and Badges (Takes 2/3 space on desktop) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <Card title="Profile">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                {/* Profile Image Placeholder */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-500 rounded-lg flex-shrink-0 shadow-inner"></div>

                <div className="flex flex-col space-y-2 text-gray-700 w-full">
                  <p className="text-lg font-medium">
                    Lvl. {"{" + user.level + "}"}
                    <span className="text-sm ml-2 text-gray-500">
                      ({user.progress}% to next)
                    </span>
                  </p>

                  {/* Progress Bar (dark blue like the line in the image) */}
                  <div className="w-full bg-gray-300 rounded-full h-2.5">
                    <div
                      className="bg-blue-800 h-2.5 rounded-full shadow-md"
                      style={{ width: `${user.progress}%` }}
                      title={`${user.progress}% progress`}
                    ></div>
                  </div>

                  <p className="mt-4">
                    <span className="font-medium">Join date:</span>{" "}
                    {"{" + user.joinDate + "}"}
                  </p>
                  <p>
                    <span className="font-medium">Rank:</span>{" "}
                    {"{" + "#" + user.rank + "}"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Badges & Achievements Card */}
            <Card title="Badges & Achievements">
              <div className="flex flex-wrap gap-5">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`w-16 h-16 sm:w-20 sm:h-20 ${badge.color} rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform duration-200 cursor-help ring-4 ring-white`}
                    title={badge.tooltip}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM3.636 4.364a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H4.364a.75.75 0 01-.75-.75zm12.728 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM10 17a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 17zM4.364 16.364a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5a.75.75 0 01-.75.75zM16.364 16.364a.75.75 0 01-.75-1.5h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75zM10 14a4 4 0 100-8 4 4 0 000 8zm-2.75 0a.75.75 0 01-.75-.75V7.75a.75.75 0 011.5 0v5.5a.75.75 0 01-.75.75zM12.75 14a.75.75 0 01-.75-.75V7.75a.75.75 0 011.5 0v5.5a.75.75 0 01-.75.75z" />
                    </svg>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Leaderboard (Takes 1/3 space on desktop) */}
          <div className="lg:col-span-1">
            <Card title="LEADERBOARD">
              <p className="text-sm text-gray-600 mb-4">
                Top 5 Members this month:
              </p>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-blue-900 font-semibold bg-green-100 p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <span className="flex items-center">
                    <span className="text-lg mr-2">🥇</span> Alice
                  </span>
                  <span className="text-sm">1200 Pts</span>
                </li>
                <li className="flex justify-between items-center bg-blue-100 p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <span className="flex items-center">
                    <span className="text-lg mr-2">🥈</span> Bob
                  </span>
                  <span className="text-sm">950 Pts</span>
                </li>
                <li className="flex justify-between items-center bg-indigo-100 p-3 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                  <span className="flex items-center">
                    <span className="text-lg mr-2">🥉</span> Charlie
                  </span>
                  <span className="text-sm">820 Pts</span>
                </li>
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition">
                  <span className="flex items-center">
                    <span className="text-lg mr-2">4.</span> Dana
                  </span>
                  <span className="text-sm">710 Pts</span>
                </li>
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition">
                  <span className="flex items-center">
                    <span className="text-lg mr-2">5.</span> Eve
                  </span>
                  <span className="text-sm">650 Pts</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-4 text-center">
        UDST@2025
      </footer>
    </div>
  );
};

export default HomePage;
