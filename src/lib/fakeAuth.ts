import { supabase } from "@/lib/supabaseClient";

export const signupUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const { data, error } = await supabase.from("user").insert([
    {
      username,
      email,
      password,
      created_at: new Date().toISOString(),
      rank_id: 1,
    },
  ]);

  if (error) throw error;

  localStorage.setItem("user_id", data[0].user_id.toString());
  return data[0];
};

export const loginUser = async (email: string, password: string) => {
  // Try to fetch the user
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", email);

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error("No user found with this email.");
  }

  const user = data[0]; // take the first row

  if (user.password !== password) {
    throw new Error("Incorrect password.");
  }

  localStorage.setItem("user_id", user.user_id.toString());
  return user;
};

export const logout = () => {
  localStorage.removeItem("user_id");
  window.location.href = "/";
};

export const getCurrentUser = async () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) return null;

  const { data } = await supabase
    .from("user")
    .select("*")
    .eq("user_id", Number(userId))
    .single();

  return data;
};
