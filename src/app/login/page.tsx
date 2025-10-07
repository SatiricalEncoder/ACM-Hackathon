"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/fakeAuth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (!username.trim()) return;
    login(username);
    router.push("/userProfile");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white items-center justify-center">
      <div className="border p-8 rounded-lg shadow-md w-80">
        <h1 className="text-xl font-bold mb-4 text-center">Quick Login</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded w-full p-2 mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
