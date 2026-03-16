"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { errorFormState, type FormActionState } from "@/lib/form-action-state";
import { toErrorRedirect } from "@/lib/errors";
import { readString } from "@/lib/forms";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  validateProductInput,
} from "@/features/marketplace/server/marketplace";
import type { MarketplaceFormState } from "@/features/marketplace/types";

export async function createProductAction(
  _state: MarketplaceFormState,
  formData: FormData,
): Promise<MarketplaceFormState> {
  const validated = validateProductInput(formData);
  if (!validated.ok) {
    return errorFormState(validated.message, validated.fieldErrors);
  }

  const result = await createProduct(validated.data);
  if (!result.ok) {
    return errorFormState(result.message, result.fieldErrors);
  }

  revalidatePath("/");
  revalidatePath("/marketplace");
  revalidatePath("/marketplace/my-listings");
  redirect("/marketplace");
}

export async function updateProductAction(
  id: string,
  _state: MarketplaceFormState,
  formData: FormData,
): Promise<MarketplaceFormState> {
  const validated = validateProductInput(formData);
  if (!validated.ok) {
    return errorFormState(validated.message, validated.fieldErrors);
  }

  const result = await updateProduct(id, validated.data);
  if (!result.ok) {
    return errorFormState(result.message, result.fieldErrors);
  }

  revalidatePath("/marketplace");
  revalidatePath("/marketplace/my-listings");
  revalidatePath(`/marketplace/${id}/edit`);
  redirect("/marketplace/my-listings");
}

export async function deleteProductAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const id = readString(formData, "id");
  const result = await deleteProduct(id);
  if (!result.ok) {
    return errorFormState(result.message, result.fieldErrors);
  }

  revalidatePath("/");
  revalidatePath("/marketplace");
  revalidatePath("/marketplace/my-listings");
  return { status: "success", message: "Listing removed." };
}

export async function deleteProductFormAction(formData: FormData) {
  const state = await deleteProductAction({ status: "idle" }, formData);
  if (state.status === "error" && state.message) {
    redirect(toErrorRedirect(state.message, "/marketplace/my-listings"));
  }
}
