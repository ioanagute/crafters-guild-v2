"use client";

import { useActionState } from "react";
import FormMessage from "@/components/FormMessage";
import ProductForm from "@/components/ProductForm";
import { idleFormState } from "@/lib/form-action-state";
import type {
  EditableProduct,
  MarketplaceFormState,
} from "@/features/marketplace/types";

export default function MarketplaceProductFormClient({
  action,
  submitLabel,
  values,
}: {
  action: (
    state: MarketplaceFormState,
    formData: FormData,
  ) => Promise<MarketplaceFormState>;
  submitLabel: string;
  values?: EditableProduct;
}) {
  const [state, formAction, isPending] = useActionState(action, idleFormState());

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.status === "error" && state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}
      <ProductForm
        submitLabel={submitLabel}
        values={values}
        fieldErrors={state.fieldErrors}
        isPending={isPending}
      />
    </form>
  );
}
