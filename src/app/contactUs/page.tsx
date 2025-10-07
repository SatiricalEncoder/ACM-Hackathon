"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

export default function contactPage() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  // Fetch events with participants
  const fetchEvents = async () => {
    if (!user) return;

    const { data: eventsData, error } = await supabase
      .from("event")
      .select(
        `
        *,
        event_participants (
          user_id
        )
      `,
      )
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }

    const mapped = (eventsData || []).map((ev: any) => ({
      ...ev,
      joined: ev.event_participants?.some(
        (p: any) => p.user_id === user.user_id,
      ),
    }));

    setEvents(mapped);
  };

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser();
      setUser(u);
    };
    fetchUser();
  }, []);

  // Fetch events once user is set
  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  // Join event
  const handleJoin = async (event_id: number) => {
    if (!user) return alert("Login to join events.");

    const { data: existing } = await supabase
      .from("event_participants")
      .select("*")
      .eq("event_id", event_id)
      .eq("user_id", user.user_id);

    if (existing?.length) return;

    const { error } = await supabase.from("event_participants").insert([
      {
        event_id,
        user_id: user.user_id,
        user_email: user.email,
        role: "participant",
      },
    ]);

    if (error) return alert("Error joining event: " + error.message);

    // Give XP
    await supabase.from("xp_history").insert([
      {
        user_id: user.user_id,
        xp_change: 50,
        reason: `Joined event ${event_id}`,
        time_give: new Date().toISOString(),
      },
    ]);

    fetchEvents();
  };

  // Leave event
  const handleLeave = async (event_id: number) => {
    if (!user) return;

    const { error } = await supabase
      .from("event_participants")
      .delete()
      .eq("event_id", event_id)
      .eq("user_id", user.user_id);

    if (error) return alert("Error leaving event: " + error.message);

    fetchEvents();
  };

  // Create new event
  const handleCreateEvent = async () => {
    if (!newTitle) return alert("Event title required");

    if (!user) return alert("Login required to create event");

    const { data, error } = await supabase.from("event").insert([
      {
        title: newTitle,
        event_date: newDate ? new Date(newDate).toISOString() : null,
        created_by: user.email,
      },
    ]);

    if (error) return alert("Error creating event: " + error.message);

    // Give XP
    await supabase.from("xp_history").insert([
      {
        user_id: user.user_id,
        xp_change: 100,
        reason: `Created event ${newTitle}`,
        time_give: new Date().toISOString(),
      },
    ]);

    setNewTitle("");
    setNewDate("");
    setShowForm(false);
    fetchEvents();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
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
          {user ? (
            <>
              <a href="/userProfile" className="hover:underline">
                Profile
              </a>
              <button onClick={logout} className="text-blue-600">
                Logout
              </button>
            </>
          ) : (
            <a href="/login" className="hover:underline">
              Login
            </a>
          )}
        </nav>
      </header>

      {/* Main content */}
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-primary">Contact Us</h1>
        <p className="text-gray-600">
          Have questions or want to reach out? Here’s how you can contact us.
        </p>

        <div className="space-y-4 mt-6 text-gray-700">
          <div>
            <h2 className="font-semibold text-lg text-primary mb-1">Email</h2>
            <p>acmchapter@udst.edu.qa</p>
            <p>acmudst@gmail.com</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-primary mb-1">Location</h2>
            <p>University of Doha for Science and Technology (UDST)</p>
            <p>Main Campus, Doha, Qatar</p>
          </div>
        </div>
      </div>
    </main>

      {/* Footer */}
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

    </div>)
}

