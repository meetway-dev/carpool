"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "rc.deviceKey";

function generateKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `dev-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

/**
 * Stable anonymous device key used for v1 ownership (favorites, history,
 * reports). Persisted in localStorage. Returns null until mounted.
 */
export function useDeviceKey(): string | null {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      let existing = window.localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        existing = generateKey();
        window.localStorage.setItem(STORAGE_KEY, existing);
      }
      setKey(existing);
    } catch {
      setKey(generateKey());
    }
  }, []);

  return key;
}
