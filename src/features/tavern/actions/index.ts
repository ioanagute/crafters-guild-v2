"use server";

import { revalidatePath } from "next/cache";
import { errorFormState, successFormState, type FormActionState } from "@/lib/form-action-state";
import { readString } from "@/lib/forms";
import {
  createPost,
  deletePost,
  updatePost,
  validatePostInput,
} from "@/features/tavern/server/tavern";
import type { TavernFormState } from "@/features/tavern/types";

export async function createPostAction(
  _state: TavernFormState,
  formData: FormData,
): Promise<TavernFormState> {
  const validated = validatePostInput(formData);
  if (!validated.ok) {
    return errorFormState(validated.message, validated.fieldErrors);
  }

  const result = await createPost(validated.data);
  if (!result.ok) {
    return errorFormState(result.message, result.fieldErrors);
  }

  revalidatePath("/");
  revalidatePath("/tavern");
  return successFormState("Notice posted.");
}

export async function updatePostAction(
  _state: TavernFormState,
  formData: FormData,
): Promise<TavernFormState> {
  const id = readString(formData, "id");
  const validated = validatePostInput(formData);
  if (!validated.ok) {
    return errorFormState(validated.message, validated.fieldErrors);
  }

  const result = await updatePost(id, validated.data);
  if (!result.ok) {
    return errorFormState(result.message, result.fieldErrors);
  }

  revalidatePath("/tavern");
  return successFormState("Notice updated.");
}

export async function deletePostAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const id = readString(formData, "id");
  const result = await deletePost(id);
  if (!result.ok) {
    return errorFormState(result.message, result.fieldErrors);
  }

  revalidatePath("/tavern");
  return successFormState("Notice removed.");
}
