"use client";

import { useState } from "react";
import { ProductGallery } from "./product-gallery";
import { VariantSelector } from "./variant-selector";
import { AddToCartButton } from "./add-to-cart-button";
import { StickyCartBar } from "./sticky-cart-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Variant {
  id:        string;
  size:      string;
  color:     string;
  colorName: string | null;
  stock:     number;
  price:     number | null;
}

interface ProductDetailClientProps {
  product: {
    id:             string;
    name:           string;
    description:    string;
    details:        string | null;
    basePrice:      number;
    compareAtPrice: number | null;
    images:         { url: string; alt: string | null }[];
    variants:       Variant[];
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
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

  const displayPrice = selectedVariant?.price ?? product.basePrice;
  const discount = product.compareAtPrice
    ? Math.round((1 - displayPrice / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <ProductGallery images={product.images} />

      {/* ── Product info ──────────────────────────────────────────────────── */}
      <div className="space-y-0">

        {/* Product name */}
        <h1
          className="font-[family-name:var(--font-heading)] mb-7"
          style={{
            fontSize: "clamp(30px,3.5vw,46px)",
            letterSpacing: "-1.5px",
            lineHeight: 0.95,
            fontWeight: 300,
            color: "rgba(245,244,240,0.92)",
          }}
        >
          {product.name}
        </h1>

        {/* Gold hairline */}
        <div className="w-8 h-px mb-7" style={{ background: "rgba(181,164,138,0.45)" }} />

        {/* Price */}
        <div className="flex items-baseline gap-4 mb-8">
          <span
            className="font-[family-name:var(--font-sans)]"
            style={{ fontSize: "12px", letterSpacing: "3px", color: "rgba(245,244,240,0.7)" }}
          >
            ¥ {displayPrice.toLocaleString()}
          </span>
          {product.compareAtPrice && (
            <span
              className="font-[family-name:var(--font-sans)] line-through"
              style={{ fontSize: "10px", letterSpacing: "1.5px", color: "rgba(245,244,240,0.2)" }}
            >
              ¥ {product.compareAtPrice.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span
              className="font-[family-name:var(--font-sans)]"
              style={{ fontSize: "9px", letterSpacing: "1.5px", color: "#b5a48a" }}
            >
              -{discount}%
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-8" style={{ background: "rgba(245,244,240,0.06)" }} />

        {/* Variant selector */}
        <VariantSelector
          variants={product.variants}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSizeChange={handleSizeChange}
          onColorChange={handleColorChange}
        />

        {/* Divider */}
        <div className="w-full h-px mt-8 mb-8" style={{ background: "rgba(245,244,240,0.06)" }} />

        {/* Add to cart */}
        <AddToCartButton
          variantId={selectedVariant?.id ?? null}
          maxQuantity={selectedVariant?.stock ?? 1}
        />

        {/* ── Accordion — dark themed ───────────────────────────────────────── */}
        <div className="mt-10">
          <Accordion className="mt-0">
            <AccordionItem value="description">
              <AccordionTrigger
                className="font-[family-name:var(--font-sans)] hover:no-underline py-4"
                style={{
                  fontSize: "9px",
                  letterSpacing: "3.5px",
                  textTransform: "uppercase",
                  color: "rgba(245,244,240,0.4)",
                  borderBottom: "0.5px solid rgba(245,244,240,0.07)",
                }}
              >
                Description
              </AccordionTrigger>
              <AccordionContent className="pt-5 pb-6">
                <p
                  className="font-[family-name:var(--font-sans)] whitespace-pre-line"
                  style={{ fontSize: "11px", letterSpacing: "0.3px", lineHeight: 2, color: "rgba(245,244,240,0.35)" }}
                >
                  {product.description}
                </p>
              </AccordionContent>
            </AccordionItem>

            {product.details && (
              <AccordionItem value="details">
                <AccordionTrigger
                  className="font-[family-name:var(--font-sans)] hover:no-underline py-4"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "3.5px",
                    textTransform: "uppercase",
                    color: "rgba(245,244,240,0.4)",
                    borderBottom: "0.5px solid rgba(245,244,240,0.07)",
                  }}
                >
                  Materials & Care
                </AccordionTrigger>
                <AccordionContent className="pt-5 pb-6">
                  <p
                    className="font-[family-name:var(--font-sans)] whitespace-pre-line"
                    style={{ fontSize: "11px", letterSpacing: "0.3px", lineHeight: 2, color: "rgba(245,244,240,0.35)" }}
                  >
                    {product.details}
                  </p>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="shipping">
              <AccordionTrigger
                className="font-[family-name:var(--font-sans)] hover:no-underline py-4"
                style={{
                  fontSize: "9px",
                  letterSpacing: "3.5px",
                  textTransform: "uppercase",
                  color: "rgba(245,244,240,0.4)",
                  borderBottom: "0.5px solid rgba(245,244,240,0.07)",
                }}
              >
                Shipping & Returns
              </AccordionTrigger>
              <AccordionContent className="pt-5 pb-6">
                <ul className="space-y-3">
                  {[
                    "Free shipping on orders over ¥ 299",
                    "Ships within 24 hours",
                    "7-day hassle-free returns",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 font-[family-name:var(--font-sans)]"
                      style={{ fontSize: "11px", letterSpacing: "0.3px", lineHeight: 1.8, color: "rgba(245,244,240,0.35)" }}
                    >
                      <span style={{ color: "rgba(181,164,138,0.5)", marginTop: "1px" }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
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
