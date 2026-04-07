"use server";

import { createClient } from "@supabase/supabase-js";

export async function findUserByEmail(email: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    const user = data.users.find((u) => u.email === email);
    return user || null;
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
}
