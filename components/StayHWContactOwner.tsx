"use client";

import { useEffect, useRef, useState } from "react";
import { addDays, todayLA } from "@/lib/stayhw-calendar";
import { StayHWRangeCalendar } from "@/components/StayHWRangeCalendar";
import { StayHWGuestPicker } from "@/components/StayHWGuestPicker";

function shortDate(date: string): string {
  return `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}/${date.slice(0, 4)}`;
}

// StayHW's "Contact the owner" modal: the same fields, sent through the same
// StayHW form (via /api/stayhw/contact). Opens with the card's dates and guests.
export function StayHWContactOwner({ unitId, unitName, maxGuests, initialCheckIn, initialCheckOut, initialGuests, onClose }: {
  unitId: number; unitName: string; maxGuests: number;
  initialCheckIn: string; initialCheckOut: string; initialGuests: number;
  onClose: () => void;
}) {
  const [checkIn, setCheckIn] = useState(initialCheckOut ? initialCheckIn : "");
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const today = todayLA();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeRef.current(); };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    firstField.current?.focus();
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", onKey); };
  }, []);

  // StayHW closes its modal two seconds after confirming.
  useEffect(() => {
    if (!confirmation) return;
    const timer = setTimeout(() => closeRef.current(), 2500);
    return () => clearTimeout(timer);
  }, [confirmation]);

  function pick(date: string) {
    if (!checkIn || checkOut || date <= checkIn) { setCheckIn(date); setCheckOut(""); return; }
    setCheckOut(date); setCalendarOpen(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (checkIn && !checkOut) { setError("Choose your check-out date, or clear the dates."); setCalendarOpen(true); return; }
    setSending(true); setError(null);
    try {
      const response = await fetch("/api/stayhw/contact", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ unitId, name: form.get("name"), email: form.get("email"), phone: form.get("phone"), message: form.get("message"), checkIn, checkOut, guests }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Your message could not be sent. Please try again later.");
      setConfirmation(body.confirmation || "Your message was sent to the owner.");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Your message could not be sent. Please try again later."); }
    finally { setSending(false); }
  }

  const input = "w-full rounded-xl border border-ink/25 bg-paper px-3.5 py-3 text-[14px] outline-none transition-colors placeholder:text-ink/40 focus:border-pine";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="contact-owner-title" className="dp-pop relative w-full max-w-md rounded-3xl border border-line bg-paper-dim p-6 shadow-[0_24px_70px_rgba(0,0,0,0.7)] sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-xl text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink">×</button>
        <h2 id="contact-owner-title" className="font-display text-2xl">Contact the owner</h2>
        <p className="mt-1.5 text-[13px] text-ink/60">Please complete the form below to contact the owner of {unitName}.</p>

        {confirmation
          ? <div role="status" className="sk-in mt-6 flex items-start gap-3 rounded-2xl border border-pine/40 bg-pine/10 p-4 text-[14px]">
              <svg viewBox="0 0 16 16" aria-hidden className="mt-0.5 size-4 shrink-0 fill-none stroke-current text-pine" strokeWidth="2"><path d="m2.5 8.5 3.5 3.5 7.5-8" /></svg>
              <p>{confirmation}</p>
            </div>
          : <form onSubmit={submit} className="mt-6 space-y-3">
              <input ref={firstField} name="name" required maxLength={200} autoComplete="name" placeholder="Your Name" aria-label="Your name" className={input} />
              <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="Your Email" aria-label="Your email" className={input} />
              <input name="phone" type="tel" required maxLength={30} autoComplete="tel" placeholder="Your Phone" aria-label="Your phone" className={input} />
              <div className="rounded-xl border border-ink/25">
                <button type="button" onClick={() => setCalendarOpen((open) => !open)} aria-expanded={calendarOpen} className="grid w-full grid-cols-2 text-left">
                  <span className="border-r border-ink/25 px-3.5 py-2.5"><span className="block text-[10px] font-bold uppercase tracking-wide">Check-In</span><span className={`text-[14px] ${checkIn ? "" : "text-ink/40"}`}>{checkIn ? shortDate(checkIn) : "Add date"}</span></span>
                  <span className="px-3.5 py-2.5"><span className="block text-[10px] font-bold uppercase tracking-wide">Check-Out</span><span className={`text-[14px] ${checkOut ? "" : "text-ink/40"}`}>{checkOut ? shortDate(checkOut) : "Add date"}</span></span>
                </button>
                {calendarOpen && <div className="dp-pop border-t border-ink/25 p-3">
                  <StayHWRangeCalendar months={1} checkIn={checkIn} checkOut={checkOut} onPick={pick} isUnavailable={() => false} minDate={today} maxDate={addDays(today, 365)} />
                  {checkIn && <p className="mt-1 text-right text-[12px] text-ink/55"><button type="button" onClick={() => { setCheckIn(""); setCheckOut(""); }} className="underline">Clear dates</button></p>}
                </div>}
                <div className="border-t border-ink/25 px-3.5 py-2.5">
                  <StayHWGuestPicker variant="sidebar" label="Guests" max={maxGuests} value={guests} onChange={setGuests} />
                </div>
              </div>
              <textarea name="message" required maxLength={5000} rows={4} placeholder="Your message" aria-label="Your message" className={`${input} resize-y`} />
              {error && <p role="alert" className="rounded-lg bg-ink/5 px-3 py-2.5 text-[13px] text-ink/80">{error}</p>}
              <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pine to-pine-deep py-3.5 text-[15px] font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-70">
                {sending && <span aria-hidden className="dp-spin size-4 rounded-full border-2 border-white/40 border-t-white" />}
                {sending ? "Sending Request…" : "Send Request"}
              </button>
            </form>}
      </div>
    </div>
  );
}
