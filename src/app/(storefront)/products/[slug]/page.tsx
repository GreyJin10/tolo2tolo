import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { ReviewsSection } from "@/components/product/reviews-section";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: {
        where: { isActive: true },
        orderBy: [{ size: "asc" }, { color: "asc" }],
      },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  return product;
}

async function getRelatedProducts(
  categoryId: string,
  excludeId: string
) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { not: excludeId },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: {
        where: { isActive: true },
        select: { color: true, colorName: true },
        distinct: ["color"],
      },
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
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  );

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate">
          {product.name}
        </span>
      </nav>

      {/* Product detail */}
      <ProductDetailClient
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          details: product.details,
          basePrice: product.basePrice,
          compareAtPrice: product.compareAtPrice,
          images: product.images,
          variants: product.variants.map((v) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            colorName: v.colorName,
            stock: v.stock,
            price: v.price,
          })),
        }}
      />

      {/* Reviews */}
      <ReviewsSection productId={product.id} />

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <SectionHeader
            title="You may also like"
            href={`/categories/${product.category.slug}`}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
