"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AddToCartButton — dark luxury edition
//  • Quantity stepper: minimal text buttons (– qty +) instead of icon buttons
//  • CTA: full-width ivory button with black text, hover inverts to gold outline
//  • Loading state: letter animation "Adding..."
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AddToCartButtonProps {
  variantId:   string | null;
  maxQuantity: number;
}

export function AddToCartButton({ variantId, maxQuantity }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  async function handleAddToCart() {
    if (!variantId) {
      toast.error("Please select a size and colour first");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart/items", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ variantId, quantity }),
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
      toast.error(err instanceof Error ? err.message : "Failed to add, please try again");
    } finally {
      setLoading(false);
    }
  }

  const notSelected = !variantId;

  return (
    <div className="space-y-5">

      {/* ── Quantity stepper ─────────────────────────────────────────── */}
      <div className="flex items-center gap-0" style={{ borderTop: "0.5px solid rgba(245,244,240,0.07)", borderBottom: "0.5px solid rgba(245,244,240,0.07)" }}>
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={loading || quantity <= 1}
          className="font-[family-name:var(--font-sans)] transition-colors duration-200"
          style={{
            width:       "44px",
            height:      "44px",
            background:  "transparent",
            border:      "none",
            color:       quantity <= 1 ? "rgba(245,244,240,0.15)" : "rgba(245,244,240,0.4)",
            fontSize:    "18px",
            fontWeight:  300,
            cursor:      quantity <= 1 ? "not-allowed" : "pointer",
            display:     "flex",
            alignItems:  "center",
            justifyContent: "center",
          }}
        >
          −
        </button>

        <span
          className="font-[family-name:var(--font-sans)] flex-1 text-center select-none tabular-nums"
          style={{ fontSize: "11px", letterSpacing: "3px", color: "rgba(245,244,240,0.6)" }}
        >
          {quantity}
        </span>

        <button
          onClick={() => setQuantity(Math.min(maxQuantity || 99, quantity + 1))}
          disabled={loading || quantity >= (maxQuantity || 99)}
          className="font-[family-name:var(--font-sans)] transition-colors duration-200"
          style={{
            width:       "44px",
            height:      "44px",
            background:  "transparent",
            border:      "none",
            color:       quantity >= (maxQuantity || 99) ? "rgba(245,244,240,0.15)" : "rgba(245,244,240,0.4)",
            fontSize:    "18px",
            fontWeight:  300,
            cursor:      quantity >= (maxQuantity || 99) ? "not-allowed" : "pointer",
            display:     "flex",
            alignItems:  "center",
            justifyContent: "center",
          }}
        >
          +
        </button>
      </div>

      {/* ── Add to cart CTA ──────────────────────────────────────────── */}
      <button
        onClick={handleAddToCart}
        disabled={notSelected || loading}
        className="w-full font-[family-name:var(--font-sans)] transition-all duration-500"
        style={{
          height:       "52px",
          background:   notSelected || loading ? "rgba(245,244,240,0.08)" : "#f5f4f0",
          color:        notSelected || loading ? "rgba(245,244,240,0.2)" : "#0c0c0c",
          border:       "none",
          fontSize:     "9px",
          letterSpacing:"4px",
          textTransform:"uppercase",
          cursor:       notSelected || loading ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (notSelected || loading) return;
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background   = "transparent";
          btn.style.color        = "#b5a48a";
          btn.style.outline      = "0.5px solid #b5a48a";
        }}
        onMouseLeave={(e) => {
          if (notSelected || loading) return;
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "#f5f4f0";
          btn.style.color      = "#0c0c0c";
          btn.style.outline    = "none";
        }}
      >
        {loading      ? "Adding..."
        : notSelected ? "Select Size & Colour"
        :               "Add to Cart"}
      </button>
    </div>
  );
}
