"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ProductGallery — upgraded version with:
//  • Image zoom on hover (cursor moves → image tracks)
//  • Dark-themed thumbnail strip with gold active indicator
//  • Counter styled to match brand
//  • Smooth swipe on mobile
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ProductGalleryProps {
  images: { url: string; alt: string | null }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setZoom({ active: false, x: 50, y: 50 });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  emblaApi?.scrollPrev();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [emblaApi]);

  // Zoom: track cursor position within the image
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width)  * 100;
    const y    = ((e.clientY - rect.top)  / rect.height) * 100;
    setZoom({ active: true, x, y });
  }

  function handleMouseLeave() {
    setZoom({ active: false, x: 50, y: 50 });
  }

  if (images.length === 0) {
    return (
      <div
        className="aspect-[3/4] flex items-center justify-center"
        style={{ background: "#161616" }}
      >
        <span
          className="font-[family-name:var(--font-heading)] select-none"
          style={{ fontSize: "80px", color: "rgba(245,244,240,0.04)", letterSpacing: "-4px" }}
        >
          T
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-3 lg:gap-4">

      {/* ── Thumbnail strip ───────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="hidden lg:flex flex-col gap-2 w-[64px] shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className="relative overflow-hidden transition-all duration-500"
              style={{
                aspectRatio: "3/4",
                background:  "#161616",
                opacity:     i === selectedIndex ? 1 : 0.35,
                outline:     "none",
                border:      "none",
                padding:     0,
                cursor:      "pointer",
              }}
            >
              <img
                src={img.url}
                alt={img.alt || `View ${i + 1}`}
                className="h-full w-full object-cover"
              />
              {/* Gold left-edge indicator for active */}
              <div
                style={{
                  position:   "absolute",
                  left:       0,
                  top:        "10%",
                  bottom:     "10%",
                  width:      "1.5px",
                  background: "#b5a48a",
                  opacity:    i === selectedIndex ? 1 : 0,
                  transition: "opacity 0.4s",
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Main image ─────────────────────────────────────────────────── */}
      <div className="flex-1 relative" style={{ minWidth: 0 }}>

        {/* Counter */}
        {images.length > 1 && (
          <div
            className="absolute top-4 right-4 z-10 font-[family-name:var(--font-sans)]"
            style={{ fontSize: "8px", letterSpacing: "2.5px", color: "rgba(245,244,240,0.3)" }}
          >
            {String(selectedIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>
        )}

        {/* Carousel */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {images.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                {/* Zoom container */}
                <div
                  ref={i === selectedIndex ? imgContainerRef : undefined}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "3/4", background: "#111", cursor: zoom.active ? "crosshair" : "default" }}
                  onMouseMove={i === selectedIndex ? handleMouseMove : undefined}
                  onMouseLeave={i === selectedIndex ? handleMouseLeave : undefined}
                >
                  <img
                    src={img.url}
                    alt={img.alt || `Product image ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    draggable={false}
                    style={{
                      transform:       zoom.active && i === selectedIndex
                        ? `scale(1.55) translate(${(50 - zoom.x) * 0.25}%, ${(50 - zoom.y) * 0.25}%)`
                        : "scale(1) translate(0,0)",
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      transition:      zoom.active
                        ? "transform 0.08s linear"
                        : "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile dot indicators */}
        {images.length > 1 && (
          <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                style={{
                  width:      i === selectedIndex ? "20px" : "3px",
                  height:     "1px",
                  background: i === selectedIndex ? "#b5a48a" : "rgba(245,244,240,0.3)",
                  border:     "none",
                  padding:    0,
                  cursor:     "pointer",
                  transition: "width 0.4s cubic-bezier(0.25,0.46,0.45,0.94), background 0.3s",
                }}
              />
            ))}
          </div>
        )}

        {/* Arrow nav */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                width: "32px", height: "32px",
                background: "rgba(10,10,10,0.5)",
                backdropFilter: "blur(8px)",
                border: "none", color: "rgba(245,244,240,0.5)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f5f4f0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,244,240,0.5)"; }}
              aria-label="Previous"
            >
              <span style={{ fontSize: "18px", fontWeight: 300, lineHeight: 1 }}>‹</span>
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                width: "32px", height: "32px",
                background: "rgba(10,10,10,0.5)",
                backdropFilter: "blur(8px)",
                border: "none", color: "rgba(245,244,240,0.5)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f5f4f0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,244,240,0.5)"; }}
              aria-label="Next"
            >
              <span style={{ fontSize: "18px", fontWeight: 300, lineHeight: 1 }}>›</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
