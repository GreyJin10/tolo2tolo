"use client";

// ─────────────────────────────────────────────────────────────────────────────
// VariantSelector — dark luxury edition
//  • Color: pill buttons with swatch dot + name, gold selected state
//  • Size: minimal ghost buttons, gold active underline
//  • Stock indicator: styled to brand (no orange/green Tailwind colors)
// ─────────────────────────────────────────────────────────────────────────────

interface Variant {
  id:        string;
  size:      string;
  color:     string;
  colorName: string | null;
  stock:     number;
  price:     number | null;
}

interface VariantSelectorProps {
  variants:      Variant[];
  selectedSize:  string | null;
  selectedColor: string | null;
  onSizeChange:  (size: string)  => void;
  onColorChange: (color: string) => void;
}

export function VariantSelector({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: VariantSelectorProps) {
  const sizes  = Array.from(new Set(variants.map((v) => v.size)));
  const colors = Array.from(
    new Map(variants.map((v) => [v.color, { color: v.color, name: v.colorName }])).values()
  );

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  return (
    <div className="space-y-8">

      {/* ── Color ──────────────────────────────────────────────────────── */}
      <div>
        <div
          className="flex items-center justify-between mb-4 font-[family-name:var(--font-sans)]"
          style={{ fontSize: "8px", letterSpacing: "3px", textTransform: "uppercase" }}
        >
          <span style={{ color: "rgba(245,244,240,0.3)" }}>Colour</span>
          {selectedColor && (
            <span style={{ color: "rgba(181,164,138,0.8)" }}>
              {colors.find((c) => c.color === selectedColor)?.name || selectedColor}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const isAvailable = variants.some(
              (v) => v.color === c.color && v.stock > 0 && (!selectedSize || v.size === selectedSize)
            );
            const isSelected  = selectedColor === c.color;

            return (
              <button
                key={c.color}
                onClick={() => isAvailable && onColorChange(c.color)}
                disabled={!isAvailable}
                title={c.name || c.color}
                className="relative flex items-center gap-2.5 transition-all duration-300 font-[family-name:var(--font-sans)]"
                style={{
                  padding:     "8px 14px 8px 10px",
                  border:      isSelected
                    ? "0.5px solid rgba(181,164,138,0.8)"
                    : "0.5px solid rgba(245,244,240,0.1)",
                  background:  isSelected ? "rgba(181,164,138,0.08)" : "transparent",
                  color:       isSelected ? "#b5a48a" : "rgba(245,244,240,0.4)",
                  opacity:     isAvailable ? 1 : 0.2,
                  cursor:      isAvailable ? "pointer" : "not-allowed",
                  fontSize:    "9px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  textDecoration: !isAvailable ? "line-through" : "none",
                }}
              >
                {/* Color swatch */}
                <span
                  style={{
                    width:        "10px",
                    height:       "10px",
                    borderRadius: "50%",
                    background:   c.color,
                    border:       "0.5px solid rgba(245,244,240,0.2)",
                    flexShrink:   0,
                  }}
                />
                {c.name || c.color}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Size ───────────────────────────────────────────────────────── */}
      <div>
        <div
          className="flex items-center justify-between mb-4 font-[family-name:var(--font-sans)]"
          style={{ fontSize: "8px", letterSpacing: "3px", textTransform: "uppercase" }}
        >
          <span style={{ color: "rgba(245,244,240,0.3)" }}>Size</span>
          {selectedSize && (
            <span style={{ color: "rgba(181,164,138,0.8)" }}>{selectedSize}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isAvailable = variants.some(
              (v) => v.size === size && v.stock > 0 && (!selectedColor || v.color === selectedColor)
            );
            const isSelected  = selectedSize === size;

            return (
              <button
                key={size}
                onClick={() => isAvailable && onSizeChange(size)}
                disabled={!isAvailable}
                className="relative font-[family-name:var(--font-sans)] transition-all duration-300"
                style={{
                  minWidth:    "48px",
                  padding:     "10px 16px",
                  border:      isSelected
                    ? "0.5px solid rgba(181,164,138,0.8)"
                    : "0.5px solid rgba(245,244,240,0.1)",
                  background:  isSelected ? "rgba(181,164,138,0.08)" : "transparent",
                  color:       isSelected ? "#b5a48a" : "rgba(245,244,240,0.45)",
                  opacity:     isAvailable ? 1 : 0.2,
                  cursor:      isAvailable ? "pointer" : "not-allowed",
                  fontSize:    "9px",
                  letterSpacing: "2.5px",
                  textDecoration: !isAvailable ? "line-through" : "none",
                  textAlign:   "center",
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Stock status ───────────────────────────────────────────────── */}
      {selectedVariant && (
        <div className="font-[family-name:var(--font-sans)]" style={{ fontSize: "8px", letterSpacing: "2.5px", textTransform: "uppercase" }}>
          {selectedVariant.stock > 0 ? (
            selectedVariant.stock <= 3 ? (
              <span style={{ color: "#b5a48a" }}>
                — Only {selectedVariant.stock} remaining
              </span>
            ) : selectedVariant.stock <= 8 ? (
              <span style={{ color: "rgba(245,244,240,0.3)" }}>
                — Low stock
              </span>
            ) : (
              <span style={{ color: "rgba(245,244,240,0.2)" }}>
                — In stock
              </span>
            )
          ) : (
            <span style={{ color: "rgba(245,244,240,0.2)" }}>
              — Out of stock
            </span>
          )}
        </div>
      )}
    </div>
  );
}
