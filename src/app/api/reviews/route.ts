import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Create a review
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  try {
    const { productId, rating, title, body } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please provide a valid product and rating" }, { status: 400 });
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      // Update existing review
      const review = await prisma.review.update({
        where: { id: existing.id },
        data: { rating, title, body },
        include: { user: { select: { name: true, image: true } } },
      });
      return NextResponse.json(review);
    }

    // Verify user purchased this product
    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        variant: { productId },
        order: { userId: session.user.id, status: { not: "CANCELLED" } },
      },
    });

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title: title || null,
        body: body || null,
        isVerified: !!hasOrdered,
      },
      include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ error: "Review submission failed" }, { status: 500 });
  }
}

// GET - Get reviews for a product
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({
    reviews,
    averageRating: Math.round(avgRating * 10) / 10,
    totalCount: reviews.length,
    distribution: [5, 4, 3, 2, 1].map((star) => ({
      stars: star,
      count: reviews.filter((r) => r.rating === star).length,
    })),
  });
}
