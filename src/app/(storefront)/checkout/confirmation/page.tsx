"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderDetails {
  id: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    variant: {
      size: string;
      color: string;
      colorName: string | null;
      product: { name: string; slug: string };
    };
  }[];
}

import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    async function fetchOrder() {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        setOrder(await res.json());
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Order: {orderId?.slice(-12).toUpperCase()}
        </p>
      </div>

      {order && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Status: {order.status === "PROCESSING" ? "Processing" : order.status}</span>
            </div>

            <Separator />

            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.variant.product.name} ({item.variant.colorName || item.variant.color} / {item.variant.size})
                    <span className="text-muted-foreground ml-1">x{item.quantity}</span>
                  </span>
                  <span className="font-medium">¥{item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>¥{order.subtotal}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shippingCost === 0 ? "Free" : `¥${order.shippingCost}`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>¥{order.taxAmount}</span></div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>¥{order.total}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <Link href="/orders">
          <Button variant="outline" className="rounded-full">View Order</Button>
        </Link>
        <Link href="/products">
          <Button className="rounded-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 flex justify-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
