"use client";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/fakeAuth";

type Badge = {
  id: number;
  color: string;
  tooltip: string;
};

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function UserProfile() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user) window.location.href = "/login";
    else setUsername(user);
  }, []);

  if (!username) return null;

  // 🧍 Mock user data
  const user = {
    username,
    level: 5,
    progress: 72,
    joinDate: "2024-03-15",
    rank: 12,
  };

  const badges: Badge[] = [
    { id: 1, color: "bg-yellow-500", tooltip: "Onboarding Badge" },
    { id: 2, color: "bg-blue-500", tooltip: "Workshop Attendee" },
    { id: 3, color: "bg-green-600", tooltip: "Top 10 Rank" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b shadow-sm">
        <div className="flex items-center space-x-4">
          <img
            src="/images/acm udst logo.svg"
            alt="ACM UDST Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
          />
          <h1 className="font-bold text-lg sm:text-xl">
            UDST'S ACM STUDENT CHAPTER
          </h1>
        </div>

        <nav className="flex items-center space-x-6">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/about" className="hover:underline">
            About Us
          </a>
          <a href="/events" className="hover:underline">
            Events
          </a>
          <a href="/contact" className="hover:underline">
            Contact Us
          </a>
          <button onClick={logout} className="text-blue-600">
            Logout
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8 sm:py-12 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">
          Welcome, {user.username}!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile + Badges */}
          <div className="lg:col-span-2 space-y-8">
            <Card title="Profile">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-500 rounded-lg flex-shrink-0 shadow-inner"></div>

                <div className="flex flex-col space-y-2 text-gray-700 w-full">
                  <p className="text-lg font-medium">
                    Lvl. {user.level}
                    <span className="text-sm ml-2 text-gray-500">
                      ({user.progress}% to next)
                    </span>
                  </p>

                  <div className="w-full bg-gray-300 rounded-full h-2.5">
                    <div
                      className="bg-blue-800 h-2.5 rounded-full shadow-md"
                      style={{ width: `${user.progress}%` }}
                    ></div>
                  </div>

                  <p className="mt-4">
                    <span className="font-medium">Join date:</span>{" "}
                    {user.joinDate}
                  </p>
                  <p>
                    <span className="font-medium">Rank:</span> #{user.rank}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Badges & Achievements">
              <div className="flex flex-wrap gap-5">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`w-16 h-16 sm:w-20 sm:h-20 ${badge.color} rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform duration-200 cursor-help ring-4 ring-white`}
                    title={badge.tooltip}
                  >
                    🏅
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Leaderboard */}
          <div className="lg:col-span-1">
            <Card title="LEADERBOARD">
              <p className="text-sm text-gray-600 mb-4">
                Top 5 Members this month:
              </p>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-blue-900 font-semibold bg-green-100 p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <span>🥇 Alice</span>
                  <span>1200 Pts</span>
                </li>
                <li className="flex justify-between items-center bg-blue-100 p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <span>🥈 Bob</span>
                  <span>950 Pts</span>
                </li>
                <li className="flex justify-between items-center bg-indigo-100 p-3 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                  <span>🥉 Charlie</span>
                  <span>820 Pts</span>
                </li>
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition">
                  <span>4. Dana</span>
                  <span>710 Pts</span>
                </li>
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition">
                  <span>5. Eve</span>
                  <span>650 Pts</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-4 text-center">
        UDST © 2025
      </footer>
    </div>
  );
}
