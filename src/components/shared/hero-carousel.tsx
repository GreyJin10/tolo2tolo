"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "/models/663549c36m04547a7bc48cce89931fd1item.JPG",
  "/models/0c4c2b25ctc8b56de277e0076c6c5d4bitem.JPG",
  "/models/6871c4873u719423c7ca0d7fa083737aitem.JPG",
];

export function HeroCarousel() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
        setNext((prev) => (prev + 1) % HERO_IMAGES.length);
        setFading(false);
      }, 800);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative h-screen flex items-end overflow-hidden bg-[#0a0a0a]"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
        setMouse({ x, y });
      }}
    >
      {/* Background image — slow parallax */}
      <div
        className="absolute inset-0 opacity-25 mix-blend-luminosity transition-opacity duration-800"
        style={{
          backgroundImage: `url(${HERO_IMAGES[current]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: fading ? 0.15 : 0.25,
          transform: `translate(${mouse.x * -0.3}px, ${mouse.y * -0.3}px) scale(1.05)`,
          transition: "transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-in-out",
        }}
      />

      {/* Film grain texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-[640px] px-6 lg:px-12 pb-[60px] lg:pb-[80px]">
        <p className="text-[10px] tracking-[5px] uppercase text-[#b5a48a] mb-7 font-[family-name:var(--font-sans)]">
          SS 2026 Collection
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-[clamp(52px,7vw,88px)] leading-[0.92] text-white mb-8 tracking-[-2px]">
          Nothing<br />
          <em className="italic text-[#b5a48a]">Is</em><br />
          Everything
        </h1>
        <p className="text-[11px] tracking-[1.5px] text-white/35 leading-[2] mb-8 lg:mb-14 max-w-[360px] font-[family-name:var(--font-sans)]">
          Constructed from silence. Worn with intention.<br />
          Essentials redefined for those who understand restraint.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-start sm:items-center">
          <Link href="/products">
            <button className="bg-white text-[#0a0a0a] px-10 py-[14px] font-[family-name:var(--font-sans)] text-[11px] tracking-[3px] uppercase border-0 cursor-pointer transition-all duration-300 hover:bg-[#b5a48a] hover:text-white">
              Shop Now
            </button>
          </Link>
          <Link href="/products?sort=newest">
            <button className="text-[11px] tracking-[2px] uppercase text-white/35 cursor-pointer transition-colors duration-200 hover:text-white bg-transparent border-0 font-[family-name:var(--font-sans)] group flex items-center gap-2">
              View Lookbook
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Carousel dots */}
      <div className="absolute bottom-[60px] lg:bottom-[80px] left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setNext((i + 1) % HERO_IMAGES.length); }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-6 lg:right-12 bottom-[60px] lg:bottom-[80px] flex flex-col items-center gap-2 z-10">
        <span className="[writing-mode:vertical-rl] text-[9px] tracking-[4px] uppercase text-white/25 font-[family-name:var(--font-sans)]">
          Scroll
        </span>
        <div className="w-px h-10 bg-white/10 relative overflow-hidden">
          <div
            className="absolute top-0 w-full bg-white/50"
            style={{
              height: "40%",
              animation: "scrollLine 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Season tag */}
      <div className="absolute top-20 lg:top-24 right-6 lg:right-12 text-right z-10">
        <p className="text-[9px] tracking-[3px] uppercase text-white/20 font-[family-name:var(--font-sans)] leading-relaxed">
          Spring — Summer<br />Twenty Twenty-Six
        </p>
      </div>
    </section>
  );
}
