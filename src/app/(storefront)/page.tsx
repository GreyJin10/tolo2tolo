"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroCarousel } from "@/components/shared/hero-carousel";
import { ProductCard } from "@/components/shared/product-card";
import { ProductCardSkeleton } from "@/components/shared/product-card-skeleton";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { LookbookLightbox } from "@/components/shared/lookbook-lightbox";
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
  imageUrl?: string;
}

const LOOKBOOK_IMAGES = [
  "/models/图片_20260324134104_35639_2.jpg",
  "/models/7f245ee79444875906f77c4ba3efd5f6item.JPG",
  "/models/图片_20260324155417_35726_2.jpg",
  "/models/f0d70a4cdb34d7d62c35e8b946e5a27ditem.JPG",
  "/models/图片_20260324134114_35647_2.jpg",
  "/models/9dbe507cd0293950694bb0b70a2ed6d8item.JPG",
  "/models/图片_20260324134107_35642_2.jpg",
  "/models/292859item.JPG",
  "/models/图片_20260324134119_35649_2.jpg",
  "/models/a020ecb8dcfb816ac5ba44361e7a4b6bitem.JPG",
  "/models/图片_20260324134112_35646_2.jpg",
  "/models/图片_20260324134110_35644_2.jpg",
  "/models/图片_20260324134056_35633_2.jpg",
  "/models/图片_20260324134053_35631_2.jpg",
  "/models/图片_20260324155415_35725_2.jpg",
  "/models/图片_20260324155418_35727_2.jpg",
  "/models/6871c4873u719423c7ca0d7fa083737aitem.JPG",
];

export default function HomePage() {
  const { t } = useLanguage();
  const [newArrivals, setNewArrivals] = useState<ProductData[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
            <span key={i} className="text-[11px] tracking-[3px] uppercase text-[#0c0c0c] mx-12 font-[family-name:var(--font-sans)]">
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
        <div className="bg-[#0c0c0c] flex items-center justify-center min-h-[320px] lg:min-h-[480px] relative overflow-hidden">
          <img src="/models/2fc3142ca3fb6c48df6cc4be95480944item.JPG" alt="Editorial" className="absolute inset-0 w-full h-full object-cover opacity-70" />
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
            <button className="bg-white text-[#0c0c0c] px-10 py-4 font-[family-name:var(--font-sans)] text-[11px] tracking-[2px] uppercase border-0 cursor-pointer transition-all duration-200 hover:bg-[#d4d2cc]">
              {t("editorial.cta")}
            </button>
          </Link>
        </div>
      </section>
      </ScrollReveal>

      {/* Logo mark — brand breathing point */}
      <div className="flex justify-center py-16 lg:py-20 bg-[#f5f4f0]">
        <img src="/logo-mark.jpg" alt="TOLO2TOLO" className="h-10 lg:h-14 w-auto opacity-[0.12] grayscale" />
      </div>

      {/* Category Row */}
      {loaded && categories.length > 0 && (
        <ScrollReveal delay={100}>
        <section className="px-4 lg:px-12 pb-16 lg:pb-20 bg-[#f5f4f0]">
          <div className="mb-12">
            <p className="text-[10px] tracking-[4px] uppercase text-[#888] mb-3 font-[family-name:var(--font-sans)]">
              {t("sections.byCategory")}
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(32px,4vw,52px)] tracking-[-1.5px] leading-none text-[#0c0c0c]">
              {t("sections.explore")}
            </h2>
          </div>
          <div className="flex gap-[2px] overflow-x-auto lg:overflow-visible -mx-4 lg:mx-0 px-4 lg:px-0 snap-x snap-mandatory scrollbar-none">
            {categories.map((cat, i) => {
              const letters = ["T", "B", "O", "A", "L"];
              return (
                <Link key={cat.id} href={`/categories/${cat.slug}`}
                  className="flex-[0_0_70%] sm:flex-[0_0_36%] lg:flex-1 aspect-[2/3] bg-[#e0ded8] relative overflow-hidden cursor-pointer flex items-end transition-[flex] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] lg:hover:flex-[1.6] group snap-start">
                  {cat.imageUrl && (
                    <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-60 lg:group-hover:opacity-80 transition-opacity duration-400" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-heading)] text-[clamp(36px,12vw,80px)] text-white/[0.08] select-none">
                      {letters[i] || cat.name.charAt(0)}
                    </span>
                  </div>
                  <span className="absolute top-4 left-4 text-[10px] tracking-[2px] text-white/40 font-[family-name:var(--font-sans)]">
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

      {/* Lookbook Gallery */}
      <ScrollReveal delay={300}>
      <section className="px-4 lg:px-12 py-16 lg:py-[120px] bg-[#f5f4f0]">
        <SectionHeader
          title="The Lookbook"
          subtitle="SS 2026 Editorial — Click to expand"
          href="/products?sort=newest"
        />
        <div className="columns-2 lg:columns-3 gap-[2px]">
          {LOOKBOOK_IMAGES.map((src, i) => (
            <div
              key={src}
              className="break-inside-avoid mb-[2px] relative group cursor-pointer overflow-hidden"
              onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
            >
              <img
                src={src}
                alt={`Lookbook ${i + 1}`}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-400" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-[family-name:var(--font-sans)] bg-black/40 backdrop-blur-sm text-white/80 px-4 py-2 tracking-[3px] uppercase" style={{ fontSize: "9px", letterSpacing: "3px" }}>
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      </ScrollReveal>

      {/* Lookbook Lightbox */}
      <LookbookLightbox
        images={LOOKBOOK_IMAGES}
        isOpen={lightboxOpen}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
