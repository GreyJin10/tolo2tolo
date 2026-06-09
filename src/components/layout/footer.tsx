"use client";

import Link from "next/link";
import { useState } from "react";

const FOOTER_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Editorial", href: "/products?sort=featured" },
  { label: "About", href: "#" },
  { label: "Stockists", href: "#" },
  { label: "Contact", href: "#" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  return (
    <footer className="bg-[#0c0c0c] text-[#f5f4f0] border-t border-white/10">
      {/* Main grid */}
      <div className="px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr] gap-12 lg:gap-16">
        {/* Left — brand */}
        <div>
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-[19px] tracking-[4px] border border-[#f5f4f0]/30 px-3 py-1 inline-block hover:opacity-60 transition-opacity text-[#f5f4f0]"
          >
            <span>TOLO</span>
            <span className="mx-[3px] opacity-35 font-light">2</span>
            <span>TOLO</span>
          </Link>
          <p className="text-[10px] tracking-[3px] uppercase text-white/25 mt-4 leading-relaxed font-[family-name:var(--font-sans)]">
            Minimal. Essential. Intentional.
          </p>
        </div>

        {/* Center — nav links */}
        <nav className="grid grid-cols-2 gap-x-8 gap-y-2">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[10px] tracking-[2.5px] uppercase text-white/30 hover:text-white transition-colors duration-200 font-[family-name:var(--font-sans)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Newsletter */}
        <div>
          <p className="text-[10px] tracking-[3px] uppercase text-white/25 mb-4 font-[family-name:var(--font-sans)]">
            Newsletter
          </p>
          {subscribed ? (
            <p className="text-[10px] tracking-[1px] text-white/40 font-[family-name:var(--font-sans)]">
              Thank you — you&apos;re on the list.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-0">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 min-w-0 bg-transparent border border-white/20 border-r-0 px-3 py-2 text-[10px] tracking-[1px] text-white placeholder:text-white/25 font-[family-name:var(--font-sans)] outline-none focus:border-white/50"
              />
              <button
                type="submit"
                className="border border-white/20 px-4 py-2 text-[10px] tracking-[2.5px] uppercase text-white/40 hover:text-white hover:border-white/50 transition-colors font-[family-name:var(--font-sans)] cursor-pointer bg-transparent"
              >
                Join
              </button>
            </form>
          )}
        </div>

        {/* Right — Follow */}
        <div>
          <p className="text-[10px] tracking-[3px] uppercase text-white/25 mb-4 font-[family-name:var(--font-sans)]">
            Follow
          </p>
          <div className="flex flex-col gap-2">
            {["Weibo", "WeChat", "Instagram"].map((platform) => (
              <span
                key={platform}
                className="text-[10px] tracking-[2px] uppercase text-white/25 hover:text-white transition-colors duration-200 cursor-pointer font-[family-name:var(--font-sans)]"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar — legal */}
      <div className="px-6 lg:px-12 py-5 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8">
        <p className="text-[9px] tracking-[1px] text-white/20 font-[family-name:var(--font-sans)]">
          &copy; 2026 tolo2tolo Studio. All rights reserved.
        </p>
        <div className="flex gap-6">
          <span className="text-[9px] tracking-[1px] text-white/20 hover:text-white/40 transition-colors cursor-pointer font-[family-name:var(--font-sans)]">
            Privacy
          </span>
          <span className="text-[9px] tracking-[1px] text-white/20 hover:text-white/40 transition-colors cursor-pointer font-[family-name:var(--font-sans)]">
            Terms
          </span>
          <span className="text-[9px] tracking-[1px] text-white/20 hover:text-white/40 transition-colors cursor-pointer font-[family-name:var(--font-sans)]">
            Cookies
          </span>
        </div>
      </div>
    </footer>
  );
}
