import type { FormActionState } from "@/lib/form-action-state";

export type AuthField = "email" | "password" | "role";
export type AuthFormState = FormActionState<AuthField>;
