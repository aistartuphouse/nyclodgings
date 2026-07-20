"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createBooking, fetchQuote, type PaymentMethod, type Quote } from "@/lib/api";
import { BUILDINGS, type BuildingContent, type BuildingSlug } from "@/lib/buildings";
import { addDays, MOVE_IN_DEADLINE, todayNY } from "@/lib/format";
import { QuoteReceipt } from "./QuoteReceipt";

type Slug = BuildingSlug;

export function BookingForm({
  initialBuilding,
  source,
  lockBuilding = false,
}: {
  initialBuilding: Slug;
  source?: string | null;
  lockBuilding?: boolean;
}) {
  const [slug, setSlug] = useState<Slug>(initialBuilding);
  const building: BuildingContent = BUILDINGS[slug];

  const today = useMemo(() => todayNY(), []);
  const [moveIn, setMoveIn] = useState("");
  const [moveOut, setMoveOut] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const requestSeq = useRef(0);

  const refreshQuote = useCallback(
    async (b: Slug, mi: string, mo: string) => {
      if (!mi || !mo) {
        setQuote(null);
        setQuoteError(null);
        return;
      }
      const seq = ++requestSeq.current;
      setPending(true);
      const result = await fetchQuote(b, mi, mo).catch(() => ({
        error: { error: "network", message: "Could not reach the booking service. Try again." },
      }));
      if (seq !== requestSeq.current) return; // stale response
      setPending(false);
      if ("error" in result) {
        setQuote(null);
        setQuoteError(result.error.message ?? "That stay is not bookable.");
      } else {
        setQuote(result.quote);
        setQuoteError(null);
      }
    },
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => refreshQuote(slug, moveIn, moveOut), 250);
    return () => clearTimeout(t);
  }, [slug, moveIn, moveOut, refreshQuote]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!quote) return;
    setSubmitting(true);
    setSubmitError(null);
    const result = await createBooking({
      building: slug,
      moveIn,
      moveOut,
      name,
      email,
      phone,
      notes,
      source,
      paymentMethod,
    }).catch(() => ({ error: { error: "network" } }));
    if ("error" in result) {
      setSubmitting(false);
      setSubmitError(
        result.error.error === "payment_unavailable"
          ? "Payment is temporarily unavailable. Nothing was charged; please try again in a few minutes."
          : "Something in the form needs attention. Check the fields and try again.",
      );
      return;
    }
    // Hand off to Stripe Checkout. Keep `submitting` true so the button
    // stays disabled during the redirect.
    window.location.assign(result.checkoutUrl);
  }

  const inputCls =
    "w-full border border-line bg-sand px-3.5 py-2.5 text-[15px] placeholder:text-mist focus:border-teal-dim";
  const labelCls = "font-mono text-[11px] tracking-[0.18em] uppercase text-ink/55";

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-7">
        {!lockBuilding && (
          <fieldset>
            <legend className={labelCls}>Building</legend>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(["seton", "stratford", "mansfield"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlug(s)}
                  aria-pressed={slug === s}
                  className={`border px-4 py-3 text-left transition-colors ${
                    slug === s
                      ? "border-pine bg-pine text-paper"
                      : "border-line bg-sand hover:border-pine/50"
                  }`}
                >
                  <span className="block font-display text-lg">{BUILDINGS[s].name}</span>
                  <span className={`block font-mono text-[11px] tracking-wide mt-0.5 ${slug === s ? "text-paper/70" : "text-ink/50"}`}>
                    {BUILDINGS[s].tagline}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="move-in" className={labelCls}>
              Move-in
            </label>
            <input
              id="move-in"
              type="date"
              required
              min={today}
              max={MOVE_IN_DEADLINE}
              value={moveIn}
              onChange={(e) => {
                setMoveIn(e.target.value);
                if (moveOut && e.target.value && moveOut < addDays(e.target.value, 30)) {
                  setMoveOut("");
                }
              }}
              className={`${inputCls} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="move-out" className={labelCls}>
              Move-out
            </label>
            <input
              id="move-out"
              type="date"
              required
              min={moveIn ? addDays(moveIn, 30) : addDays(today, 30)}
              value={moveOut}
              onChange={(e) => setMoveOut(e.target.value)}
              className={`${inputCls} mt-2`}
            />
          </div>
        </div>
        <p className="font-mono text-[11px] tracking-wide text-ink/50 -mt-4">
          Minimum stay 30 nights. Last possible move-in is September 10, 2026.
          Move-out is up to you.
        </p>
        {quoteError && (
          <p className="border border-pine/30 bg-pine/5 px-4 py-3 text-[14px] text-pine" role="alert">
            {quoteError}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="g-name" className={labelCls}>Full name</label>
            <input id="g-name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className={`${inputCls} mt-2`} placeholder="As it appears on your ID" autoComplete="name" />
          </div>
          <div>
            <label htmlFor="g-email" className={labelCls}>Email</label>
            <input id="g-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mt-2`} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="g-phone" className={labelCls}>Phone</label>
            <input id="g-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputCls} mt-2`} placeholder="+1" autoComplete="tel" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="g-notes" className={labelCls}>Notes (optional)</label>
            <textarea id="g-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputCls} mt-2 resize-y`} placeholder="Anything the housing team should know" />
          </div>
        </div>
        <fieldset>
          <legend className={labelCls}>Payment method</legend>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(
              [
                {
                  value: "card" as const,
                  title: "Card",
                  detail: "Any card works. Adds a processing fee, shown in the summary.",
                },
                {
                  value: "ach" as const,
                  title: "US bank transfer (ACH)",
                  detail: "No card fee. Needs a US bank account; takes a few business days to settle.",
                },
              ]
            ).map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setPaymentMethod(m.value)}
                aria-pressed={paymentMethod === m.value}
                className={`border px-4 py-3 text-left transition-colors ${
                  paymentMethod === m.value
                    ? "border-pine bg-pine text-paper"
                    : "border-line bg-sand hover:border-pine/50"
                }`}
              >
                <span className="block text-[15px] font-medium">{m.title}</span>
                <span className={`block text-[12px] leading-5 mt-0.5 ${paymentMethod === m.value ? "text-paper/75" : "text-ink/55"}`}>
                  {m.detail}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Honeypot, hidden from real users. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      </div>

      <div className="space-y-4 lg:sticky lg:top-8 self-start">
        <QuoteReceipt
          quote={quote}
          moveIn={moveIn}
          moveOut={moveOut}
          buildingName={building.name}
          pending={pending}
          paymentMethod={paymentMethod}
        />
        {submitError && (
          <p className="border border-pine/30 bg-pine/5 px-4 py-3 text-[14px] text-pine" role="alert">
            {submitError}
          </p>
        )}
        <button
          type="submit"
          disabled={!quote || submitting || pending}
          className="w-full bg-pine text-paper font-mono text-[13px] tracking-[0.18em] uppercase py-4 transition-colors hover:bg-pine-deep disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Opening secure checkout" : "Pay and book"}
        </button>
        <p className="text-[12px] leading-5 text-ink/55 text-center">
          You are redirected to Stripe for payment. Your room is confirmed the
          moment payment completes.
        </p>
      </div>
    </form>
  );
}
