"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/wishlist");
      if (res.ok) setProducts(await res.json());
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="px-4 lg:px-12 py-12 lg:py-16 border-b border-[#0a0a0a]/8">
        <p className="text-[10px] tracking-[4px] uppercase text-[#888] mb-3 font-[family-name:var(--font-sans)]">
          Saved Items
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-[clamp(28px,5vw,56px)] tracking-[-2px] leading-none text-[#0a0a0a]">
          My Wishlist
        </h1>
      </div>

      <div className="px-4 lg:px-12 py-8 lg:py-12">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Heart className="h-16 w-16 text-[#0a0a0a]/10 mb-4" />
          <p className="font-[family-name:var(--font-heading)] text-[clamp(28px,4vw,48px)] tracking-[-1.5px] text-[#0a0a0a]/20 mb-4">Your wishlist is empty</p>
          <Link href="/products">
            <Button className="rounded-none px-8">Discover Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2px]">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
