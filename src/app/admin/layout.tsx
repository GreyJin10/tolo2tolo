"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, ChevronLeft } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top bar */}
      <header className="border-b bg-background h-14 flex items-center px-4 gap-4 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm">
          <ChevronLeft className="h-4 w-4" />
          Back to Store
        </Link>
        <span className="text-muted-foreground">|</span>
        <span className="font-medium">Admin</span>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 shrink-0 border-r bg-background min-h-[calc(100vh-3.5rem)] hidden md:block">
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
