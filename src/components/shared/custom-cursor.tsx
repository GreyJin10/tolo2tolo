"use client";

// ─────────────────────────────────────────────────────────────────────────────
// CustomCursor — luxury crosshair cursor with magnetic hover on links/buttons
// Place <CustomCursor /> once inside your root layout (client component only).
// Works on desktop only; hides on touch devices automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [hidden,   setHidden]   = useState(true);

  useEffect(() => {
    // Don't run on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    let rafId: number;
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setHidden(false);

      // Dot follows immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
      }
    };

    // Ring lags behind (lerp)
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const onEnterLink = () => setHovering(true);
    const onLeaveLink = () => setHovering(false);
    const onLeave     = () => setHidden(true);

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseleave", onLeave);

    const targets = () => document.querySelectorAll("a,button,[data-cursor]");
    const attach = () => {
      targets().forEach(el => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };
    attach();

    // Re-attach on route changes (Next.js navigation)
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    // Hide default cursor globally
    document.documentElement.style.cursor = "none";

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      targets().forEach(el => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
      observer.disconnect();
      document.documentElement.style.cursor = "";
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  return (
    <>
      {/* Small dot — instant */}
      <div
        ref={dotRef}
        style={{
          position:       "fixed",
          top:            0,
          left:           0,
          width:          hovering ? "6px"  : "4px",
          height:         hovering ? "6px"  : "4px",
          background:     hovering ? "#b5a48a" : "rgba(245,244,240,0.9)",
          borderRadius:   "50%",
          pointerEvents:  "none",
          zIndex:         99999,
          opacity:        hidden ? 0 : 1,
          transition:     "width 0.2s, height 0.2s, background 0.3s, opacity 0.3s",
          mixBlendMode:   "difference",
        }}
      />
      {/* Lagging ring */}
      <div
        ref={ringRef}
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         hovering ? "44px" : "28px",
          height:        hovering ? "44px" : "28px",
          border:        hovering ? "0.5px solid #b5a48a" : "0.5px solid rgba(245,244,240,0.35)",
          borderRadius:  hovering ? "50%" : "0%",
          pointerEvents: "none",
          zIndex:        99998,
          opacity:       hidden ? 0 : 1,
          transition:    "width 0.4s cubic-bezier(0.25,0.46,0.45,0.94), height 0.4s cubic-bezier(0.25,0.46,0.45,0.94), border-radius 0.4s, border-color 0.3s, opacity 0.3s",
        }}
      />
    </>
  );
}
