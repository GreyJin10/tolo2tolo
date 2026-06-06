import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/product-card";
import { Pagination } from "@/components/shared/pagination";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 12;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: true,
    },
  });

  if (!category) notFound();

  // Get all products in this category and its children
  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: { in: categoryIds },
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          where: { isActive: true },
          select: { color: true, colorName: true },
          distinct: ["color"],
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({
      where: {
        isActive: true,
        categoryId: { in: categoryIds },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-1">{category.description}</p>
        )}
        <p className="text-[10px] tracking-[2px] uppercase text-[#888] mt-1 font-[family-name:var(--font-sans)]">
          {totalCount} {totalCount === 1 ? "piece" : "pieces"}
        </p>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">
            No products in this category yet
          </p>
        </div>
      )}
    </div>
  );
}
