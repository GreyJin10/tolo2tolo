"use client";

import { useEffect, useState } from "react";

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function fetchCount() {
      try {
        const res = await fetch("/api/cart");
        if (res.ok && !ignore) {
          const data = await res.json();
          setCount(data.items?.length ?? 0);
        }
      } catch {
        // not signed in or error
      }
    }
    fetchCount();
    return () => { ignore = true; };
  }, []);

  return count;
}
