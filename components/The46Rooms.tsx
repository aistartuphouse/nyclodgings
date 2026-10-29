"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { The46Room } from "@/lib/the46";
import { formatDate, formatMoney } from "@/lib/format";

// Every real room at The 46, floor by floor, top floor first like the
// building itself. Filters: room type, and whether to show rooms that are
// held with no free date yet.
export function The46Rooms({
  rooms,
  types,
  source,
}: {
  rooms: The46Room[];
  types: { slug: string; name: string }[];
  source?: string | null;
}) {
  const [type, setType] = useState<string | null>(null);
  const [showTaken, setShowTaken] = useState(false);

  const visible = rooms.filter((r) => (!type || r.typeSlug === type) && (showTaken || r.status !== "taken"));
  const floors = useMemo(
    () => [...new Set(visible.map((r) => r.floor))].sort((a, b) => b - a),
    [visible],
  );
  const freeNow = rooms.filter((r) => r.status === "available").length;
  const takenCount = rooms.filter((r) => (!type || r.typeSlug === type) && r.status === "taken").length;

  const applyHref = (r: The46Room) =>
    `/apply?room=${r.typeSlug}&unit=${r.number}${source ? `&ref=${encodeURIComponent(source)}` : ""}`;

  const chip = (active: boolean) =>
    `font-mono text-[11px] tracking-[0.14em] uppercase px-3 py-2 border transition-colors ${
      active ? "bg-pine border-pine text-paper" : "border-line text-ink/65 hover:border-pine hover:text-pine"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={chip(type === null)} aria-pressed={type === null} onClick={() => setType(null)}>
          All types
        </button>
        {types.map((t) => (
          <button
            key={t.slug}
            type="button"
            className={chip(type === t.slug)}
            aria-pressed={type === t.slug}
            onClick={() => setType(t.slug)}
          >
            {t.name}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 font-mono text-[12px] text-ink/60 cursor-pointer">
          <input
            type="checkbox"
            checked={showTaken}
            onChange={(e) => setShowTaken(e.target.checked)}
            className="size-4 accent-teal-dim"
          />
          Show taken rooms{takenCount ? ` (${takenCount})` : ""}
        </label>
      </div>
      <p className="mt-3 font-mono text-[12px] text-ink/50">
        {freeNow} of {rooms.length} rooms free now · {visible.length} shown
      </p>

      {floors.length === 0 && (
        <p className="mt-8 border border-line bg-sand p-6 text-[15px] text-ink/70">
          No room of this type is free right now. Send a request anyway and the
          housing team will tell you when one opens up.
        </p>
      )}

      <div className="mt-6 space-y-8">
        {floors.map((floor) => (
          <section key={floor} aria-label={`Floor ${floor}`}>
            <h3 className="font-mono text-[11px] tracking-[0.22em] uppercase text-teal border-b border-line pb-2">
              Floor {floor}
            </h3>
            <div className="mt-4 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {visible
                .filter((r) => r.floor === floor)
                .map((r) => (
                  <article key={r.number} className="group border border-line bg-sand flex flex-col overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden bg-paper-dim">
                      {r.photo && (
                        // Signed URLs from the 46's private bucket; served as is.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.photo.url}
                          alt={r.photo.alt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      )}
                      <span
                        className={`absolute top-2.5 left-2.5 font-mono text-[10px] tracking-[0.14em] uppercase px-2 py-1 ${
                          r.status === "available"
                            ? "bg-pine text-paper"
                            : r.status === "upcoming"
                              ? "bg-paper/85 text-ink"
                              : "bg-ink/75 text-paper"
                        }`}
                      >
                        {r.status === "available"
                          ? "Available now"
                          : r.status === "upcoming"
                            ? `From ${formatDate(r.availableFrom!)}`
                            : "Taken"}
                      </span>
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col gap-2 grow">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                        <h4 className="font-display text-lg sm:text-xl">Room {r.number}</h4>
                        <p className="font-mono text-[13px] whitespace-nowrap">
                          {formatMoney(r.weeklyCents)}
                          <span className="text-ink/45 text-[11px]"> /week</span>
                        </p>
                      </div>
                      <p className="font-mono text-[11px] tracking-wide text-ink/50">
                        {r.typeName} · Floor {r.floor}
                      </p>
                      {r.status !== "taken" && (
                        <Link
                          href={applyHref(r)}
                          aria-label={`Request room ${r.number}`}
                          className="mt-auto pt-2 font-mono text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-pine hover:text-pine-deep"
                        >
                          Request &rarr;
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
