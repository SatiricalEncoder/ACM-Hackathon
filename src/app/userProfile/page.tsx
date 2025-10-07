"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

// Example badges (replace image paths with your own)
const badges = [
  { id: 1, image: "/images/Login.png", tooltip: "First Login" },
  { id: 2, image: "/images/width_800.png", tooltip: "Event Participant" },
  { id: 3, image: "/images/hello.png", tooltip: "Posting x Amount" },
  { id: 4, image: "/images/lamp.png", tooltip: "ACM Member" },
  { id: 5, image: "/images/people.png", tooltip: "ACM Member" },
  { id: 6, image: "/images/person.png", tooltip: "ACM Member" },
];

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
    <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
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

  if (!user) return null;

  const level = Math.floor(xp / 100) + 1;
  const progress = Math.min(xp % 100, 100);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b shadow-sm bg-white sticky top-0 z-10">
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
          <button onClick={logout} className="text-blue-600 font-semibold">
            Logout
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-10 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">
          Welcome, {user.username}!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="lg:col-span-2 space-y-8">
            <Card title="Profile">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-300 rounded-xl shadow-inner"></div>

                <div className="flex flex-col space-y-3 text-gray-700 w-full">
                  <p className="text-lg font-medium">
                    Lvl. {level}
                    <span className="text-sm ml-2 text-gray-500">
                      ({progress}% to next)
                    </span>
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-700 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <p className="mt-3">
                    <span className="font-semibold">Total XP:</span> {xp}
                  </p>
                  <p>
                    <span className="font-semibold">Join date:</span>{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Badges */}
            <Card title="Badges & Achievements">
              <div className="flex flex-wrap gap-6">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    title={badge.tooltip}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-gray-200 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <img
                      src={badge.image}
                      alt={badge.tooltip}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Card title="Leaderboard">
              <p className="text-sm text-gray-600 mb-4">
                Top 5 Members this month:
              </p>
              <ul className="space-y-3">
                <li className="flex justify-between items-center bg-green-100 p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <span>🥇 Alice</span>
                  <span className="text-sm">1200 XP</span>
                </li>
                <li className="flex justify-between items-center bg-blue-100 p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <span>🥈 Bob</span>
                  <span className="text-sm">950 XP</span>
                </li>
                <li className="flex justify-between items-center bg-indigo-100 p-3 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                  <span>🥉 Charlie</span>
                  <span className="text-sm">820 XP</span>
                </li>
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition">
                  <span>4. Dana</span>
                  <span className="text-sm">710 XP</span>
                </li>
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition">
                  <span>5. Eve</span>
                  <span className="text-sm">650 XP</span>
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
