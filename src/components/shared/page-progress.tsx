"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PageProgress — ultra-thin gold top bar that animates on every Next.js
// navigation. No external package needed. Place once in your root layout.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function PageProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const timerRef   = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    // Clear previous
    if (timerRef.current)   clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setProgress(0);
    setVisible(true);

    // Fake progress: quickly to 85%, then stall
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += p < 50 ? 8 : p < 80 ? 3 : 0.5;
      if (p >= 85) { clearInterval(intervalRef.current!); p = 85; }
      setProgress(p);
    }, 60);

    // Finish
    timerRef.current = setTimeout(() => {
      clearInterval(intervalRef.current!);
      setProgress(100);
      setTimeout(() => { setVisible(false); setProgress(0); }, 400);
    }, 600);

    return () => {
      clearTimeout(timerRef.current!);
      clearInterval(intervalRef.current!);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position:   "fixed",
        top:        0,
        left:       0,
        right:      0,
        height:     "1px",
        zIndex:     100000,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height:     "100%",
          width:      `${progress}%`,
          background: "#b5a48a",
          transition: progress === 100
            ? "width 0.3s ease-out, opacity 0.3s"
            : "width 0.06s linear",
          opacity:    progress === 100 ? 0 : 1,
          boxShadow:  "0 0 8px rgba(181,164,138,0.6)",
        }}
      />
    </div>
  );
}
