"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages:  number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const btnBase: React.CSSProperties = {
    background:    "transparent",
    border:        "none",
    cursor:        "pointer",
    fontFamily:    "var(--font-sans)",
    fontSize:      "9px",
    letterSpacing: "2.5px",
    padding:       "10px 14px",
    transition:    "all 0.3s",
    textTransform: "uppercase" as const,
    color:         "rgba(10,10,10,0.3)",
  };

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-16 mb-4"
      style={{ borderTop: "0.5px solid rgba(10,10,10,0.08)", paddingTop: "40px" }}
    >
      {/* Prev */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        style={{ ...btnBase, opacity: currentPage <= 1 ? 0.2 : 1, marginRight: "16px" }}
        onMouseEnter={(e) => { if (currentPage > 1) (e.currentTarget as HTMLButtonElement).style.color = "#0c0c0c"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(10,10,10,0.3)"; }}
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} style={{ ...btnBase, cursor: "default" }}>
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page as number)}
            style={{
              ...btnBase,
              color:   page === currentPage ? "#8a7f6e" : "rgba(10,10,10,0.3)",
              outline: page === currentPage ? "0.5px solid rgba(139,123,98,0.4)" : "none",
            }}
            onMouseEnter={(e) => {
              if (page !== currentPage) (e.currentTarget as HTMLButtonElement).style.color = "#0c0c0c";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                page === currentPage ? "#8a7f6e" : "rgba(10,10,10,0.3)";
            }}
          >
            {String(page as number).padStart(2, "0")}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        style={{ ...btnBase, opacity: currentPage >= totalPages ? 0.2 : 1, marginLeft: "16px" }}
        onMouseEnter={(e) => { if (currentPage < totalPages) (e.currentTarget as HTMLButtonElement).style.color = "#0c0c0c"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(10,10,10,0.3)"; }}
      >
        Next →
      </button>
    </nav>
  );
}
