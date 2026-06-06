import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  try {
    const { addressId } = await req.json();

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `${item.variant.product.name} - ${item.variant.size}/${item.variant.colorName || item.variant.color} Insufficient stock` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant.price ?? item.variant.product.basePrice;
      return sum + price * item.quantity;
    }, 0);
    const shippingCost = subtotal >= 299 ? 0 : 15;
    const taxAmount = Math.round(subtotal * 0.06 * 100) / 100;
    const total = Math.round((subtotal + shippingCost + taxAmount) * 100) / 100;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PROCESSING", // Skip PENDING since we don't have Stripe yet
        subtotal,
        shippingCost,
        taxAmount,
        total,
        shippingAddressId: addressId || null,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.variant.price ?? item.variant.product.basePrice,
          })),
        },
      },
    });

    // Update stock
    for (const item of cart.items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: item.variant.stock - item.quantity },
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ orderId: order.id, total: order.total });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed, please try again" }, { status: 500 });
  }
}

// GET - Get user's addresses for checkout
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json(addresses);
}
