"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    image: string | null;
  };
  variant: {
    size: string;
    color: string;
    colorName: string | null;
    price: number | null;
    stock: number;
  };
}

interface CartData {
  id: string;
  items: CartItem[];
  total: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch {
      // cart is empty or error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function updateQuantity(variantId: string, quantity: number) {
    try {
      const res = await fetch("/api/cart/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      });
      if (res.ok) {
        fetchCart();
      } else {
        const err = await res.json();
        toast.error(err.error || "Update failed");
      }
    } catch {
      toast.error("Update failed");
    }
  }

  async function removeItem(variantId: string) {
    try {
      const res = await fetch(`/api/cart/items?variantId=${variantId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCart();
        toast.success("Removed");
      }
    } catch {
      toast.error("Remove failed");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Browse our collection</p>
        <Link href="/products">
          <Button className="rounded-full px-8">Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Cart ({cart.items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const price = item.variant.price ?? item.product.basePrice;
            const subtotal = price * item.quantity;

            return (
              <div
                key={item.id}
                className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.product.slug}`}
                  className="w-16 sm:w-20 h-24 sm:h-28 shrink-0 rounded-md overflow-hidden bg-muted"
                >
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                      None
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium hover:underline line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.variant.colorName || item.variant.color} / {item.variant.size}
                  </p>
                  <p className="text-sm font-semibold mt-1">¥{price}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.variant.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="flex flex-col items-end justify-between shrink-0">
                  <span className="font-semibold text-sm sm:text-base">¥{subtotal}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.variantId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-card p-6 space-y-4">
            {/* Free shipping progress */}
            {cart.total < 299 ? (
              <div className="space-y-1.5 pb-3 border-b border-[#0c0c0c]/8">
                <p className="text-[10px] tracking-[2px] uppercase text-[#888] font-[family-name:var(--font-sans)]">
                  Free shipping — ¥{299 - cart.total} away
                </p>
                <div className="h-1 bg-[#e8e6e0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b5a48a] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (cart.total / 299) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="pb-3 border-b border-[#0c0c0c]/8">
                <p className="text-[10px] tracking-[2px] uppercase text-[#b5a48a] font-[family-name:var(--font-sans)]">
                  ✓ Free shipping unlocked
                </p>
              </div>
            )}
            <h2 className="font-bold text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>¥{cart.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{cart.total >= 299 ? "Free" : "¥15"}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>¥{cart.total >= 299 ? cart.total : cart.total + 15}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full gap-2 rounded-full" size="lg">
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center">
              Free shipping over ¥299
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
