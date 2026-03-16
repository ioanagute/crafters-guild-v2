"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { errorFormState, successFormState } from "@/lib/form-action-state";
import {
  signOutCurrentUser,
  updateProfile,
  validateProfileInput,
} from "@/features/profiles/server/profiles";
import type { ProfileFormState } from "@/features/profiles/types";

export async function updateProfileAction(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const validated = validateProfileInput(formData);
  if (!validated.ok) {
    return errorFormState(validated.message, validated.fieldErrors);
  }

  const result = await updateProfile(validated.data);

  if (!result.ok) {
    return errorFormState(result.message, result.fieldErrors);
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/tavern");
  revalidatePath("/guilds");
  revalidatePath("/marketplace");
  return successFormState("Heraldry updated.");
}

export async function signOutAction() {
  await signOutCurrentUser();
  revalidatePath("/", "layout");
  revalidatePath("/marketplace");
  revalidatePath("/marketplace/my-listings");
  redirect("/");
}
