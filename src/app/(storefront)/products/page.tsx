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

  const page     = Number(params.page) || 1;
  const sort     = (params.sort     as string) || "";
  const gender   = (params.gender   as string) || "";
  const category = (params.category as string) || "";
  const query    = (params.q        as string) || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true };
  if (gender)   where.gender   = gender;
  if (category) where.category = { slug: category };
  if (query) {
    where.OR = [
      { name:        { contains: query } },
      { description: { contains: query } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc")  orderBy = { basePrice:   "asc"  };
  else if (sort === "price_desc") orderBy = { basePrice:   "desc" };
  else if (sort === "featured")   orderBy = { isFeatured:  "desc" };

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images:   { orderBy: { sortOrder: "asc" } },
        variants: {
          where:    { isActive: true },
          select:   { color: true, colorName: true },
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
    // ── Dark background — full page ──────────────────────────────────────────
    <div className="pt-[60px]" style={{ background: "#0c0c0c", minHeight: "100vh" }}>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div
        className="px-6 lg:px-14 py-16 lg:py-20"
        style={{ borderBottom: "0.5px solid rgba(245,244,240,0.06)" }}
      >
        {/* Label */}
        <p
          className="font-[family-name:var(--font-sans)] mb-5"
          style={{ fontSize: "8px", letterSpacing: "5px", textTransform: "uppercase", color: "#b5a48a" }}
        >
          {query ? "Search Results" : "SS 2026"}
        </p>

        {/* Gold hairline */}
        <div className="w-6 h-px mb-6" style={{ background: "rgba(181,164,138,0.5)" }} />

        <div className="flex items-end justify-between">
          {/* Heading — Cormorant, large, tracking tight */}
          <h1
            className="font-[family-name:var(--font-heading)]"
            style={{
              fontSize: "clamp(36px,5vw,68px)",
              letterSpacing: "-2.5px",
              lineHeight: 0.95,
              fontWeight: 300,
              color: "rgba(245,244,240,0.9)",
            }}
          >
            {query ? `"${query}"` : "The Collection"}
          </h1>

          {/* Count — bottom-right, small */}
          <span
            className="font-[family-name:var(--font-sans)] hidden sm:block mb-1"
            style={{ fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,240,0.2)" }}
          >
            {totalCount} {totalCount === 1 ? "piece" : "pieces"}
          </span>
        </div>
      </div>

      {/* ── Content — filters + grid ─────────────────────────────────────────── */}
      <div className="flex gap-0 lg:gap-14 px-6 lg:px-14 py-10 lg:py-14">
        <ProductFilters categories={categories} />

        <div className="flex-1 min-w-0">
          {products.length > 0 ? (
            <>
              {/* 2-col mobile, 3-col desktop, 1px gap */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={(page - 1) * ITEMS_PER_PAGE + i + 1} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          ) : (
            // ── Empty state ───────────────────────────────────────────────────
            <div className="flex flex-col items-center justify-center py-40">
              <p
                className="font-[family-name:var(--font-heading)] mb-4"
                style={{ fontSize: "clamp(28px,4vw,46px)", letterSpacing: "-1.5px", color: "rgba(245,244,240,0.1)" }}
              >
                Nothing found
              </p>
              <p
                className="font-[family-name:var(--font-sans)]"
                style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(245,244,240,0.2)" }}
              >
                Try a different search or filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
