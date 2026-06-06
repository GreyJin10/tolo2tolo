import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const take = parseInt(searchParams.get("take") || "10");

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(featured === "true" ? { isFeatured: true } : {}),
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          where: { isActive: true },
          select: { color: true, colorName: true },
          distinct: ["color"],
        },
      },
      take,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
