"use client";

import { useState } from "react";
import { addDays, todayLA } from "@/lib/stayhw-calendar";
import { formatDate } from "@/lib/format";

function monthStart(date: string): string { return `${date.slice(0, 7)}-01`; }
function shiftMonth(month: string, by: number): string { return monthStart(addDays(month, by > 0 ? 32 : -1)); }

// Range picker behaving like StayHW's: the first click sets check-in, moving
// the pointer previews the stay, the second click sets check-out. A click on
// or before check-in, or once a range exists, starts over. Weeks start Monday.
export function StayHWRangeCalendar({ checkIn, checkOut, onPick, isUnavailable, minDate, maxDate, months = 2, dayNote }: {
  checkIn: string; checkOut: string;
  onPick: (date: string) => void;
  isUnavailable: (date: string) => boolean;
  minDate: string; maxDate: string;
  months?: 1 | 2;
  dayNote?: (date: string) => string | null; // extra words for screen readers, e.g. the nightly price
}) {
  const [month, setMonth] = useState(monthStart(checkIn || minDate));
  const [travel, setTravel] = useState<"next" | "prev" | null>(null);
  const [hover, setHover] = useState("");
  const today = todayLA();
  const previewEnd = checkIn && !checkOut && hover > checkIn ? hover : checkOut;
  const canGoBack = month > monthStart(minDate);
  // Phones show one month, so the last month must be reachable as the first pane.
  const canGoForward = month < monthStart(maxDate);
  const go = (by: 1 | -1) => { setTravel(by > 0 ? "next" : "prev"); setMonth(shiftMonth(month, by)); };

  const grid = (first: string, position: number) => {
    const lead = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7;
    const days = Array.from({ length: 42 }, (_, i) => addDays(first, i - lead));
    const title = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${first}T12:00:00Z`));
    return (
      // The key replays the slide whenever the month changes.
      <div key={first} className={`${travel === "next" ? "dp-next" : travel === "prev" ? "dp-prev" : ""} ${position === 1 ? "hidden sm:block" : ""}`}>
        <p className="mb-3 text-center text-[14px] font-medium" aria-live={position === 0 ? "polite" : undefined}>{title}</p>
        <div className="grid grid-cols-7">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => <span key={day} className="pb-2 text-center text-[11px] font-semibold text-ink/50">{day}</span>)}
          {days.map((date) => {
            if (date.slice(0, 7) !== first.slice(0, 7)) return <span key={date} aria-hidden className="grid h-10 place-items-center text-[13px] text-ink/15">{Number(date.slice(-2))}</span>;
            const unavailable = date < minDate || date > maxDate || isUnavailable(date);
            const isStart = date === checkIn, isEnd = !!previewEnd && date === previewEnd;
            const inRange = !!checkIn && !!previewEnd && date > checkIn && date < previewEnd;
            // The band runs edge to edge through the range and half-way under its two ends.
            const band = inRange ? "inset-x-0" : isStart && previewEnd ? "left-1/2 right-0" : isEnd && checkIn ? "left-0 right-1/2" : "";
            const note = dayNote?.(date);
            return (
              <div key={date} className="relative grid h-10 place-items-center">
                {band && <span aria-hidden className={`absolute inset-y-1 ${band} bg-pine/20 transition-colors duration-150`} />}
                <button type="button" disabled={unavailable} aria-pressed={isStart || date === checkOut}
                  aria-label={`${formatDate(date)}${unavailable ? ", unavailable" : note ? `, ${note}` : ""}`}
                  onClick={() => onPick(date)} onMouseEnter={() => setHover(date)} onFocus={() => setHover(date)}
                  className={`relative grid size-9 place-items-center rounded-full text-[13px] transition-[background-color,color,transform,box-shadow] duration-150 ${isStart || isEnd ? "scale-105 bg-pine font-semibold text-white shadow-md" : unavailable ? "text-ink/25 line-through" : "hover:bg-ink/15 active:scale-90"} ${date === today && !isStart && !isEnd ? "ring-1 ring-pine" : ""}`}>
                  {Number(date.slice(-2))}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" onMouseLeave={() => setHover("")}>
      <button type="button" aria-label="Previous month" disabled={!canGoBack} onClick={() => go(-1)} className="absolute left-0 top-[-6px] z-10 grid size-9 place-items-center rounded-full text-lg transition-colors hover:bg-ink/10 disabled:opacity-20">‹</button>
      <button type="button" aria-label="Next month" disabled={!canGoForward} onClick={() => go(1)} className="absolute right-0 top-[-6px] z-10 grid size-9 place-items-center rounded-full text-lg transition-colors hover:bg-ink/10 disabled:opacity-20">›</button>
      <div className={`grid gap-8 overflow-hidden ${months === 2 ? "sm:grid-cols-2" : ""}`}>
        {grid(month, 0)}
        {months === 2 && grid(shiftMonth(month, 1), 1)}
      </div>
    </div>
  );
}
