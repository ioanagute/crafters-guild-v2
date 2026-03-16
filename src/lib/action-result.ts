export type FieldErrors = Record<string, string>;

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(
  message: string,
  fieldErrors?: FieldErrors,
): ActionResult<T> {
  return { ok: false, message, fieldErrors };
}
