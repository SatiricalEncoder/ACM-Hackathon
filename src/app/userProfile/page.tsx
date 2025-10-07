"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

// Example badges (replace with your actual badge data)
const badges = [
  { id: 1, color: "bg-red-500", tooltip: "First badge" },
  { id: 2, color: "bg-blue-500", tooltip: "Second badge" },
  { id: 3, color: "bg-green-500", tooltip: "Third badge" },
];

// Simple Card component
const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {children}
  </div>
);

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState<number>(0);

  useEffect(() => {
    const fetchUserAndXp = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return (window.location.href = "/login");
      setUser(currentUser);

      // fetch XP for this user
      const { data: xpData, error } = await supabase
        .from("xp_history")
        .select("xp_change")
        .eq("user_id", currentUser.user_id);

      if (!error && xpData) {
        const totalXp = xpData.reduce(
          (sum: number, item: any) => sum + item.xp_change,
          0,
        );
        setXp(totalXp);
      }
    };

    fetchUserAndXp();

    const handler = () => fetchUserAndXp();
    window.addEventListener("xpUpdated", handler);
    return () => window.removeEventListener("xpUpdated", handler);
  }, []);

  if (!user) return null; // wait for user

  // Simple level calculation example: 100 XP per level
  const level = Math.floor(xp / 100) + 1;
  const progress = Math.min(xp % 100, 100);

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
          <a href="/contactUs" className="hover:underline">
            Contact Us
          </a>
          <button onClick={logout} className="text-blue-600">
            Logout
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8 sm:py-12 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">
          Welcome, {user.username}!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <Card title="Profile">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-500 rounded-lg flex-shrink-0 shadow-inner"></div>
                <div className="flex flex-col space-y-2 text-gray-700 w-full">
                  <p className="text-lg font-medium">
                    Lvl. {level}
                    <span className="text-sm ml-2 text-gray-500">
                      ({progress}% to next)
                    </span>
                  </p>

                  <div className="w-full bg-gray-300 rounded-full h-2.5">
                    <div
                      className="bg-blue-800 h-2.5 rounded-full shadow-md"
                      style={{ width: `${progress}%` }}
                      title={`${progress}% progress`}
                    ></div>
                  </div>

                  <p className="mt-4">
                    <span className="font-medium">Total XP:</span> {xp}
                  </p>
                  <p>
                    <span className="font-medium">Join date:</span>{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Badges */}
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

          {/* Right Column */}
          <div className="lg:col-span-1">
            <Card title="LEADERBOARD">
              <p className="text-sm text-gray-600 mb-4">
                Top 5 Members this month:
              </p>
              <ul className="space-y-3">
                {/* You can replace this with dynamic leaderboard later */}
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

      <footer className="bg-primary text-white py-6 text-center">
        <p className="font-semibold tracking-wide mb-3">ACM UDST 2025</p>

        <div className="flex justify-center space-x-6">
          <a href="https://www.udst.edu.qa/academic/our-colleges/college-computing-and-information-technology">UDST Site</a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <i className="fab fa-instagram"></i>
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>

          <a
            href="mailto:acmudst@gmail.com"
            className="hover:text-gray-200 transition-colors"
          >
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}
