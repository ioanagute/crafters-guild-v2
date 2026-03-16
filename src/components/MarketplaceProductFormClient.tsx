"use client";

import { useActionState } from "react";
import { useRef } from "react";
import FormStatusBanner from "@/components/form/FormStatusBanner";
import ProductForm from "@/components/ProductForm";
import { useAutoFocusFirstError } from "@/lib/client/useAutoFocusFirstError";
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
  const formRef = useRef<HTMLFormElement>(null);
  useAutoFocusFirstError(state.fieldErrors, state.status, formRef);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6">
      <FormStatusBanner status="error" message={state.status === "error" ? state.message : undefined} />
      <ProductForm
        submitLabel={submitLabel}
        values={values}
        fieldErrors={state.fieldErrors}
        isPending={isPending}
      />
    </form>
  );
}
