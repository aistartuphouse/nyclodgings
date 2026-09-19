"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { StayHWCalendar, StayHWQuote, StayHWUnitDetail } from "@/lib/stayhw-types";
import { addDays, stayError, stayHWCheckoutUrl, staySearchQuery, todayLA, type StaySearch } from "@/lib/stayhw-calendar";
import { StayHWRangeCalendar } from "@/components/StayHWRangeCalendar";
import { StayHWGuestPicker } from "@/components/StayHWGuestPicker";
import { StayHWContactOwner } from "@/components/StayHWContactOwner";
import { StayHWImage } from "@/components/StayHWImage";
import { PriceBreakdownSkeleton, Sk } from "@/components/StayHWSkeletons";
import { Heart, useSavedUnits } from "@/lib/stayhw-saved";
import { formatMoney } from "@/lib/format";

function shortDate(date: string): string {
  return `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}/${date.slice(0, 4)}`;
}

function Lightbox({ photos, name, onClose }: { photos: string[]; name: string; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeButton.current?.focus();
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", onKey); };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={`Photos of ${name}`} className="fixed inset-0 z-50 overflow-y-auto bg-paper">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-paper/90 px-5 py-4 backdrop-blur sm:px-10">
        <button ref={closeButton} type="button" onClick={onClose} className="rounded-full px-4 py-2 text-[14px] font-medium hover:bg-ink/10">‹ Back</button>
        <p className="text-[13px] text-ink/55">{photos.length} photos</p>
      </div>
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-5 pb-16 sm:px-10">
        {photos.map((src, i) => <div key={src} className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-paper-dim"><StayHWImage src={src} alt={`${name}, photo ${i + 1}`} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /></div>)}
      </div>
    </div>
  );
}

export function StayHWUnitView({ detail, calendar, source, initialSearch }: { detail: StayHWUnitDetail; calendar: StayHWCalendar; source?: string | null; initialSearch: StaySearch }) {
  const { unit } = detail;
  const { saved, toggle } = useSavedUnits();
  const isSaved = saved.has(unit.id);
  const [brokenPhotos, setBrokenPhotos] = useState<ReadonlySet<string>>(new Set());
  const photos = detail.photos.filter((src) => !brokenPhotos.has(src));
  const [lightbox, setLightbox] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [allAmenities, setAllAmenities] = useState(false);
  // Dates and guests chosen in the search bar arrive with the page and are priced straight away.
  const initialGuests = Math.min(Math.max(initialSearch.guests, 1), detail.unit.guests);
  const initialError = initialSearch.checkIn ? stayError(calendar, initialSearch.checkIn, initialSearch.checkOut, initialGuests) : null;
  const [checkIn, setCheckIn] = useState(initialSearch.checkIn);
  const [checkOut, setCheckOut] = useState(initialSearch.checkOut);
  const [guests, setGuests] = useState(initialGuests);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [quote, setQuote] = useState<StayHWQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(!!initialSearch.checkIn && !initialError);
  const [quoteError, setQuoteError] = useState<string | null>(initialError);
  const quoteController = useRef<AbortController | null>(null);

  async function loadQuote(from: string, to: string, guestCount: number) {
    const controller = new AbortController(); quoteController.current = controller;
    try {
      const response = await fetch("/api/stayhw/quote", { method: "POST", signal: controller.signal, headers: { "content-type": "application/json" }, body: JSON.stringify({ unitId: detail.unit.id, checkIn: from, checkOut: to, guests: guestCount }) });
      const body = await response.json();
      if (controller.signal.aborted) return;
      if (response.ok) setQuote(body as StayHWQuote); else setQuoteError(body.error || "Price unavailable. Please try again later.");
    } catch { if (!controller.signal.aborted) setQuoteError("Price unavailable. Please try again later."); }
    finally { if (!controller.signal.aborted) setQuoteLoading(false); }
  }
  const loadInitialQuote = useRef(() => { if (initialSearch.checkIn && !initialError) void loadQuote(initialSearch.checkIn, initialSearch.checkOut, initialGuests); });
  useEffect(() => {
    loadInitialQuote.current();
    return () => quoteController.current?.abort();
  }, []);

  function resetQuote() {
    quoteController.current?.abort();
    setQuote(null); setQuoteError(null); setQuoteLoading(false);
  }
  async function requestQuote(from: string, to: string, guestCount: number) {
    resetQuote();
    const validation = stayError(calendar, from, to, guestCount);
    if (validation) { setQuoteError(validation); return; }
    setQuoteLoading(true);
    await loadQuote(from, to, guestCount);
  }
  function pick(date: string) {
    if (!checkIn || checkOut || date <= checkIn) { resetQuote(); setCheckIn(date); setCheckOut(""); return; }
    setCheckOut(date); setCalendarOpen(false);
    void requestQuote(checkIn, date, guests);
  }

  const today = todayLA();
  const priced = Object.keys(calendar.prices).sort();
  const firstDate = priced.find((date) => date >= today) ?? today;
  const finalDate = priced.at(-1) ?? firstDate;
  const blocked = new Set(calendar.blockedDates);
  // A reserved night can still be the check-out day once arrival is chosen.
  const isUnavailable = (date: string) => {
    const free = date in calendar.prices && !blocked.has(date);
    const checkoutOnly = !!checkIn && !checkOut && date > checkIn && !blocked.has(addDays(date, -1)) && addDays(date, -1) in calendar.prices;
    return !free && !checkoutOnly;
  };

  const mosaic = photos.length >= 5;
  const tile = (src: string, i: number, className: string, sizes: string) => (
    <button type="button" key={src} onClick={() => setLightbox(true)} aria-label={`Open photos of ${unit.name}`} className={`group relative overflow-hidden bg-paper-dim ${className}`}>
      <StayHWImage src={src} alt={`${unit.name}, photo ${i + 1}`} fill priority={i === 0} loading={i === 0 ? undefined : "eager"} sizes={sizes} onError={() => setBrokenPhotos((broken) => new Set(broken).add(src))} className="object-cover transition duration-300 group-hover:brightness-90" />
    </button>
  );
  const facts = [`${unit.guests} guests`, `${unit.bedrooms} bedroom${unit.bedrooms === 1 ? "" : "s"}`, detail.bathrooms ? `${detail.bathrooms} bath${detail.bathrooms === 1 ? "" : "s"}` : null].filter(Boolean).join(" · ");
  const amenityItems = detail.amenities.flatMap((group) => group.items);
  const applyParams = new URLSearchParams({ building: "stayhw", room: `stayhw-${unit.id}`, moveIn: checkIn, moveOut: checkOut, guests: String(guests) });
  if (source) applyParams.set("ref", source);
  // Going back keeps the stay being priced, so the grid stays filtered to it.
  const backHref = `/stayhw${staySearchQuery({ checkIn: checkOut ? checkIn : "", checkOut, guests: checkOut ? guests : initialSearch.guests }, source)}`;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-10">
      <Link href={backHref} className="text-[13px] text-ink/60 hover:text-ink">‹ All Hollywood condos</Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="font-display text-[clamp(1.5rem,3.2vw,2rem)] leading-tight">{unit.name}</h1>
        <button type="button" onClick={() => toggle(unit.id)} aria-pressed={isSaved} className="group/heart flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[14px] font-medium underline-offset-2 hover:bg-ink/10"><Heart filled={isSaved} className="size-4" />{isSaved ? "Saved" : "Save"}</button>
      </div>

      {photos.length > 0 && <div className="relative mt-5">
        <div className={`overflow-hidden rounded-2xl ${mosaic ? "grid gap-2 md:h-[min(46vw,460px)] md:grid-cols-4 md:grid-rows-2" : ""}`}>
          {tile(photos[0], 0, mosaic ? "aspect-[4/3] w-full md:aspect-auto md:col-span-2 md:row-span-2" : "aspect-[16/9] w-full", "(min-width: 768px) 50vw, 100vw")}
          {mosaic && photos.slice(1, 5).map((src, i) => tile(src, i + 1, "hidden md:block", "25vw"))}
        </div>
        <button type="button" onClick={() => setLightbox(true)} className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-[13px] font-medium text-neutral-900 shadow-md hover:bg-neutral-100">
          <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 fill-current"><path d="M1 1h3v3H1zm5.5 0h3v3h-3zM12 1h3v3h-3zM1 6.5h3v3H1zm5.5 0h3v3h-3zm5.5 0h3v3h-3zM1 12h3v3H1zm5.5 0h3v3h-3zm5.5 0h3v3h-3z" /></svg>
          Show all {photos.length} photos
        </button>
      </div>}

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <h2 className="font-display text-[22px]">Entire condo in Hollywood, Los Angeles</h2>
          <p className="mt-1 text-[15px] text-ink/70">{facts}</p>
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-line px-5 py-4">
            <span className="rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold text-neutral-800">Guest favorite</span>
            <p className="text-[14px] text-ink/70">One of the most loved condos at StayHW.</p>
          </div>
          {detail.description.length > 0 && <div className="mt-8 border-t border-line pt-8 space-y-4 text-[15px] leading-relaxed text-ink/80">
            {detail.description.map((paragraph, i) => <p key={i} className="whitespace-pre-line">{paragraph}</p>)}
          </div>}
          {amenityItems.length > 0 && <div className="mt-8 border-t border-line pt-8">
            <h2 className="font-display text-[22px]">What this place offers</h2>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 text-[15px] text-ink/80">
              {(allAmenities ? amenityItems : amenityItems.slice(0, 10)).map((item) => <li key={item} className="flex items-center gap-3"><svg viewBox="0 0 16 16" aria-hidden className="size-4 shrink-0 fill-none stroke-current text-pine" strokeWidth="2"><path d="m2.5 8.5 3.5 3.5 7.5-8" /></svg>{item}</li>)}
            </ul>
            {!allAmenities && amenityItems.length > 10 && <button type="button" onClick={() => setAllAmenities(true)} className="mt-6 rounded-lg border border-ink/60 px-5 py-3 text-[14px] font-medium hover:bg-ink/10">Show all {amenityItems.length} amenities</button>}
          </div>}
          {(detail.checkInHour || detail.checkOutHour) && <div className="mt-8 border-t border-line pt-8">
            <h2 className="font-display text-[22px]">Things to know</h2>
            <dl className="mt-4 grid gap-2 text-[15px] text-ink/80 sm:grid-cols-2">
              {detail.checkInHour && <div><dt className="inline text-ink/55">Check-in after </dt><dd className="inline">{detail.checkInHour}</dd></div>}
              {detail.checkOutHour && <div><dt className="inline text-ink/55">Checkout before </dt><dd className="inline">{detail.checkOutHour}</dd></div>}
            </dl>
          </div>}
        </div>

        <aside className="lg:sticky lg:top-6 self-start">
          <div className="rounded-2xl border border-line bg-sand p-6 shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
            <h2 className="font-display text-[22px]">Book Now</h2>
            <p className="mt-1 text-[15px] text-ink/70" aria-live="polite">
              {quote ? <><span className="text-[22px] font-semibold text-ink underline">{formatMoney(quote.totalCents)}</span> for {quote.nights} night{quote.nights === 1 ? "" : "s"}</>
                : quoteLoading ? <span role="status" aria-label="Calculating price" className="flex items-center gap-2"><Sk className="h-7 w-28" /><Sk className="h-4 w-20" /></span>
                : <><span className="text-[22px] font-semibold text-ink">From {formatMoney(unit.fromCents)}</span> night</>}
            </p>
            <div className="mt-5 rounded-xl border border-ink/40">
              <button type="button" onClick={() => setCalendarOpen((open) => !open)} aria-expanded={calendarOpen} className="grid w-full grid-cols-2 text-left">
                <span className="border-r border-ink/40 px-3 py-2.5"><span className="block text-[10px] font-bold uppercase tracking-wide">Check-in</span><span className={`text-[14px] ${checkIn ? "" : "text-ink/50"}`}>{checkIn ? shortDate(checkIn) : "Add date"}</span></span>
                <span className="px-3 py-2.5"><span className="block text-[10px] font-bold uppercase tracking-wide">Checkout</span><span className={`text-[14px] ${checkOut ? "" : "text-ink/50"}`}>{checkOut ? shortDate(checkOut) : "Add date"}</span></span>
              </button>
              {calendarOpen && <div className="dp-pop border-t border-ink/40 p-3">
                <StayHWRangeCalendar months={1} checkIn={checkIn} checkOut={checkOut} onPick={pick} isUnavailable={isUnavailable} minDate={firstDate} maxDate={addDays(finalDate, 1)} dayNote={(date) => date in calendar.prices && !blocked.has(date) ? `${formatMoney(calendar.prices[date])} per night` : "check-out only"} />
                <div className="mt-2 flex items-center justify-between text-[12px] text-ink/55">
                  <span>{!checkIn ? "Select check-in" : !checkOut ? "Select checkout" : ""}</span>
                  {checkIn && <button type="button" onClick={() => { resetQuote(); setCheckIn(""); setCheckOut(""); }} className="underline">Clear dates</button>}
                </div>
              </div>}
              <div className="border-t border-ink/40 px-3 py-2.5">
                <StayHWGuestPicker variant="sidebar" label="Guests" max={unit.guests} value={guests} onChange={(count) => { setGuests(count); if (checkIn && checkOut) void requestQuote(checkIn, checkOut, count); }} />
              </div>
            </div>
            {quoteError && <p role="alert" className="mt-3 rounded-lg bg-ink/5 px-3 py-2.5 text-[13px] text-ink/80">{quoteError}</p>}
            {quoteLoading && <PriceBreakdownSkeleton />}
            {quote && <dl className="sk-in mt-5 space-y-2.5 border-t border-line pt-5 text-[14px]">
              {([[`${quote.nights} night${quote.nights === 1 ? "" : "s"}`, quote.rentCents], ["Cleaning fee", quote.cleaningCents], ["Extra guests", quote.extraGuestCents], ["Taxes", quote.taxCents]] as [string, number][]).filter(([, cents]) => cents > 0).map(([label, cents]) => <div key={label} className="flex justify-between gap-4"><dt className="text-ink/65">{label}</dt><dd>{formatMoney(cents)}</dd></div>)}
              <div className="flex justify-between gap-4 border-t border-line pt-3 font-semibold"><dt>Total</dt><dd>{formatMoney(quote.totalCents)}</dd></div>
              {quote.depositCents > 0 && <>
                <div className="flex justify-between gap-4 text-pine"><dt>Deposit, due at checkout</dt><dd>{formatMoney(quote.depositCents)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink/65">Balance</dt><dd>{formatMoney(quote.balanceCents)}</dd></div>
              </>}
            </dl>}
            {/* StayHW's checkout is a cart in the guest's own session on stayhw.com,
                so Instant Booking continues there with this stay already filled in. */}
            {quote
              ? <a href={stayHWCheckoutUrl(unit.slug, checkIn, checkOut, guests)} className="mt-5 block rounded-full bg-gradient-to-r from-pine to-pine-deep py-3.5 text-center text-[16px] font-semibold text-white transition-[filter] hover:brightness-110">Instant Booking</a>
              : <button type="button" disabled={quoteLoading} onClick={() => setCalendarOpen(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pine to-pine-deep py-3.5 text-[16px] font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-70">
                  {quoteLoading && <span aria-hidden className="dp-spin size-4 rounded-full border-2 border-white/40 border-t-white" />}
                  {quoteLoading ? "Checking…" : "Instant Booking"}
                </button>}
            <p className="mt-3 text-center text-[13px] text-ink/60">{quote ? "You finish and pay on StayHW's secure checkout" : "Choose your dates to see the price"}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {detail.airbnbUrl
                ? <a href={detail.airbnbUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border border-ink/30 py-3 text-[13px] font-semibold transition-colors hover:border-pine hover:text-pine">
                    <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3 7 9" /></svg>
                    Book at Airbnb
                  </a>
                : <span />}
              <button type="button" onClick={() => setContactOpen(true)} className={`rounded-full border border-ink/30 py-3 text-[13px] font-semibold transition-colors hover:border-pine hover:text-pine ${detail.airbnbUrl ? "" : "col-span-2"}`}>Contact Owner</button>
            </div>
          </div>
          <p className="mt-4 px-2 text-center text-[12px] leading-relaxed text-ink/45">Prefer the housing team to arrange it? <Link href={`/apply?${applyParams}`} className="underline hover:text-ink">Send a request instead</Link>.</p>
        </aside>
      </div>
      {contactOpen && <StayHWContactOwner unitId={unit.id} unitName={unit.name} maxGuests={unit.guests} initialCheckIn={checkIn} initialCheckOut={checkOut} initialGuests={guests} onClose={() => setContactOpen(false)} />}
      {lightbox && <Lightbox photos={photos} name={unit.name} onClose={() => setLightbox(false)} />}
    </div>
  );
}
