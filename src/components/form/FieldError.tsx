"use client";

export default function FieldError({
  id,
  message,
}: {
  id?: string;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p id={id} className="text-sm text-blood-700">
      {message}
    </p>
  );
}
