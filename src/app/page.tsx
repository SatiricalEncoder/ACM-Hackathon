"use client";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <img src="/images/logo.png" alt="ACM Logo" className="w-16 h-16" />
          <h1 className="font-bold text-lg sm:text-xl">
            UDST'S ACM STUDENT CHAPTER
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <a href="#" className="hover:underline">
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

      {/* Main content */}
      <main className="flex-1 container mx-auto px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Welcome to UDST’s Student Chapter
        </h2>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur
          adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae
          pellentesque sem placerat in id. Placerat in id cursus mi pretium
          tellus duis. Pretium tellus duis convallis tempus leo eu aenean.
        </p>

        {/* Events Section */}
        <section>
          <h3 className="text-xl font-medium mb-6">Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-100 h-40 rounded-lg"></div>
            <div className="bg-blue-100 h-40 rounded-lg"></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-4 text-center">
        UDST@2025
      </footer>
    </div>
  );
}
