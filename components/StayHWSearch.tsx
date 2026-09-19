"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { addDays, MAX_SEARCH_GUESTS, staySearchQuery, todayLA, type StaySearch } from "@/lib/stayhw-calendar";
import { StayHWRangeCalendar } from "@/components/StayHWRangeCalendar";
import { StayHWGuestPicker } from "@/components/StayHWGuestPicker";

const EMPTY: StaySearch = { checkIn: "", checkOut: "", guests: 0 };

interface SearchState {
  search: StaySearch; // the applied search
  unitIds: number[] | null; // null: no filter applied
  loading: boolean;
  error: string | null;
  source: string | null;
  run: (search: StaySearch) => void;
}
const SearchContext = createContext<SearchState | null>(null);

export function useStayHWSearch(): SearchState {
  const state = useContext(SearchContext);
  if (!state) throw new Error("useStayHWSearch must be used inside StayHWSearchProvider");
  return state;
}

// Holds the applied dates and guests for the hero's search bar and the grid below it.
export function StayHWSearchProvider({ initialSearch, initialUnitIds, source, children }: {
  initialSearch: StaySearch; initialUnitIds: number[] | null; source: string | null; children: React.ReactNode;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [unitIds, setUnitIds] = useState(initialUnitIds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  function run(next: StaySearch) {
    controller.current?.abort();
    setSearch(next); setError(null);
    // The address stays shareable and survives a reload; no navigation happens.
    window.history.replaceState(null, "", `/stayhw${staySearchQuery(next, source)}`);
    if (!next.checkIn && !next.guests) { setUnitIds(null); setLoading(false); return; }
    const request = new AbortController(); controller.current = request;
    setLoading(true);
    fetch(`/api/stayhw/search${staySearchQuery(next)}`, { signal: request.signal })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Availability could not be loaded. Please try again later.");
        if (!request.signal.aborted) setUnitIds(body.unitIds as number[]);
      })
      .catch((failure: Error) => { if (!request.signal.aborted) { setUnitIds(null); setError(failure.message); } })
      .finally(() => { if (!request.signal.aborted) setLoading(false); });
  }

  return <SearchContext.Provider value={{ search, unitIds, loading, error, source, run }}>{children}</SearchContext.Provider>;
}

function shortDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

function Icon({ path }: { path: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] shrink-0 fill-none stroke-pine" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>;
}
const CALENDAR_IN = "M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 9h5m-2-2 2 2-2 2";
const CALENDAR_OUT = "M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm10 9h-5m2-2-2 2 2 2";
const GUEST = "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0";

// Check-In | Check-Out | Guests | Search, as on StayHW's home page: one popup
// serves both date fields and closes itself once the stay is chosen.
export function StayHWSearchBar() {
  const { search, loading, run } = useStayHWSearch();
  const [draft, setDraft] = useState(search);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const today = todayLA();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => { if (!bar.current?.contains(event.target as Node)) setOpen(false); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function pick(date: string) {
    if (!draft.checkIn || draft.checkOut || date <= draft.checkIn) { setDraft({ ...draft, checkIn: date, checkOut: "" }); return; }
    setDraft({ ...draft, checkOut: date });
    setOpen(false);
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (draft.checkIn && !draft.checkOut) { setOpen(true); return; }
    setOpen(false);
    run(draft);
  }
  const field = "flex min-w-0 items-center gap-2.5 px-4 py-4 text-left text-[14px] transition-colors hover:bg-ink/5";
  const active = !!(search.checkIn || search.guests);

  return (
    <div ref={bar} className="relative z-30 mx-auto w-full max-w-3xl">
      {/* No overflow-hidden here: the guest field's popup is a descendant of this
          form, and clipping it along with the square field corners would also
          clip the popup. Each corner field rounds itself instead. */}
      <form onSubmit={submit} className="grid grid-cols-2 rounded-2xl border border-pine/60 bg-paper/75 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:grid-cols-[1fr_1fr_1fr_auto]">
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} className={`${field} rounded-tl-2xl border-r border-ink/15 sm:rounded-l-2xl ${open && !draft.checkIn ? "bg-ink/10" : ""}`}>
          <Icon path={CALENDAR_IN} /><span className={`truncate ${draft.checkIn ? "" : "text-ink/55"}`}>{draft.checkIn ? shortDate(draft.checkIn) : "Check-In"}</span>
        </button>
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} className={`${field} rounded-tr-2xl sm:rounded-none sm:border-r sm:border-ink/15 ${open && draft.checkIn && !draft.checkOut ? "bg-ink/10" : ""}`}>
          <Icon path={CALENDAR_OUT} /><span className={`truncate ${draft.checkOut ? "" : "text-ink/55"}`}>{draft.checkOut ? shortDate(draft.checkOut) : "Check-Out"}</span>
        </button>
        <div className={`${field} rounded-bl-2xl border-t border-ink/15 sm:rounded-none sm:border-t-0`}>
          <Icon path={GUEST} />
          <StayHWGuestPicker label="Guests" anyLabel="Guests" max={MAX_SEARCH_GUESTS} value={draft.guests} onChange={(guests) => setDraft({ ...draft, guests })} />
        </div>
        <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 rounded-br-2xl border-t border-ink/15 bg-pine px-8 py-4 text-[14px] font-semibold text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.98] disabled:opacity-80 sm:rounded-r-2xl sm:border-t-0">
          {loading && <span aria-hidden className="dp-spin size-4 rounded-full border-2 border-white/40 border-t-white" />}
          {loading ? "Searching" : "Search"}
        </button>
      </form>

      {open && <div role="dialog" aria-label="Choose your dates" className="dp-pop absolute left-1/2 top-full z-40 mt-2 w-[min(100%,20rem)] -translate-x-1/2 rounded-2xl border border-line bg-paper-dim p-5 shadow-[0_18px_50px_rgba(0,0,0,0.6)] sm:w-[40rem]">
        <StayHWRangeCalendar checkIn={draft.checkIn} checkOut={draft.checkOut} onPick={pick} isUnavailable={() => false} minDate={today} maxDate={addDays(today, 365)} />
        <div className="mt-3 flex items-center justify-between text-[12px] text-ink/55">
          <span aria-live="polite">{!draft.checkIn ? "Select your check-in date" : !draft.checkOut ? "Select your check-out date" : `${shortDate(draft.checkIn)} – ${shortDate(draft.checkOut)}`}</span>
          {draft.checkIn && <button type="button" onClick={() => setDraft({ ...draft, checkIn: "", checkOut: "" })} className="underline hover:text-ink">Clear dates</button>}
        </div>
      </div>}

      {active && !loading && <p className="mt-3 text-center text-[13px] text-ink/70">
        <button type="button" onClick={() => { setDraft(EMPTY); run(EMPTY); }} className="underline hover:text-ink">Clear search</button>
      </p>}
    </div>
  );
}
