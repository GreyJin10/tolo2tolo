"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface StickyCartBarProps {
  variantId: string | null;
  maxQuantity: number;
  price: number;
}

export function StickyCartBar({ variantId, price, maxQuantity }: StickyCartBarProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAdd() {
    if (!variantId) {
      toast.error("Please select a size and color first");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity: 1 }),
      });
      if (res.status === 401) {
        toast.error("Please sign in to add to cart");
        router.push("/auth/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add");
      }
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-14 lg:hidden left-0 right-0 z-40 bg-[#f5f4f0]/95 backdrop-blur-md border-t border-[#0a0a0a]/10 px-4 py-3 flex items-center gap-3 safe-area-bottom">
      <div className="flex-1">
        <span className="text-[18px] tracking-[2px] font-[family-name:var(--font-sans)] text-[#0a0a0a]">
          ¥{price.toLocaleString()}
        </span>
      </div>
      <button
        onClick={handleAdd}
        disabled={!variantId || loading}
        className="flex items-center gap-2 bg-[#0a0a0a] text-white px-6 py-3 font-[family-name:var(--font-sans)] text-[11px] tracking-[3px] uppercase border-0 cursor-pointer disabled:opacity-30 transition-all duration-200 active:scale-95"
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        {loading ? "Adding..." : variantId ? "Add to Cart" : "Select Size"}
      </button>
    </div>
  );
}
