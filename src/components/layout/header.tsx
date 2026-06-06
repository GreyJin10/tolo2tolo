"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, X, User } from "lucide-react";
import { useCartCount } from "@/lib/use-cart-count";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "Tops", href: "/categories/tops" },
  { label: "Dresses", href: "/categories/dresses" },
  { label: "Bottoms", href: "/categories/bottoms" },
  { label: "Outerwear", href: "/categories/outerwear" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartCount();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <nav
        className={`flex items-center justify-between px-6 lg:px-12 h-16 transition-all duration-500 ${
          scrolled
            ? "bg-[#f5f4f0]/92 backdrop-blur-md border-b border-black/8"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className={`font-[family-name:var(--font-heading)] text-[19px] tracking-[4px] transition-all duration-500 hover:opacity-60 border px-3 py-1 inline-block ${
              scrolled
                ? "text-[#0a0a0a] border-[#0a0a0a]/30"
                : "text-white border-white/30"
            }`}
          >
            <span>TOLO</span>
            <span className="mx-[3px] opacity-35 font-light">2</span>
            <span>TOLO</span>
          </Link>
          <span
            className={`hidden lg:block h-4 w-px mx-6 transition-colors duration-500 ${
              scrolled ? "bg-[#0a0a0a]/15" : "bg-white/20"
            }`}
          />
        </div>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[11px] tracking-[2.5px] uppercase transition-all duration-300 hover:opacity-100 relative group ${
                  scrolled ? "text-[#0a0a0a]/55" : "text-white/60"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search..."
                className={`w-[180px] sm:w-[220px] h-8 text-[11px] tracking-[1px] border rounded-none bg-transparent ${
                  scrolled
                    ? "border-black/25 text-[#0a0a0a]"
                    : "border-white/30 text-white placeholder:text-white/40"
                }`}
                autoFocus
                onBlur={() => setSearchOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = (e.target as HTMLInputElement).value;
                    if (q.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${scrolled ? "text-[#0a0a0a]/60" : "text-white/60"}`}
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 transition-colors ${
                scrolled
                  ? "text-[#0a0a0a]/50 hover:text-[#0a0a0a]"
                  : "text-white/50 hover:text-white"
              }`}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-[15px] w-[15px]" />
            </Button>
          )}

          <Link href="/auth/login" className="hidden sm:inline-flex">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 transition-colors ${
                scrolled
                  ? "text-[#0a0a0a]/50 hover:text-[#0a0a0a]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <User className="h-[15px] w-[15px]" />
            </Button>
          </Link>

          <Link href="/cart">
            <button
              className={`text-[10px] tracking-[3px] uppercase cursor-pointer border px-4 py-1.5 bg-transparent font-[family-name:var(--font-sans)] transition-all duration-300 ${
                scrolled
                  ? "border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#f5f4f0]"
                  : "border-white/50 text-white/80 hover:border-white hover:text-white"
              }`}
            >
              Bag{cartCount > 0 && ` (${cartCount})`}
            </button>
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className={`lg:hidden ml-1 flex flex-col gap-[5px] p-2 transition-colors ${
                scrolled ? "text-[#0a0a0a]" : "text-white"
              }`}
              aria-label="Menu"
            >
              <span className="block w-5 h-px bg-current" />
              <span className="block w-3.5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-[#f5f4f0] border-r border-black/8 p-0">
              <div className="flex flex-col h-full">
                <div className="px-8 pt-10 pb-6 border-b border-black/8">
                  <span className="font-[family-name:var(--font-heading)] text-[18px] tracking-[4px] text-[#0a0a0a]">
                    TOLO<span className="opacity-35">2</span>TOLO
                  </span>
                </div>
                <nav className="flex flex-col px-8 py-8 gap-0">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-[11px] tracking-[3px] uppercase text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors py-3 border-b border-black/5 last:border-0"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto px-8 pb-10">
                  <Link
                    href="/auth/login"
                    className="text-[10px] tracking-[3px] uppercase text-[#0a0a0a]/30 hover:text-[#0a0a0a] transition-colors"
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
