import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: { orderBy: { sortOrder: "asc" }, take: 1 },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const total = cart.items.reduce((sum, item) => {
    const price = item.variant.price ?? item.variant.product.basePrice;
    return sum + price * item.quantity;
  }, 0);

  return NextResponse.json({
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      variantId: item.variantId,
      quantity: item.quantity,
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        slug: item.variant.product.slug,
        basePrice: item.variant.product.basePrice,
        image: item.variant.product.images[0]?.url || null,
      },
      variant: {
        size: item.variant.size,
        color: item.variant.color,
        colorName: item.variant.colorName,
        price: item.variant.price,
        stock: item.variant.stock,
      },
    })),
    total: Math.round(total * 100) / 100,
  });
}
