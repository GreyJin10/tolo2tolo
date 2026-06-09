"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

interface LookbookLightboxProps {
  images: string[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
}

export function LookbookLightbox({ images, isOpen, initialIndex, onClose }: LookbookLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex, isOpen]);

  const goTo = useCallback((next: number) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(next);
      setFading(false);
    }, 300);
  }, [fading]);

  const prev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length);
  }, [current, images.length, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, images.length, goTo]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, prev, next]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: "rgba(10,10,10,0.96)", backdropFilter: "blur(24px)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 flex items-center justify-center w-10 h-10 transition-colors duration-300"
        style={{ background: "transparent", border: "0.5px solid rgba(245,244,240,0.12)", color: "rgba(245,244,240,0.5)", cursor: "pointer" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f5f4f0"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,244,240,0.3)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,244,240,0.5)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,244,240,0.12)"; }}
      >
        <X className="h-4 w-4" />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 z-10 font-[family-name:var(--font-sans)]" style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(245,244,240,0.3)" }}>
        {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </div>

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[current]}
          alt={`Lookbook ${current + 1}`}
          className="max-w-full max-h-[85vh] object-contain transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        />
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 transition-all duration-300"
          style={{ background: "rgba(245,244,240,0.04)", border: "none", color: "rgba(245,244,240,0.4)", cursor: "pointer" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f5f4f0"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,244,240,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,244,240,0.4)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,244,240,0.04)"; }}
        >
          <span style={{ fontSize: "24px", fontWeight: 200, lineHeight: 1 }}>‹</span>
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 transition-all duration-300"
          style={{ background: "rgba(245,244,240,0.04)", border: "none", color: "rgba(245,244,240,0.4)", cursor: "pointer" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f5f4f0"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,244,240,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,244,240,0.4)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,244,240,0.04)"; }}
        >
          <span style={{ fontSize: "24px", fontWeight: 200, lineHeight: 1 }}>›</span>
        </button>
      )}

      {/* Bottom gradient for counter visibility */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}
