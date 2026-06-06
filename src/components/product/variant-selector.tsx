"use client";

import { Badge } from "@/components/ui/badge";

interface Variant {
  id: string;
  size: string;
  color: string;
  colorName: string | null;
  stock: number;
  price: number | null;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedSize: string | null;
  selectedColor: string | null;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

export function VariantSelector({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: VariantSelectorProps) {
  // Get unique sizes and colors
  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colors = Array.from(
    new Map(variants.map((v) => [v.color, { color: v.color, name: v.colorName }])).values()
  );

  // Find selected variant
  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  return (
    <div className="space-y-6">
      {/* Color selector */}
      <div>
        <h3 className="text-sm font-medium mb-3">
          Color{" "}
          {selectedColor && (
            <span className="text-muted-foreground font-normal">
              — {colors.find((c) => c.color === selectedColor)?.name || selectedColor}
            </span>
          )}
        </h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const isAvailable = variants.some(
              (v) =>
                v.color === c.color &&
                v.stock > 0 &&
                (!selectedSize || v.size === selectedSize)
            );
            return (
              <button
                key={c.color}
                onClick={() => onColorChange(c.color)}
                disabled={!isAvailable}
                className={`inline-flex items-center gap-2 px-4 py-2.5 min-w-[80px] min-h-[44px] text-[11px] tracking-[1px] font-[family-name:var(--font-sans)] border transition-all duration-200 ${
                  selectedColor === c.color
                    ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                    : "bg-transparent text-[#0a0a0a]/70 border-[#0a0a0a]/20 hover:border-[#0a0a0a]/50"
                } ${!isAvailable ? "opacity-25 cursor-not-allowed line-through" : "cursor-pointer active:scale-95"}`}
                title={c.name || c.color}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-[#0a0a0a]/20"
                  style={{ backgroundColor: c.color }}
                />
                {c.name || c.color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size selector */}
      <div>
        <h3 className="text-sm font-medium mb-3">
          Size{" "}
          {selectedSize && (
            <span className="text-muted-foreground font-normal">
              — {selectedSize}
            </span>
          )}
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isAvailable = variants.some(
              (v) =>
                v.size === size &&
                v.stock > 0 &&
                (!selectedColor || v.color === selectedColor)
            );
            return (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                disabled={!isAvailable}
                className={`inline-flex items-center justify-center px-4 py-2.5 min-w-[56px] min-h-[44px] text-[11px] tracking-[1px] font-[family-name:var(--font-sans)] border transition-all duration-200 ${
                  selectedSize === size
                    ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                    : "bg-transparent text-[#0a0a0a]/70 border-[#0a0a0a]/20 hover:border-[#0a0a0a]/50"
                } ${!isAvailable ? "opacity-25 cursor-not-allowed line-through" : "cursor-pointer active:scale-95"}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock indicator */}
      {selectedVariant && (
        <div>
          {selectedVariant.stock > 0 ? (
            selectedVariant.stock <= 5 ? (
              <Badge variant="secondary" className="text-orange-600 bg-orange-50">
                Only {selectedVariant.stock} left
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                In Stock
              </Badge>
            )
          ) : (
            <Badge variant="secondary" className="text-red-600 bg-red-50">
              Out of Stock
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
