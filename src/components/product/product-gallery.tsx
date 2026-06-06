"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ProductGalleryProps {
  images: { url: string; alt: string | null }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [emblaApi]);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-[#e8e6e0] flex items-center justify-center">
        <span className="font-[family-name:var(--font-heading)] text-[80px] text-black/[0.06] tracking-[-4px]">T</span>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnail strip — left side */}
      {images.length > 1 && (
        <div className="hidden lg:flex flex-col gap-2 w-16 shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`aspect-[3/4] overflow-hidden transition-all duration-200 ${
                i === selectedIndex
                  ? "ring-1 ring-[#0a0a0a] opacity-100"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `View ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 relative overflow-hidden">
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
            <span className="text-[10px] tracking-[2px] text-[#0a0a0a]/40 font-[family-name:var(--font-sans)]">
              {String(selectedIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
          </div>
        )}

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {images.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                <div className="aspect-[3/4] bg-[#e8e6e0]">
                  <img
                    src={img.url}
                    alt={img.alt || `Product image ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators — mobile */}
        {images.length > 1 && (
          <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`transition-all duration-300 ${
                  i === selectedIndex
                    ? "w-4 h-px bg-[#0a0a0a]"
                    : "w-px h-px bg-[#0a0a0a]/30 scale-150 rounded-full"
                }`}
              />
            ))}
          </div>
        )}

        {/* Arrow nav — subtle */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-[#0a0a0a]/30 hover:text-[#0a0a0a] transition-colors"
              aria-label="Previous"
            >
              <span className="text-[18px] font-light">‹</span>
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-[#0a0a0a]/30 hover:text-[#0a0a0a] transition-colors"
              aria-label="Next"
            >
              <span className="text-[18px] font-light">›</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
