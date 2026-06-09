"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TextReveal } from "@/components/shared/text-reveal";
import { MagneticButton } from "@/components/shared/magnetic-button";

const HERO_IMAGES = [
  "/models/663549c36m04547a7bc48cce89931fd1item.JPG",
  "/models/图片_20260324134111_35645_2.jpg",
  "/models/6871c4873u719423c7ca0d7fa083737aitem.JPG",
  "/models/图片_20260324134116_35648_2.jpg",
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
        setFading(false);
      }, 600);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-end overflow-hidden bg-[#0c0c0c]">
      {/* Background images */}
      {HERO_IMAGES.map((img, i) => (
        <div
          key={img}
          className="absolute inset-0 transition-opacity duration-[1.2s] ease-in-out"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: i === 1 ? "50% 30%" : "center",
            opacity: i === current ? (fading ? 0 : 0.65) : 0,
          }}
        />
      ))}

      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom gradient — cleaner, less heavy */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/55 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-[640px] px-6 lg:px-12 pb-[80px] lg:pb-[100px]">
        <p className="text-[10px] tracking-[5px] uppercase text-[#b5a48a] mb-7 font-[family-name:var(--font-sans)]">
          SS 2026 Collection
        </p>
        <TextReveal
          text="Nothing Is Everything"
          tag="h1"
          delay={300}
          stagger={28}
          className="font-[family-name:var(--font-heading)] text-white mb-8 block"
          style={{ fontSize: "clamp(58px,8vw,100px)", letterSpacing: "-3px", fontWeight: 300, lineHeight: 0.9 } as React.CSSProperties}
        />
        <p className="text-[11px] tracking-[1.5px] text-white/40 leading-[2] mb-8 lg:mb-14 max-w-[340px] font-[family-name:var(--font-sans)]">
          Constructed from silence. Worn with intention.<br />
          Essentials redefined for those who understand restraint.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-start sm:items-center">
          <MagneticButton>
            <Link href="/products">
              <button className="bg-white text-[#0c0c0c] px-10 py-[14px] font-[family-name:var(--font-sans)] text-[11px] tracking-[3px] uppercase border-0 cursor-pointer transition-all duration-300 hover:bg-[#b5a48a] hover:text-white">
                Shop Now
              </button>
            </Link>
          </MagneticButton>
          <Link href="/products?sort=newest">
            <button className="text-[11px] tracking-[2px] uppercase text-white/35 cursor-pointer transition-colors duration-200 hover:text-white bg-transparent border-0 font-[family-name:var(--font-sans)] group flex items-center gap-2">
              View Lookbook
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Carousel dots + counter */}
      <div className="absolute bottom-[80px] lg:bottom-[100px] right-6 lg:right-12 flex items-center gap-4 z-10">
        <span className="text-[10px] tracking-[2px] text-white/30 font-[family-name:var(--font-sans)]">
          {String(current + 1).padStart(2, "0")} / {String(HERO_IMAGES.length).padStart(2, "0")}
        </span>
        <div className="flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-[2px] transition-all duration-500 ${
                i === current ? "w-8 bg-white" : "w-3 bg-white/25 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-6 lg:right-12 bottom-[130px] lg:bottom-[150px] flex flex-col items-center gap-2 z-10">
        <span className="[writing-mode:vertical-rl] text-[9px] tracking-[4px] uppercase text-white/20 font-[family-name:var(--font-sans)]">
          Scroll
        </span>
        <div className="w-px h-10 bg-white/8 relative overflow-hidden">
          <div
            className="absolute top-0 w-full bg-white/40"
            style={{
              height: "40%",
              animation: "scrollLine 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
