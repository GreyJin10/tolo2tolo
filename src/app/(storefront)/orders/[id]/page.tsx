"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  REFUNDED: { label: "Refunded", color: "bg-red-100 text-red-800" },
};

interface OrderDetail {
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
  shippingAddress?: {
    fullName: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string | null;
    postalCode: string;
  } | null;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) setOrder(await res.json());
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Order not found</p>
        <Link href="/orders"><Button variant="link">Back to Orders</Button></Link>
      </div>
    );
  }

  const status = STATUS_MAP[order.status] || STATUS_MAP.PROCESSING;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-3 w-3" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            #{order.id.slice(-12).toUpperCase()}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("zh-CN")}
          </p>
        </div>
        <Badge className={`${status.color} text-sm px-3 py-1`}>{status.label}</Badge>
      </div>

      <div className="space-y-6">
        {/* Items */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <Link href={`/products/${item.variant.product.slug}`} className="font-medium hover:underline">
                    {item.variant.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.variant.colorName || item.variant.color} / {item.variant.size} × {item.quantity}
                  </p>
                </div>
                <span className="font-medium">¥{item.unitPrice * item.quantity}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shipping address */}
        {order.shippingAddress && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" /> Shipping Address
              </h3>
              <p>{order.shippingAddress.fullName} {order.shippingAddress.phone}</p>
              <p className="text-muted-foreground text-sm">
                {order.shippingAddress.line1}
                {order.shippingAddress.city} {order.shippingAddress.state || ""} {order.shippingAddress.postalCode}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Totals */}
        <Card>
          <CardContent className="pt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>¥{order.subtotal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shippingCost === 0 ? "Free" : `¥${order.shippingCost}`}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>¥{order.taxAmount}</span></div>
            <Separator />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>¥{order.total}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
