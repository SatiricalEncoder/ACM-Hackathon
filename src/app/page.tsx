"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  // Fetch events with participants
  const fetchEvents = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("event")
      .select(
        `
        *,
        event_participants(user_id)
      `,
      )
      .eq("is_deleted", false) // ✅ show only active events
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error.message);
      return;
    }

    const mapped = (data || []).map((ev: any) => ({
      ...ev,
      joined: ev.event_participants?.some(
        (p: any) => p.user_id === user.user_id,
      ),
    }));
    setEvents(mapped);
  };

  // ✅ Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser();
      setUser(u);
    };
    fetchUser();
  }, []);

  // ✅ Fetch events whenever user changes
  useEffect(() => {
    fetchEvents();
  }, [user]);

  // ✅ Join event
  const handleJoin = async (event_id: number) => {
    if (!user) return alert("Login required");

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

    if (error) return alert("Error joining: " + error.message);

    // Add XP
    await supabase.from("xp_history").insert([
      {
        user_id: user.user_id,
        xp_change: 50,
        reason: `Joined event ${event_id}`,
        time_give: new Date().toISOString(),
      },
    ]);

    window.dispatchEvent(new Event("xpUpdated"));
    fetchEvents();
  };

  // ✅ Leave event
  const handleLeave = async (event_id: number) => {
    if (!user) return;

    const { error } = await supabase
      .from("event_participants")
      .delete()
      .eq("event_id", event_id)
      .eq("user_id", user.user_id);

    if (error) return alert("Error leaving: " + error.message);

    await supabase.from("xp_history").insert([
      {
        user_id: user.user_id,
        xp_change: -50,
        reason: `Left event ${event_id}`,
        time_give: new Date().toISOString(),
      },
    ]);

    window.dispatchEvent(new Event("xpUpdated"));
    fetchEvents();
  };

  // ✅ Create event
  const handleCreateEvent = async () => {
    if (!newTitle) return alert("Title required");
    if (!user) return alert("Login required");

    const { error } = await supabase.from("event").insert([
      {
        title: newTitle,
        event_date: newDate ? new Date(newDate).toISOString() : null,
        created_by: user.email,
        creator_id: user.user_id,
      },
    ]);

    if (error) return alert("Error creating event: " + error.message);

    await supabase.from("xp_history").insert([
      {
        user_id: user.user_id,
        xp_change: 100,
        reason: `Created event ${newTitle}`,
        time_give: new Date().toISOString(),
      },
    ]);

    window.dispatchEvent(new Event("xpUpdated"));
    setNewTitle("");
    setNewDate("");
    setShowForm(false);
    fetchEvents();
  };

  const handleDeleteEvent = async (event_id: number) => {
    // Instantly hide it
    setEvents((prev) => prev.filter((ev) => ev.event_id !== event_id));

    // Optionally update Supabase if time allows
    try {
      await supabase
        .from("event")
        .update({ is_deleted: true })
        .eq("event_id", event_id);
    } catch (e) {
      console.warn("Skip Supabase delete for now:", e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b shadow-sm">
        <div className="flex items-center space-x-4">
          <img
            src="/images/acm udst logo.svg"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
          />
          <h1 className="font-bold text-lg sm:text-xl">
            UDST'S ACM STUDENT CHAPTER
          </h1>
        </div>
        <nav className="flex items-center space-x-6">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="/about" className="hover:underline">
            About
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
      <main className="flex-1 container mx-auto px-8 py-12">

        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Welcome to UDST’s ACM Student Chapter
        </h2>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
The ACM Student Chapter at UDST is a community for students interested in computing, technology, and innovation. We host workshops, talks, and competitions to grow skills and network with peers.
        </p>

        {user && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {showForm ? "Cancel" : "Create Event"}
            </button>
          </div>
        )}

        {showForm && (
          <div className="mb-6 max-w-md mx-auto p-4 bg-gray-100 rounded">
            <input
              type="text"
              placeholder="Event Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleCreateEvent}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Event
            </button>
          </div>
        )}

        {/* Events Section */}
        <section>
          <h3 className="text-xl font-medium mb-6">Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.length === 0 && <p>No events yet</p>}
            {events.map((ev) => (
              <div
                key={ev.event_id}
                className="bg-blue-100 h-40 rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold">{ev.title}</h4>
                  <p>
                    {ev.event_date
                      ? new Date(ev.event_date).toLocaleString()
                      : "No date set"}
                  </p>
                </div>

                <div className="flex space-x-2">
                  {user && !ev.joined && (
                    <button
                      onClick={() => handleJoin(ev.event_id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Join
                    </button>
                  )}
                  {user && ev.joined && (
                    <button
                      onClick={() => handleLeave(ev.event_id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Leave
                    </button>
                  )}
                  {user && ev.creator_id === user.user_id && (
                    <button
                      onClick={() => handleDeleteEvent(ev.event_id)}
                      className="bg-red-700 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
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
    </div>
  );
}
