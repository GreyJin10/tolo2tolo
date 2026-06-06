export function ProductCardSkeleton() {
  return (
    <div className="group relative overflow-hidden">
      <div className="aspect-[3/4] skeleton-shimmer" />
      <div className="pt-4 pb-5 bg-[#f5f4f0] space-y-2.5">
        <div className="h-5 w-3/4 skeleton-shimmer rounded" />
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full skeleton-shimmer" />
          <div className="w-2 h-2 rounded-full skeleton-shimmer" />
          <div className="w-2 h-2 rounded-full skeleton-shimmer" />
        </div>
        <div className="w-6 h-px bg-[#0a0a0a]/12 my-2" />
        <div className="h-4 w-20 skeleton-shimmer rounded" />
      </div>
    </div>
  );
}
