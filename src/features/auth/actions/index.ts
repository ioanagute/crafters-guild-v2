"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { errorFormState, idleFormState } from "@/lib/form-action-state";
import { readString } from "@/lib/forms";
import type { AuthFormState } from "@/features/auth/types";

function validateAuthInput(formData: FormData) {
  const email = readString(formData, "email").trim();
  const password = readString(formData, "password");
  const fieldErrors: AuthFormState["fieldErrors"] = {};

  if (!email) fieldErrors.email = "Email is required.";
  if (!password) fieldErrors.password = "Password is required.";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false as const, email, password, fieldErrors };
  }

  return { ok: true as const, email, password };
}

export async function submitAuthAction(
  _previousState: AuthFormState = idleFormState(),
  formData: FormData,
): Promise<AuthFormState> {
  void _previousState;
  const intent = readString(formData, "intent");
  const role = readString(formData, "role") || "patron";
  const validated = validateAuthInput(formData);

  if (!validated.ok) {
    return errorFormState("Email and password are required.", validated.fieldErrors);
  }

  const supabase = await createClient();

  if (intent === "signup") {
    const { error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          role,
        },
      },
    });

    if (error) {
      return errorFormState(error.message);
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      return errorFormState(error.message);
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/marketplace");
  revalidatePath("/marketplace/my-listings");
  redirect("/tavern");
}

export { submitAuthAction as loginAction, submitAuthAction as signupAction };
