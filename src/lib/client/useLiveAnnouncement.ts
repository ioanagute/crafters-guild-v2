"use client";

import { useEffect, useState } from "react";

export function useLiveAnnouncement(message?: string) {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (!message) {
      const resetId = window.setTimeout(() => setAnnouncement(""), 0);
      return () => window.clearTimeout(resetId);
    }

    const clearId = window.setTimeout(() => setAnnouncement(""), 0);
    const announceId = window.setTimeout(() => {
      setAnnouncement(message);
    }, 20);

    return () => {
      window.clearTimeout(clearId);
      window.clearTimeout(announceId);
    };
  }, [message]);

  return announcement;
}
