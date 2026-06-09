"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StickyCartBarProps {
  variantId:   string | null;
  maxQuantity: number;
  price:       number;
}

export function StickyCartBar({ variantId, price }: StickyCartBarProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAdd() {
    if (!variantId) {
      toast.error("Please select a size and colour first");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart/items", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ variantId, quantity: 1 }),
      });
      if (res.status === 401) { toast.error("Please sign in"); router.push("/auth/login"); return; }
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed bottom-14 lg:hidden left-0 right-0 z-40 flex items-center gap-0 safe-area-bottom"
      style={{
        background:    "rgba(10,10,10,0.95)",
        backdropFilter:"blur(16px)",
        borderTop:     "0.5px solid rgba(245,244,240,0.07)",
      }}
    >
      {/* Price */}
      <div className="flex-1 px-5">
        <span
          className="font-[family-name:var(--font-sans)]"
          style={{ fontSize: "12px", letterSpacing: "2.5px", color: "rgba(245,244,240,0.6)" }}
        >
          ¥ {price.toLocaleString()}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={handleAdd}
        disabled={!variantId || loading}
        className="font-[family-name:var(--font-sans)] transition-all duration-300"
        style={{
          height:       "52px",
          paddingLeft:  "32px",
          paddingRight: "32px",
          background:   !variantId || loading ? "rgba(245,244,240,0.06)" : "#f5f4f0",
          color:        !variantId || loading ? "rgba(245,244,240,0.2)" : "#0c0c0c",
          border:       "none",
          fontSize:     "8px",
          letterSpacing:"4px",
          textTransform:"uppercase",
          cursor:       !variantId || loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Adding..." : variantId ? "Add to Cart" : "Select Size"}
      </button>
    </div>
  );
}
