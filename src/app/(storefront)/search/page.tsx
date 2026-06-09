import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/product-card";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q as string) || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];

  if (query) {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          where: { isActive: true },
          select: { color: true, colorName: true },
          distinct: ["color"],
        },
      },
      take: 24,
    });
  }

  return (
    <div className="pt-16">
      {/* Page header */}
      <div className="px-4 lg:px-12 py-12 lg:py-16 border-b border-[#0c0c0c]/8">
        <p className="text-[10px] tracking-[4px] uppercase text-[#888] mb-3 font-[family-name:var(--font-sans)]">
          {query ? "Results" : "Search"}
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-[clamp(28px,5vw,64px)] tracking-[-2px] leading-none text-[#0c0c0c]">
          {query ? `"${query}"` : "Search Products"}
        </h1>
        {query && (
          <p className="text-[11px] tracking-[2px] text-[#888] mt-3 font-[family-name:var(--font-sans)]">
            Found {products.length} {products.length === 1 ? "result" : "results"}
          </p>
        )}
      </div>

      {/* Results */}
      <div className="px-4 lg:px-12 py-8 lg:py-12">
        {products.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2px]">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {query && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="font-[family-name:var(--font-heading)] text-[clamp(28px,4vw,48px)] tracking-[-1.5px] text-[#0c0c0c]/20 mb-4">
              Nothing found
            </p>
            <p className="text-[11px] tracking-[2px] uppercase text-[#0c0c0c]/30 font-[family-name:var(--font-sans)]">
              Try different keywords or browse all categories
            </p>
          </div>
        )}

        {!query && (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="font-[family-name:var(--font-heading)] text-[clamp(28px,4vw,48px)] tracking-[-1.5px] text-[#0c0c0c]/20 mb-4">
              What are you looking for?
            </p>
            <p className="text-[11px] tracking-[2px] uppercase text-[#0c0c0c]/30 font-[family-name:var(--font-sans)]">
              Enter a keyword to search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
