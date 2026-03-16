"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { readString } from "@/lib/forms";
import { toErrorRedirect } from "@/lib/errors";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = readString(formData, "email").trim();
  const password = readString(formData, "password");

  if (!email || !password) {
    redirect(toErrorRedirect("Email and password are required.", "/login"));
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(toErrorRedirect(error.message, "/login"));
  }

  revalidatePath("/", "layout");
  revalidatePath("/marketplace");
  revalidatePath("/marketplace/my-listings");
  redirect("/tavern");
}

export async function signupAction(formData: FormData) {
  const supabase = await createClient();
  const email = readString(formData, "email").trim();
  const password = readString(formData, "password");
  const role = readString(formData, "role") || "patron";

  if (!email || !password) {
    redirect(toErrorRedirect("Email and password are required.", "/login"));
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  });

  if (error) {
    redirect(toErrorRedirect(error.message, "/login"));
  }

  revalidatePath("/", "layout");
  revalidatePath("/marketplace");
  revalidatePath("/marketplace/my-listings");
  redirect("/tavern");
}
