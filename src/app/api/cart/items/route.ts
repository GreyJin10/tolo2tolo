import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Add item to cart
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  try {
    const { variantId, quantity = 1 } = await req.json();

    if (!variantId) {
      return NextResponse.json({ error: "Missing product info" }, { status: 400 });
    }

    // Verify variant exists and has stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || !variant.isActive) {
      return NextResponse.json({ error: "Product is unavailable" }, { status: 404 });
    }

    if (variant.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Check existing cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

// PUT - Update item quantity
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  try {
    const { variantId, quantity } = await req.json();

    if (quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 404 });
    }

    // Verify stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    await prisma.cartItem.updateMany({
      where: { cartId: cart.id, variantId },
      data: { quantity },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE - Remove item
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const variantId = searchParams.get("variantId");

  if (!variantId) {
    return NextResponse.json({ error: "Missing product info" }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) {
    return NextResponse.json({ success: true });
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, variantId },
  });

  return NextResponse.json({ success: true });
}
