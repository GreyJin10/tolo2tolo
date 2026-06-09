"use client";

// ─────────────────────────────────────────────────────────────────────────────
// TextReveal — splits text into chars and slides each one up when scrolled
// into view. Used for hero headings and section titles.
//
// Usage:
//   <TextReveal text="Nothing Is Everything" tag="h1" className="font-heading text-[80px]" />
//   <TextReveal text="New Collection" tag="p" delay={200} stagger={30} />
//
// Props:
//   text     — the string to animate
//   tag      — HTML element ("h1" | "h2" | "p" | "span"), default "span"
//   delay    — ms before animation starts (default 0)
//   stagger  — ms between each character (default 25)
//   className — forwarded to the outer element
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface TextRevealProps {
  text:      string;
  tag?:      Tag;
  delay?:    number;
  stagger?:  number;
  className?: string;
  style?:    React.CSSProperties;
}

export function TextReveal({
  text,
  tag:       Tag = "span",
  delay    = 0,
  stagger  = 25,
  className = "",
  style,
}: TextRevealProps) {
  const ref     = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  // Split by words, each word splits into chars — preserves word wrapping
  const words = text.split(" ");
  let charIndex = 0;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} style={style} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
          {word.split("").map((char) => {
            const idx = charIndex++;
            return (
              <span
                key={idx}
                aria-hidden="true"
                style={{
                  display:       "inline-block",
                  transform:     visible ? "translateY(0)" : "translateY(110%)",
                  opacity:       visible ? 1 : 0,
                  transition:    `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${stagger * idx}ms, opacity 0.4s ease ${stagger * idx}ms`,
                  whiteSpace:    char === " " ? "pre" : undefined,
                }}
              >
                {char}
              </span>
            );
          })}
          {/* Space between words */}
          {wi < words.length - 1 && (
            <span aria-hidden="true" style={{ display: "inline-block" }}>&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}
