import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-16">
      <div>
        {subtitle && (
          <p className="text-[10px] tracking-[4px] uppercase text-[#888] mb-3 font-[family-name:var(--font-sans)]">
            {subtitle}
          </p>
        )}
        <h2 className="font-[family-name:var(--font-heading)] text-[clamp(32px,4vw,52px)] tracking-[-1.5px] leading-none text-[#0c0c0c]">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group flex items-center gap-2 text-[11px] tracking-[2px] uppercase text-[#0c0c0c]/50 hover:text-[#0c0c0c] transition-colors duration-200 font-[family-name:var(--font-sans)]"
        >
          {linkLabel || "View All"}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}
