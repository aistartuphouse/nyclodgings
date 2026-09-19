"use client";

import { useState } from "react";
import Link from "next/link";
import type { StayHWUnit } from "@/lib/stayhw-types";
import { staySearchQuery } from "@/lib/stayhw-calendar";
import { Heart, useSavedUnits } from "@/lib/stayhw-saved";
import { useStayHWSearch } from "@/components/StayHWSearch";
import { StayHWImage } from "@/components/StayHWImage";
import { UnitGridSkeleton } from "@/components/StayHWSkeletons";
import { formatMoney } from "@/lib/format";

export function StayHWRooms({ initialUnits }: { initialUnits: StayHWUnit[] | null }) {
  const { search, unitIds, loading, error, source, run } = useStayHWSearch();
  const [units, setUnits] = useState(initialUnits);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // StayHW serves a few 0-byte photos. A card whose photo fails moves to the end.
  const [brokenPhotos, setBrokenPhotos] = useState<ReadonlySet<number>>(new Set());
  const { saved, toggle } = useSavedUnits();

  async function loadUnits() {
    setUnitsLoading(true);
    try {
      const response = await fetch("/api/stayhw/units");
      const body = await response.json();
      setUnits(response.ok ? (body.units as StayHWUnit[]) : null);
    } catch { setUnits(null); }
    finally { setUnitsLoading(false); }
  }

  if (unitsLoading || loading) return <div className="mt-10"><UnitGridSkeleton /></div>;
  if (!units) return <div className="mt-8 rounded-2xl bg-sand border border-line p-8"><p role="alert">StayHW&apos;s condos are temporarily unavailable.</p><button type="button" onClick={loadUnits} className="mt-4 text-teal underline">Try again</button><p className="mt-5 text-ink/60 text-sm">You can still <Link href="/apply?building=stayhw" className="text-teal underline">request a StayHW condo</Link>. The team will confirm the available units.</p></div>;
  if (error) return <div className="mt-8 rounded-2xl bg-sand border border-line p-8" role="alert"><p>{error}</p><button type="button" onClick={() => run(search)} className="mt-4 text-teal underline">Try again</button></div>;

  const hasPhoto = (unit: StayHWUnit) => !!unit.image && !brokenPhotos.has(unit.id);
  const available = unitIds ? new Set(unitIds) : null;
  const visible = available ? units.filter((unit) => available.has(unit.id)) : units;
  const ordered = [...visible.filter(hasPhoto), ...visible.filter((unit) => !hasPhoto(unit))];
  const query = staySearchQuery(search, source);
  const filtered = !!available;

  return (
    <div className="sk-in">
      <p className="mt-10 mb-6 text-[13px] text-ink/55" aria-live="polite">
        {visible.length} condo{visible.length === 1 ? "" : "s"}{filtered ? (search.checkIn ? " available for your dates" : ` for ${search.guests}+ guests`) : ""}
      </p>
      <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
        {(expanded || filtered ? ordered : ordered.slice(0, 12)).map((unit) => {
          const isSaved = saved.has(unit.id);
          return <article key={unit.id} className="group relative">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper-dim">
              {hasPhoto(unit) && <StayHWImage src={unit.image!} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" onError={() => setBrokenPhotos((broken) => new Set(broken).add(unit.id))} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold text-neutral-800 shadow-sm">Guest favorite</span>
            </div>
            <h3 className="mt-3 text-[15px] font-medium leading-snug">
              {/* The stretched link makes the whole card open the unit. */}
              <Link href={`/stayhw/${unit.slug}${query}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-pine">{unit.name}</Link>
            </h3>
            <p className="mt-0.5 text-[14px] text-ink/55">{unit.bedrooms} bedroom{unit.bedrooms === 1 ? "" : "s"} · {unit.guests} guests</p>
            <p className="mt-0.5 text-[14px] text-ink/55"><span className="font-medium text-ink">From {formatMoney(unit.fromCents)}</span> night</p>
            <button type="button" onClick={() => toggle(unit.id)} aria-pressed={isSaved} aria-label={`${isSaved ? "Remove" : "Save"} ${unit.name} ${isSaved ? "from" : "to"} favorites`} className="group/heart absolute right-2 top-2 z-10 grid size-10 place-items-center rounded-full transition-transform hover:scale-110"><Heart filled={isSaved} /></button>
          </article>;
        })}
      </div>
      {!visible.length && <p className="mt-2 text-ink/60">No condos are free for that stay. Try other dates or a smaller group.</p>}
      {!expanded && !filtered && ordered.length > 12 && <button type="button" onClick={() => setExpanded(true)} className="mt-10 rounded-full border border-line px-7 py-3.5 text-[14px] font-medium hover:border-ink/60">Show all {ordered.length} condos</button>}
    </div>
  );
}
