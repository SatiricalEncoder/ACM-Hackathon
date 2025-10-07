"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

export default function AboutPage() {
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
      <main className="flex-1 container mx-auto px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          About ACM Student Chapter @ UDST
        </h2>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-5">
          We are the ACM Student Chapter at the University of Doha for Science and Technology (UDST) — a community of students passionate about computing, innovation, and collaboration.
        </p>
        <p className="text-center text-gray-600 mb-12">Founded in February 07, 2025</p>

        <div className="max-w-6xl mx-auto space-y-16 px-6">

{/* Our Mission - Left image */}
        <section className="flex flex-col md:flex-row items-center md:gap-12 gap-4">
          {/* Text */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-primary">Our Mission</h2>
            <p className="leading-relaxed mt-2">
              Our mission is to empower students to explore computing through hands-on
              learning, networking, and real-world projects. We aim to foster technical
              growth, creativity, and teamwork within UDST’s academic community.
            </p>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/fill1.svg"
              alt="Our Mission"
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* What We Do - Right image */}
        <section className="flex flex-col md:flex-row-reverse items-center md:gap-12 gap-4">
          {/* Text */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-primary">What We Do</h2>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Organize tech talks, coding workshops, and competitions</li>
              <li>Host collaborative events with industry professionals</li>
              <li>Provide learning resources and mentorship for aspiring developers</li>
              <li>Promote inclusivity and teamwork in technology</li>
            </ul>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/fill2.svg"
              alt="What We Do"
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Why It Matters - Left image */}
        <section className="flex flex-col md:flex-row items-center md:gap-12 gap-4">
          {/* Text */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-primary">Why It Matters</h2>
            <p className="leading-relaxed mt-2">
              The ACM UDST Chapter bridges the gap between classroom learning and the
              professional world. Through our initiatives, members gain valuable experience,
              expand their network, and grow as future tech leaders.
            </p>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/fill3.svg"
              alt="Why It Matters"
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Team / Community - Right image */}
        <section className="flex flex-col md:flex-row-reverse items-center md:gap-12 gap-4">
          {/* Text */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-primary">Meet the Team</h2>
            <p className="leading-relaxed mt-2">
              Behind every event is a team of dedicated students and mentors working to build
              a stronger tech community at UDST.
            </p>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/headerbg.svg"
              alt="Our Team"
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Call to Action - Full width, centered */}
        <section className="text-center space-y-4 pt-8">
          <h2 className="text-2xl font-semibold text-primary">Get Involved</h2>
          <p className="leading-relaxed">
            Want to be part of our next event or join our chapter? Sign up, participate,
            and grow with us!
          </p>
          <a href="https://forms.office.com/pages/responsepage.aspx?id=REsPs8ZGcECZl_h7ONR3HFSJC6_gW7tKki5qmV4EuuNUM0NDSkNVUTBBRU9FTFpBSlAzUE9aUUowOS4u&origin=QRCode&route=shorturl" target="_blank"><button className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
            Join ACM UDST
          </button></a>
        </section>

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

