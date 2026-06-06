"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingBag, User } from "lucide-react";
import { useCartCount } from "@/lib/use-cart-count";

const MOBILE_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/products", icon: Grid3X3 },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
  { label: "Account", href: "/account", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const cartCount = useCartCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/8 bg-[#f5f4f0]/95 backdrop-blur-md lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {MOBILE_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-colors font-[family-name:var(--font-sans)] ${
                isActive
                  ? "text-[#0a0a0a]"
                  : "text-[#888] hover:text-[#0a0a0a]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] tracking-[1px] uppercase leading-none">
                {link.label}
              </span>
              {link.label === "Cart" && cartCount > 0 && (
                <span className="absolute -top-0.5 right-1/4 min-w-[16px] h-4 flex items-center justify-center bg-[#0a0a0a] text-white text-[9px] font-[family-name:var(--font-sans)] rounded-full px-1">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
