import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: "asc" },
      take: 5,
    });

    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
