"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { Shield } from "lucide-react";
import FormField from "@/components/form/FormField";
import FieldError from "@/components/form/FieldError";
import FormStatusBanner from "@/components/form/FormStatusBanner";
import PendingButton from "@/components/form/PendingButton";
import { idleFormState } from "@/lib/form-action-state";
import { useAutoFocusFirstError } from "@/lib/client/useAutoFocusFirstError";
import type { AuthFormState } from "@/features/auth/types";

export default function LoginFormClient({
  action,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}) {
  const [intent, setIntent] = useState<"login" | "signup">("login");
  const [state, formAction, isPending] = useActionState(action, idleFormState());
  const formRef = useRef<HTMLFormElement>(null);

  useAutoFocusFirstError(state.fieldErrors, state.status, formRef);

  const describedBy = useMemo(
    () => ({
      email: state.fieldErrors?.email ? "email-error" : undefined,
      password: state.fieldErrors?.password ? "password-error" : undefined,
    }),
    [state.fieldErrors],
  );

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="intent" value={intent} />

      <FormStatusBanner status="error" message={state.status === "error" ? state.message : undefined} />

      <div className="flex flex-col gap-2">
        <FormField label="Scroll Reference (Email)" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            data-field-name="email"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={describedBy.email}
            className="field-input font-serif"
            placeholder="artisan@realm.com"
          />
        </FormField>
        <FieldError id="email-error" message={state.fieldErrors?.email} />
      </div>

      <div className="flex flex-col gap-2">
        <FormField label="Secret Word (Password)" htmlFor="password">
          <input
            id="password"
            name="password"
            type="password"
            required
            data-field-name="password"
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby={describedBy.password}
            className="field-input font-serif"
          />
        </FormField>
        <FieldError id="password-error" message={state.fieldErrors?.password} />
      </div>

      <p
        id="registration-help"
        className="rounded-[1rem] border border-leather-700 bg-leather-800/10 px-4 py-3 text-sm leading-relaxed text-leather-800"
      >
        New accounts begin as patrons. Artisan access is granted separately after approval.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <PendingButton
          type="submit"
          pending={isPending && intent === "login"}
          idleLabel="Enter the Guild"
          pendingLabel="Entering..."
          icon={<Shield className="h-4 w-4" />}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[1rem] border border-gold-600 bg-leather-800 py-3 font-serif tracking-[0.16em] text-gold-300 shadow-lg transition hover:bg-leather-700 hover:text-gold-200 disabled:opacity-70"
          ariaLabel="Enter the Guild"
          disabled={isPending}
          onClick={() => setIntent("login")}
        />
        <button
          type="submit"
          onClick={() => setIntent("signup")}
          disabled={isPending}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[1rem] border border-leather-800 bg-transparent py-3 font-serif tracking-[0.16em] text-ink-900 disabled:opacity-70"
        >
          {isPending && intent === "signup" ? "Registering..." : "Register New Heraldry"}
        </button>
      </div>
    </form>
  );
}
