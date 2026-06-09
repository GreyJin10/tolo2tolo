import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeader } from "@/components/shared/section-header";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images:   { orderBy: { sortOrder: "asc" } },
      variants: { where: { isActive: true }, orderBy: [{ size: "asc" }, { color: "asc" }] },
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: excludeId } },
    include: {
      images:   { orderBy: { sortOrder: "asc" } },
      variants: { where: { isActive: true }, select: { color: true, colorName: true }, distinct: ["color"] },
    },
    take: 4,
  });
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, basePrice: true, images: { take: 1 } },
  });
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0]?.url ? [product.images[0].url] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || !product.isActive) notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  return (
    // ── Full dark page ────────────────────────────────────────────────────────
    <div style={{ background: "#0a0a0a", minHeight: "100vh", paddingTop: "60px" }}>

      {/* ── Breadcrumb ────────────────────────────────────────────────────────── */}
      <nav
        className="px-6 lg:px-14 py-5 flex items-center gap-3 font-[family-name:var(--font-sans)]"
        style={{ borderBottom: "0.5px solid rgba(245,244,240,0.05)" }}
      >
        <Link
          href="/"
          className="transition-colors duration-300"
          style={{ fontSize: "8px", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,240,0.2)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,240,0.6)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,240,0.2)"; }}
        >
          Home
        </Link>
        <span style={{ fontSize: "8px", color: "rgba(245,244,240,0.12)" }}>/</span>
        <Link
          href={`/categories/${product.category.slug}`}
          className="transition-colors duration-300"
          style={{ fontSize: "8px", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,240,0.2)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,240,0.6)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,240,0.2)"; }}
        >
          {product.category.name}
        </Link>
        <span style={{ fontSize: "8px", color: "rgba(245,244,240,0.12)" }}>/</span>
        <span
          className="font-[family-name:var(--font-sans)] truncate"
          style={{ fontSize: "8px", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,244,240,0.5)" }}
        >
          {product.name}
        </span>
      </nav>

      {/* ── Product detail ────────────────────────────────────────────────────── */}
      <div className="px-6 lg:px-14 py-10 lg:py-16">
        <ProductDetailClient
          product={{
            id:             product.id,
            name:           product.name,
            description:    product.description,
            details:        product.details,
            basePrice:      product.basePrice,
            compareAtPrice: product.compareAtPrice,
            images:         product.images,
            variants: product.variants.map((v) => ({
              id:        v.id,
              size:      v.size,
              color:     v.color,
              colorName: v.colorName,
              stock:     v.stock,
              price:     v.price,
            })),
          }}
        />
      </div>

      {/* ── Related products ─────────────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <div
          className="px-6 lg:px-14 py-16 lg:py-24"
          style={{ borderTop: "0.5px solid rgba(245,244,240,0.05)" }}
        >
          <SectionHeader
            title="You May Also Like"
            href={`/categories/${product.category.slug}`}
            linkLabel="View All"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
            {relatedProducts.map((rp, i) => (
              <ProductCard key={rp.id} product={rp} index={i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
