"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    variant: {
      size: string; color: string; colorName: string | null;
      product: { name: string; slug: string };
    };
  }[];
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  REFUNDED: { label: "Refunded", color: "bg-red-100 text-red-800" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground mb-4">No orders yet</p>
          <Link href="/products">
            <Button className="rounded-full px-8">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_MAP[order.status] || STATUS_MAP.PROCESSING;
            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-GB")}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground truncate max-w-[70%]">
                        {order.items.map((i) => i.variant.product.name).join(", ")}
                        <span className="ml-1">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">¥{order.total}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
