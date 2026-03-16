"use client";

import FormMessage from "@/components/FormMessage";

export default function FormStatusBanner({
  status,
  message,
}: {
  status: "success" | "error";
  message?: string;
}) {
  if (!message) return null;

  return (
    <FormMessage tone={status} role={status === "error" ? "alert" : "status"}>
      {message}
    </FormMessage>
  );
}
