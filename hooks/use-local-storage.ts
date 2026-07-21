"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persistent state backed by localStorage. SSR-safe: returns `initialValue`
 * until mounted, then hydrates from storage.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStored(JSON.parse(item) as T);
      }
    } catch {
      // Ignore malformed values / unavailable storage.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Ignore write failures (private mode / quota).
        }
        return next;
      });
    },
    [key],
  );

  return [stored, setValue];
}
