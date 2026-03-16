export type FormActionState<TFields extends string = string> = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<TFields, string>>;
};

export function idleFormState<TFields extends string = string>(): FormActionState<TFields> {
  return { status: "idle" };
}

export function successFormState<TFields extends string = string>(
  message?: string,
): FormActionState<TFields> {
  return { status: "success", message };
}

export function errorFormState<TFields extends string = string>(
  message: string,
  fieldErrors?: Partial<Record<TFields, string>>,
): FormActionState<TFields> {
  return { status: "error", message, fieldErrors };
}
