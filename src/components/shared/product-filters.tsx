"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SORT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Featured", value: "featured" },
];

interface ProductFiltersProps {
  categories: { id: string; name: string; slug: string }[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "";
  const currentCategory = searchParams.get("category") || "";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() { router.push(pathname); }

  const hasFilters = currentSort || currentCategory;

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Sort */}
      <div>
        <p className="text-[10px] tracking-[3px] uppercase text-[#0c0c0c]/40 mb-4 font-[family-name:var(--font-sans)]">
          Sort
        </p>
        <div className="flex flex-col gap-0">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("sort", opt.value || null)}
              className={`text-left text-[11px] tracking-[1px] py-2.5 border-b border-[#0c0c0c]/6 font-[family-name:var(--font-sans)] transition-colors duration-150 ${
                currentSort === opt.value
                  ? "text-[#0c0c0c]"
                  : "text-[#0c0c0c]/35 hover:text-[#0c0c0c]/70"
              }`}
            >
              <span className={`mr-2 transition-opacity ${currentSort === opt.value ? "opacity-100" : "opacity-0"}`}>—</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[3px] uppercase text-[#0c0c0c]/40 mb-4 font-[family-name:var(--font-sans)]">
            Category
          </p>
          <div className="flex flex-col gap-0">
            <button
              onClick={() => updateParam("category", null)}
              className={`text-left text-[11px] tracking-[1px] py-2.5 border-b border-[#0c0c0c]/6 font-[family-name:var(--font-sans)] transition-colors duration-150 ${
                !currentCategory ? "text-[#0c0c0c]" : "text-[#0c0c0c]/35 hover:text-[#0c0c0c]/70"
              }`}
            >
              <span className={`mr-2 ${!currentCategory ? "opacity-100" : "opacity-0"}`}>—</span>
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.slug)}
                className={`text-left text-[11px] tracking-[1px] py-2.5 border-b border-[#0c0c0c]/6 font-[family-name:var(--font-sans)] transition-colors duration-150 ${
                  currentCategory === cat.slug
                    ? "text-[#0c0c0c]"
                    : "text-[#0c0c0c]/35 hover:text-[#0c0c0c]/70"
                }`}
              >
                <span className={`mr-2 ${currentCategory === cat.slug ? "opacity-100" : "opacity-0"}`}>—</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-[10px] tracking-[2px] uppercase text-[#0c0c0c]/30 hover:text-[#0c0c0c] transition-colors font-[family-name:var(--font-sans)]"
        >
          <X className="h-3 w-3" />
          Clear all
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-48 shrink-0">
        <FilterContent />
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase border border-[#0c0c0c]/20 px-4 py-2 font-[family-name:var(--font-sans)] text-[#0c0c0c]/60 hover:text-[#0c0c0c] hover:border-[#0c0c0c]/40 transition-colors">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
            {hasFilters && <span className="w-1 h-1 rounded-full bg-[#b5a48a]" />}
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-[#f5f4f0] border-r border-black/8 p-8">
            <p className="text-[11px] tracking-[4px] uppercase text-[#0c0c0c] mb-10 font-[family-name:var(--font-sans)]">
              Filter
            </p>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
