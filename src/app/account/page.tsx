"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { User, MapPin, Package, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const QUICK_LINKS = [
  { label: "My Orders", href: "/orders", icon: Package, desc: "View order status" },
  { label: "Addresses", href: "/account/addresses", icon: MapPin, desc: "Manage addresses" },
  { label: "Shop", href: "/products", icon: ShoppingBag, desc: "Continue shopping" },
];

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">My Account</h1>
      <p className="text-muted-foreground mb-8">
        Welcome back, {session?.user?.name || "User"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-medium">{link.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
