"use client";

import { useState } from "react";
import { ProductGallery } from "./product-gallery";
import { VariantSelector } from "./variant-selector";
import { AddToCartButton } from "./add-to-cart-button";
import { StickyCartBar } from "./sticky-cart-bar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Variant {
  id: string;
  size: string;
  color: string;
  colorName: string | null;
  stock: number;
  price: number | null;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    description: string;
    details: string | null;
    basePrice: number;
    compareAtPrice: number | null;
    images: { url: string; alt: string | null }[];
    variants: Variant[];
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Find the selected variant
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  // Auto-select first available size/color
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    // If current color not available in this size, reset
    if (selectedColor) {
      const available = product.variants.some(
        (v) => v.size === size && v.color === selectedColor && v.stock > 0
      );
      if (!available) setSelectedColor(null);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (selectedSize) {
      const available = product.variants.some(
        (v) => v.color === color && v.size === selectedSize && v.stock > 0
      );
      if (!available) setSelectedSize(null);
    }
  };

  // Price to display (variant override or base)
  const displayPrice = selectedVariant?.price ?? product.basePrice;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
      {/* Gallery */}
      <ProductGallery images={product.images} />

      {/* Product info */}
      <div className="space-y-6">
        {/* Title & Price */}
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(28px,3vw,42px)] tracking-[-1.5px] leading-none text-[#0a0a0a]">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-4 mt-4">
            <span className="font-[family-name:var(--font-sans)] text-[18px] tracking-[2px] text-[#0a0a0a]">
              ¥{displayPrice}
            </span>
            {product.compareAtPrice && (
              <span className="text-[13px] tracking-[1px] text-[#888] line-through font-[family-name:var(--font-sans)]">
                ¥{product.compareAtPrice}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="text-[10px] tracking-[1px] text-[#888] font-[family-name:var(--font-sans)]">
                -{Math.round((1 - displayPrice / product.compareAtPrice) * 100)}%
              </span>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-[#0a0a0a]/10" />

        {/* Variant selector */}
        <VariantSelector
          variants={product.variants}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSizeChange={handleSizeChange}
          onColorChange={handleColorChange}
        />

        {/* Separator */}
        <div className="w-full h-px bg-[#0a0a0a]/10" />

        {/* Add to cart */}
        <AddToCartButton
          variantId={selectedVariant?.id ?? null}
          maxQuantity={selectedVariant?.stock ?? 1}
        />

        {/* Product details accordion */}
        <Accordion className="mt-8">
          <AccordionItem value="description">
            <AccordionTrigger className="text-[11px] tracking-[3px] uppercase font-[family-name:var(--font-sans)] text-[#0a0a0a]/70">
              Description
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-[#888] leading-relaxed whitespace-pre-line font-[family-name:var(--font-sans)] text-[12px]">
                {product.description}
              </p>
            </AccordionContent>
          </AccordionItem>

          {product.details && (
            <AccordionItem value="details">
              <AccordionTrigger className="text-[11px] tracking-[3px] uppercase font-[family-name:var(--font-sans)] text-[#0a0a0a]/70">
                Materials & Care
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-[#888] leading-relaxed whitespace-pre-line font-[family-name:var(--font-sans)] text-[12px]">
                  {product.details}
                </p>
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="shipping">
            <AccordionTrigger className="text-[11px] tracking-[3px] uppercase font-[family-name:var(--font-sans)] text-[#0a0a0a]/70">
              Shipping & Returns
            </AccordionTrigger>
            <AccordionContent>
              <ul className="text-[#888] space-y-2 text-[12px] font-[family-name:var(--font-sans)]">
                <li>· Free shipping on orders over ¥299</li>
                <li>· Ships within 24 hours</li>
                <li>· 7-day hassle-free returns</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Sticky mobile cart bar */}
      <StickyCartBar
        variantId={selectedVariant?.id ?? null}
        maxQuantity={selectedVariant?.stock ?? 1}
        price={displayPrice}
      />
    </div>
  );
}
