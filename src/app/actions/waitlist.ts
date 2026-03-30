"use server";

import { supabase } from "@/lib/supabase";

export type WaitlistResult = {
  success: boolean;
  message: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(
  _prev: WaitlistResult,
  formData: FormData
): Promise<WaitlistResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const source = formData.get("source")?.toString() || "landing_page";

  if (!email || !EMAIL_REGEX.test(email) || email.length > 320) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!supabase) {
    return { success: false, message: "Waitlist is not configured yet. Please try again later." };
  }

  const { error } = await supabase
    .from("waitlist")
    .insert({ email, source });

  if (error) {
    if (error.code === "23505") {
      return { success: true, message: "You're already on the list!" };
    }
    return { success: false, message: "Something went wrong. Please try again." };
  }

  return { success: true, message: "You're on the list!" };
}
