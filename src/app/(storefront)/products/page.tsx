import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/product-card";
import { Pagination } from "@/components/shared/pagination";
import { ProductFilters } from "@/components/shared/product-filters";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 12;

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    select: { id: true, name: true, slug: true },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const sort = (params.sort as string) || "";
  const gender = (params.gender as string) || "";
  const category = (params.category as string) || "";
  const query = (params.q as string) || "";

  // Build where
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true };
  if (gender) where.gender = gender;
  if (category) where.category = { slug: category };
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
    ];
  }

  // Build orderBy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { basePrice: "asc" };
  else if (sort === "price_desc") orderBy = { basePrice: "desc" };
  else if (sort === "featured") orderBy = { isFeatured: "desc" };

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          where: { isActive: true },
          select: { color: true, colorName: true },
          distinct: ["color"],
        },
      },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="pt-16">
      {/* Page header */}
      <div className="px-4 lg:px-12 py-12 lg:py-16 border-b border-[#0a0a0a]/8">
        <p className="text-[10px] tracking-[4px] uppercase text-[#888] mb-3 font-[family-name:var(--font-sans)]">
          {query ? "Search Results" : "Collection"}
        </p>
        <div className="flex items-end justify-between">
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(32px,5vw,64px)] tracking-[-2px] leading-none text-[#0a0a0a]">
            {query ? `"${query}"` : "All Products"}
          </h1>
          <span className="text-[11px] tracking-[2px] text-[#888] font-[family-name:var(--font-sans)] hidden sm:block">
            {totalCount} {totalCount === 1 ? "piece" : "pieces"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-0 lg:gap-12 px-4 lg:px-12 py-8 lg:py-12">
        <ProductFilters categories={categories} />

        <div className="flex-1 min-w-0">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2px]">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i + 1} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="font-[family-name:var(--font-heading)] text-[clamp(32px,4vw,48px)] tracking-[-1.5px] text-[#0a0a0a]/20 mb-4">
                Nothing found
              </p>
              <p className="text-[11px] tracking-[2px] uppercase text-[#0a0a0a]/30 font-[family-name:var(--font-sans)]">
                Try a different search or filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
