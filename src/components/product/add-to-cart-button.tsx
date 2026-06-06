"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddToCartButtonProps {
  variantId: string | null;
  maxQuantity: number;
}

export function AddToCartButton({ variantId, maxQuantity }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAddToCart() {
    if (!variantId) {
      toast.error("Please select a size and color first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
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

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={loading}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-12 text-center font-medium tabular-nums">
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
          disabled={loading}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Add to cart */}
      <Button
        size="lg"
        className="w-full gap-2 rounded-full"
        onClick={handleAddToCart}
        disabled={!variantId || loading}
      >
        <ShoppingBag className="h-4 w-4" />
        {loading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
}
