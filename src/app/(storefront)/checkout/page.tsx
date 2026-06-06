"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const addressSchema = z.object({
  fullName: z.string().min(1, "Recipient name is required"),
  phone: z.string().min(1, "Phone number is required"),
  line1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
});

type AddressForm = z.infer<typeof addressSchema>;

interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; name: string; slug: string; basePrice: number; image: string | null };
  variant: { size: string; color: string; colorName: string | null; price: number | null; stock: number };
}

interface CartData {
  items: CartItem[];
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    async function loadCart() {
      const res = await fetch("/api/cart");
      if (res.ok) {
        setCart(await res.json());
      }
      setLoading(false);
    }
    loadCart();
  }, []);

  async function onSubmit(data: AddressForm) {
    setSubmitting(true);
    try {
      // First save address
      const addrRes = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!addrRes.ok) {
        throw new Error("Failed to save address");
      }

      const address = await addrRes.json();

      // Create order
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: address.id }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "Order failed");
      }

      const order = await orderRes.json();
      toast.success("Order placed!");
      router.push(`/checkout/confirmation?orderId=${order.orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
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
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/products">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }

  const shippingCost = cart.total >= 299 ? 0 : 15;
  const tax = Math.round(cart.total * 0.06 * 100) / 100;
  const total = Math.round((cart.total + shippingCost + tax) * 100) / 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-3 w-3" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="font-bold text-lg">Shipping Info</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Recipient *</Label>
                    <Input id="fullName" placeholder="Full name" {...register("fullName")} />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" placeholder="13800138000" {...register("phone")} />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line1">Address *</Label>
                  <Input id="line1" placeholder="Street, building number" {...register("line1")} />
                  {errors.line1 && <p className="text-sm text-destructive">{errors.line1.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="Beijing" {...register("city")} />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Province</Label>
                    <Input id="state" placeholder="Beijing" {...register("state")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input id="postalCode" placeholder="100000" {...register("postalCode")} />
                    {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full rounded-full" size="lg" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Check className="h-4 w-4 mr-2" />
              Place Order
            </Button>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-card p-6 space-y-4">
            <h2 className="font-bold">Order Summary ({cart.items.length} items)</h2>
            <div className="space-y-2 max-h-60 overflow-auto">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-2 text-sm">
                  <span className="truncate flex-1">{item.product.name}</span>
                  <span className="text-muted-foreground">x{item.quantity}</span>
                  <span className="font-medium">¥{(item.variant.price ?? item.product.basePrice) * item.quantity}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>¥{cart.total}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? "Free" : `¥${shippingCost}`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>¥{tax}</span></div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>¥{total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
