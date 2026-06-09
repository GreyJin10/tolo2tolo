"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, X, User } from "lucide-react";
import { useCartCount } from "@/lib/use-cart-count";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ── Collapsed to 3 top-level items ──────────────────────────────────────────
const NAV_LINKS = [
  { label: "Collection", href: "/products" },
  { label: "Editorial",  href: "/products?sort=featured" },
  { label: "About",      href: "#" },
];

// Full category list lives in the mobile drawer only
const DRAWER_LINKS = [
  { label: "All Pieces",  href: "/products" },
  { label: "New Arrivals",href: "/products?sort=newest" },
  { label: "Tops",        href: "/categories/tops" },
  { label: "Dresses",     href: "/categories/dresses" },
  { label: "Bottoms",     href: "/categories/bottoms" },
  { label: "Outerwear",   href: "/categories/outerwear" },
  { label: "Editorial",   href: "/products?sort=featured" },
  { label: "About",       href: "#" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const cartCount = useCartCount();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <nav
        className={`flex items-center justify-between px-6 lg:px-14 h-[60px] transition-all duration-700 ${
          scrolled
            ? "bg-[#0c0c0c]/95 backdrop-blur-md border-b border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* ── Logo — no border box ─────────────────────────── */}
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-[15px] tracking-[7px] text-white/90 hover:text-white/40 transition-all duration-700 uppercase select-none"
        >
          TOLO2TOLO
        </Link>

        {/* ── Desktop nav — 3 items, absolutely centered ──── */}
        <ul className="hidden lg:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative font-[family-name:var(--font-sans)] transition-all duration-500"
                style={{ fontSize: "9px", letterSpacing: "3.5px", textTransform: "uppercase", color: "rgba(245,244,240,0.35)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,240,0.9)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,240,0.35)"; }}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#b5a48a]/60 transition-all duration-500 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right icons ──────────────────────────────────── */}
        <div className="flex items-center gap-1">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search"
                className="w-[160px] sm:w-[200px] h-7 rounded-none bg-transparent border-0 border-b border-white/20 text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-white/50 font-[family-name:var(--font-sans)]"
                style={{ fontSize: "10px", letterSpacing: "1.5px" }}
                autoFocus
                onBlur={() => setSearchOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = (e.target as HTMLInputElement).value;
                    if (q.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
                  }
                }}
              />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-white/30 hover:text-white hover:bg-transparent" onClick={() => setSearchOpen(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/30 hover:text-white hover:bg-transparent transition-colors duration-300" onClick={() => setSearchOpen(true)}>
              <Search className="h-[14px] w-[14px]" />
            </Button>
          )}

          <Link href="/auth/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/30 hover:text-white hover:bg-transparent transition-colors duration-300">
              <User className="h-[14px] w-[14px]" />
            </Button>
          </Link>

          {/* Bag — plain text, no border box */}
          <Link href="/cart">
            <button
              className="font-[family-name:var(--font-sans)] ml-3 transition-colors duration-500 bg-transparent border-0 cursor-pointer"
              style={{ fontSize: "9px", letterSpacing: "3.5px", textTransform: "uppercase", color: "rgba(245,244,240,0.35)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,244,240,0.9)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,244,240,0.35)"; }}
            >
              {cartCount > 0 ? `Bag (${cartCount})` : "Bag"}
            </button>
          </Link>

          {/* Mobile hamburger — right side drawer */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className="lg:hidden ml-3 flex flex-col gap-[5px] p-2 text-white/40 hover:text-white transition-colors duration-300"
              aria-label="Menu"
            >
              <span className="block w-[18px] h-px bg-current" />
              <span className="block w-[12px] h-px bg-current" />
            </SheetTrigger>

            {/* Drawer — opens from RIGHT, dark ─────────────── */}
            <SheetContent side="right" className="w-[300px] bg-[#0c0c0c] border-l border-white/[0.06] p-0">
              <div className="flex flex-col h-full">
                {/* Drawer header */}
                <div className="px-8 pt-10 pb-8" style={{ borderBottom: "0.5px solid rgba(245,244,240,0.06)" }}>
                  <span
                    className="font-[family-name:var(--font-heading)] text-white uppercase"
                    style={{ fontSize: "14px", letterSpacing: "7px" }}
                  >
                    TOLO2TOLO
                  </span>
                </div>

                {/* Links */}
                <nav className="flex flex-col px-8 py-10 gap-0 flex-1">
                  {DRAWER_LINKS.map((link) => (
                    <Link
                      key={link.label + link.href}
                      href={link.href}
                      className="font-[family-name:var(--font-sans)] py-3.5 transition-colors duration-300"
                      style={{
                        fontSize: "9px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        color: "rgba(245,244,240,0.28)",
                        borderBottom: "0.5px solid rgba(245,244,240,0.05)",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,240,0.85)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,240,0.28)"; }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Drawer footer */}
                <div className="px-8 pb-12" style={{ borderTop: "0.5px solid rgba(245,244,240,0.06)", paddingTop: "24px" }}>
                  <Link
                    href="/auth/login"
                    className="font-[family-name:var(--font-sans)] transition-colors duration-300"
                    style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(245,244,240,0.18)" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
