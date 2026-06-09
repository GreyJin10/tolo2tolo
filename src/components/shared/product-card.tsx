"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    compareAtPrice?: number | null;
    images: { url: string; alt: string | null }[];
    variants?: { color: string; colorName: string | null }[];
  };
  index?: number;
  large?: boolean;
}

export function ProductCard({ product, index, large }: ProductCardProps) {
  const firstImage = product.images[0];
  const secondImage = product.images[1];
  const discount = product.compareAtPrice
    ? Math.round((1 - product.basePrice / product.compareAtPrice) * 100)
    : 0;
  const [liked, setLiked] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const uniqueColors = product.variants
    ? Array.from(new Map(product.variants.map((v) => [v.color, v])).values())
    : [];

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.status === 401) { toast.error("Please sign in first"); return; }
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        toast.success(data.liked ? "Saved to wishlist" : "Removed from wishlist");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="group relative overflow-hidden cursor-pointer">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image container */}
        <div
          className={`relative overflow-hidden bg-[#e8e6e0] ${
            large ? "aspect-[3/5]" : "aspect-[3/4]"
          }`}
        >
          {/* Primary image */}
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.alt || product.name}
              className={`h-full w-full object-cover transition-all duration-[700ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03] ${
                secondImage ? "group-hover:opacity-0" : ""
              }`}
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="font-[family-name:var(--font-heading)] text-[clamp(48px,8vw,96px)] text-black/[0.06] tracking-[-4px] select-none">
                T
              </span>
            </div>
          )}

          {/* Secondary image — fade in on hover */}
          {secondImage && (
            <img
              src={secondImage.url}
              alt={secondImage.alt || product.name}
              className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[700ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] scale-[1.03]"
              loading="lazy"
            />
          )}

          {/* Wishlist — moved to right when index is also shown */}
          {index !== undefined && (
            <span className="absolute top-4 left-4 text-[10px] tracking-[2px] text-black/35 font-[family-name:var(--font-sans)] z-10">
              {String(index).padStart(3, "0")}
            </span>
          )}

          {/* Sale badge */}
          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-[#0c0c0c] hover:bg-[#0c0c0c] text-white border-0 text-[9px] tracking-[1.5px] uppercase font-[family-name:var(--font-sans)] rounded-none z-10">
              -{discount}%
            </Badge>
          )}

          {/* Wishlist */}
          <button
            className={`absolute top-3 right-3 h-8 w-8 flex items-center justify-center bg-white/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 ${
              likeAnim ? "scale-125" : "scale-100"
            }`}
            onClick={toggleWishlist}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-all duration-300 ${
                liked ? "fill-[#b5a48a] text-[#b5a48a]" : "text-[#0c0c0c]"
              }`}
            />
          </button>

          {/* Quick view bar — slides up on hover */}
          <div className="absolute inset-x-0 bottom-0 bg-[#0c0c0c]/85 backdrop-blur-sm py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-10 flex items-center justify-center gap-2">
            <Plus className="h-3 w-3 text-white/60" />
            <span className="text-[10px] tracking-[3px] uppercase text-white/80 font-[family-name:var(--font-sans)]">
              Quick Add
            </span>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-4 pb-5 bg-[#f5f4f0]">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-[family-name:var(--font-heading)] text-[17px] tracking-[-0.5px] text-[#0c0c0c] leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Color swatches */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {uniqueColors.slice(0, 6).map((v) => (
              <span
                key={v.color}
                className="inline-block w-2 h-2 rounded-full border border-black/15"
                style={{ backgroundColor: v.color }}
                title={v.colorName || v.color}
              />
            ))}
            {uniqueColors.length > 6 && (
              <span className="text-[9px] text-[#888] font-[family-name:var(--font-sans)]">
                +{uniqueColors.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="w-6 h-px bg-[#0c0c0c]/12 my-2.5" />

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] tracking-[2px] text-[#0c0c0c] font-[family-name:var(--font-sans)]">
            ¥{product.basePrice.toLocaleString()}
          </span>
          {product.compareAtPrice && (
            <span className="text-[10px] tracking-[1px] text-[#aaa] line-through font-[family-name:var(--font-sans)]">
              ¥{product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
