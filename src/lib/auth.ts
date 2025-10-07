import { supabase } from "@/lib/supabaseClient";

export const signupUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim();

  const { data, error } = await supabase
    .from("user")
    .insert([
      {
        username: cleanUsername,
        email: cleanEmail,
        password, // plaintext for hackathon; normally hash
        rank_id: 1,
        created_at: new Date().toISOString(),
      },
    ])
    .select(); // return inserted rows

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Could not create user");

  const user = data[0];
  localStorage.setItem("user_id", user.user_id.toString());
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .ilike("email", cleanEmail) // case-insensitive match
    .single();

  if (error || !data) throw new Error("No user found with this email.");

  if (data.password !== password) throw new Error("Incorrect password");

  localStorage.setItem("user_id", data.user_id.toString());
  return data;
};

export const logout = () => {
  localStorage.removeItem("user_id");
  window.location.href = "/";
};

export const getCurrentUser = async () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) return null;

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("user_id", Number(userId))
    .single();

  if (error) return null;
  return data;
};
