export function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key).trim();
  return value ? value : null;
}

export function readNumber(formData: FormData, key: string) {
  const value = Number(readString(formData, key));
  return Number.isFinite(value) ? value : Number.NaN;
}
