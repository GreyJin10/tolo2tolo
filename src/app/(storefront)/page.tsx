"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroCarousel } from "@/components/shared/hero-carousel";
import { ProductCard } from "@/components/shared/product-card";
import { ProductCardSkeleton } from "@/components/shared/product-card-skeleton";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { useLanguage } from "@/components/layout/language-context";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice: number | null;
  images: { url: string; alt: string | null }[];
  variants: { color: string; colorName: string | null }[];
  isFeatured?: boolean;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
}

export default function HomePage() {
  const { t } = useLanguage();
  const [newArrivals, setNewArrivals] = useState<ProductData[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/products?featured=true&take=10");
      if (res.ok) {
        const data = await res.json();
        const all: ProductData[] = data.products || [];
        setNewArrivals(all.slice(0, 5));
        setFeaturedProducts(all.filter((p: ProductData) => p.isFeatured).slice(0, 4));
      }

      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories((data.categories || data || []).slice(0, 5));
      }

      setLoaded(true);
    }
    fetchData();
  }, []);

  return (
    <div>
      <HeroCarousel />

      {/* Ticker */}
      <div className="bg-[#b5a48a] py-3 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[ticker_20s_linear_infinite]">
          {[
            t("ticker.ss2026"),
            t("ticker.newArrivals"),
            t("ticker.freeShipping"),
            t("ticker.tagline"),
            t("ticker.ss2026"),
            t("ticker.newArrivals"),
            t("ticker.freeShipping"),
            t("ticker.tagline"),
          ].map((text, i) => (
            <span key={i} className="text-[11px] tracking-[3px] uppercase text-[#0a0a0a] mx-12 font-[family-name:var(--font-sans)]">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* New Arrivals — Asymmetric Grid */}
      {!loaded ? (
        <section className="px-4 lg:px-12 py-16 lg:py-[120px] bg-[#f5f4f0]">
          <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-[2px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={i === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <ScrollReveal>
        <section className="px-4 lg:px-12 py-16 lg:py-[120px] bg-[#f5f4f0]">
          <SectionHeader
            title={t("sections.theEssentials")}
            subtitle={t("sections.newArrivals")}
            href="/products?sort=newest"
          />
          <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-[2px]">
            {newArrivals.map((product, i) => (
              <div key={product.id} className={i === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
                <ProductCard product={product} index={i + 1} large={i === 0} />
              </div>
            ))}
          </div>
        </section>
        </ScrollReveal>
      )}

      {/* Editorial */}
      <ScrollReveal>
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[320px] lg:min-h-[480px]">
        <div className="bg-[#0a0a0a] flex items-center justify-center min-h-[320px] lg:min-h-[480px] relative overflow-hidden">
          <img src="/editorial-1.jpg" alt="Editorial" className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <span className="absolute top-6 lg:top-12 left-6 lg:left-12 text-[10px] tracking-[3px] uppercase text-white/50 font-[family-name:var(--font-sans)] z-10">
            {t("editorial.number")}
          </span>
          <span className="font-[family-name:var(--font-heading)] text-[clamp(80px,40vw,280px)] text-white/[0.06] absolute -right-4 lg:-right-10 -bottom-8 lg:-bottom-16 leading-none z-10">
            07
          </span>
        </div>
        <div className="bg-[#1a1a1a] flex flex-col justify-end p-8 lg:p-20 text-white">
          <p className="text-[10px] tracking-[4px] uppercase text-[#b5a48a] mb-5 font-[family-name:var(--font-sans)]">
            {t("editorial.season")}
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,4vw,56px)] leading-none tracking-[-2px] mb-6">
            {t("editorial.line1")}<br />
            {t("editorial.line2")} <em className="italic text-[#888]">{t("editorial.line3")}</em><br />
            {t("editorial.line4")}
          </h2>
          <p className="text-xs tracking-[0.5px] leading-[2] text-white/40 max-w-[360px] mb-8 lg:mb-12 font-[family-name:var(--font-sans)]">
            {t("editorial.desc")}
          </p>
          <Link href="/products?sort=newest" className="self-start">
            <button className="bg-white text-[#0a0a0a] px-10 py-4 font-[family-name:var(--font-sans)] text-[11px] tracking-[2px] uppercase border-0 cursor-pointer transition-all duration-200 hover:bg-[#d4d2cc]">
              {t("editorial.cta")}
            </button>
          </Link>
        </div>
      </section>
      </ScrollReveal>

      {/* Category Row */}
      {loaded && categories.length > 0 && (
        <ScrollReveal delay={100}>
        <section className="px-4 lg:px-12 py-16 lg:py-20 bg-[#f5f4f0]">
          <div className="mb-12">
            <p className="text-[10px] tracking-[4px] uppercase text-[#888] mb-3 font-[family-name:var(--font-sans)]">
              {t("sections.byCategory")}
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(32px,4vw,52px)] tracking-[-1.5px] leading-none text-[#0a0a0a]">
              {t("sections.explore")}
            </h2>
          </div>
          <div className="flex gap-[2px] overflow-x-auto lg:overflow-visible -mx-4 lg:mx-0 px-4 lg:px-0 snap-x snap-mandatory scrollbar-none">
            {categories.map((cat, i) => {
              const letters = ["T", "B", "O", "A", "L"];
              return (
                <Link key={cat.id} href={`/categories/${cat.slug}`}
                  className="flex-[0_0_70%] sm:flex-[0_0_36%] lg:flex-1 aspect-[2/3] bg-[#e0ded8] relative overflow-hidden cursor-pointer flex items-end transition-[flex] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] lg:hover:flex-[1.6] group snap-start">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-heading)] text-[clamp(36px,12vw,80px)] text-black/[0.06] select-none">
                      {letters[i] || cat.name.charAt(0)}
                    </span>
                  </div>
                  <span className="absolute top-4 left-4 text-[10px] tracking-[2px] text-black/25 font-[family-name:var(--font-sans)]">
                    {"0" + (i + 1)}
                  </span>
                  <div className="relative z-10 p-5 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-400 delay-100 text-white">
                    <div className="font-[family-name:var(--font-heading)] text-base tracking-[-0.5px]">{cat.name}</div>
                    <div className="text-[10px] tracking-[2px] uppercase text-white/50 mt-0.5 font-[family-name:var(--font-sans)]">
                      {t("sections.explore")}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        </ScrollReveal>
      )}

      {/* Featured */}
      {loaded && featuredProducts.length > 0 && (
        <ScrollReveal delay={200}>
        <section className="px-4 lg:px-12 py-16 lg:py-[120px] bg-[#f5f4f0]">
          <SectionHeader
            title={t("sections.selectedPicks")}
            subtitle={t("sections.featured")}
            href="/products?sort=featured"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[2px]">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i + 1} />
            ))}
          </div>
        </section>
        </ScrollReveal>
      )}
    </div>
  );
}
