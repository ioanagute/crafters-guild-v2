export function toErrorRedirect(message: string, returnTo?: string) {
  const params = new URLSearchParams({ message });
  if (returnTo) {
    params.set("returnTo", returnTo);
  }

  return `/error?${params.toString()}`;
}
