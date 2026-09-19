// Skeleton shapes for the StayHW pages. Each mirrors the layout it stands in
// for, so content lands without shifting. `.sk` (globals.css) is the shimmer.

export function Sk({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`sk block ${className}`} />;
}

export function UnitCardSkeleton() {
  return (
    <div aria-hidden>
      <Sk className="aspect-square w-full !rounded-2xl" />
      <Sk className="mt-3 h-4 w-3/4" />
      <Sk className="mt-2 h-3.5 w-1/2" />
      <Sk className="mt-2 h-3.5 w-2/5" />
    </div>
  );
}

export function UnitGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading condos" className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => <UnitCardSkeleton key={i} />)}
    </div>
  );
}

export function SearchBarSkeleton() {
  return <Sk className="mx-auto h-[58px] w-full max-w-3xl !rounded-2xl" />;
}

export function PriceBreakdownSkeleton() {
  return (
    <div role="status" aria-label="Calculating price" className="mt-5 space-y-3 border-t border-line pt-5">
      {[0, 1, 2].map((row) => <div key={row} className="flex justify-between gap-4"><Sk className="h-4 w-24" /><Sk className="h-4 w-14" /></div>)}
      <div className="flex justify-between gap-4 border-t border-line pt-3"><Sk className="h-5 w-16" /><Sk className="h-5 w-20" /></div>
    </div>
  );
}

export function UnitPageSkeleton() {
  return (
    <div role="status" aria-label="Loading condo" className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-10">
      <Sk className="h-4 w-40" />
      <div className="mt-4 flex items-center justify-between gap-4"><Sk className="h-8 w-72 max-w-[70%]" /><Sk className="h-8 w-20 !rounded-full" /></div>
      <div className="mt-5 grid gap-2 overflow-hidden rounded-2xl md:h-[min(46vw,460px)] md:grid-cols-4 md:grid-rows-2">
        <Sk className="aspect-[4/3] w-full !rounded-none md:aspect-auto md:col-span-2 md:row-span-2" />
        {[0, 1, 2, 3].map((tile) => <Sk key={tile} className="hidden !rounded-none md:block" />)}
      </div>
      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <Sk className="h-7 w-80 max-w-full" />
          <Sk className="mt-3 h-4 w-56" />
          <Sk className="mt-6 h-[62px] w-full !rounded-2xl" />
          <div className="mt-8 space-y-3 border-t border-line pt-8">{["w-full", "w-11/12", "w-full", "w-4/5", "w-2/3"].map((width, i) => <Sk key={i} className={`h-4 ${width}`} />)}</div>
          <div className="mt-8 border-t border-line pt-8"><Sk className="h-7 w-64" /><div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">{Array.from({ length: 8 }, (_, i) => <Sk key={i} className="h-4 w-4/5" />)}</div></div>
        </div>
        <div className="self-start rounded-2xl border border-line p-6">
          <Sk className="h-7 w-44" />
          <Sk className="mt-5 h-[104px] w-full !rounded-xl" />
          <Sk className="mt-4 h-[52px] w-full !rounded-full" />
          <Sk className="mx-auto mt-3 h-3.5 w-40" />
        </div>
      </div>
    </div>
  );
}
