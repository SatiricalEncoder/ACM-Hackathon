"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage("Error: " + error.message);
    else setMessage("Signup successful: " + JSON.stringify(data));
  }

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Supabase Test</h1>
      <input
        className="border p-2 mb-2 block"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2 block"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button
        onClick={handleSignUp}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sign Up
      </button>
      <p className="mt-4">{message}</p>
    </div>
  );
}
