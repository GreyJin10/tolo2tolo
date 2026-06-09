"use client";

// ─────────────────────────────────────────────────────────────────────────────
// MagneticButton — wraps any child element and makes it magnetically attract
// toward the cursor when hovered. Classic luxury-site effect.
//
// Usage:
//   <MagneticButton>
//     <button className="...">Shop Now</button>
//   </MagneticButton>
//
// Props:
//   strength (0–1, default 0.35) — how strong the pull is
//   className — forwarded to wrapper div
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, type ReactNode } from "react";

interface MagneticButtonProps {
  children:  ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticButton({ children, strength = 0.35, className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el   = ref.current;
    if (!el)   return;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * strength;
    const dy   = (e.clientY - cy) * strength;
    el.style.transform  = `translate(${dx}px, ${dy}px)`;
    el.style.transition = "transform 0.1s linear";
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform  = "translate(0,0)";
    el.style.transition = "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}
