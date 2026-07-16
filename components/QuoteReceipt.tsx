"use client";

// The live stay summary: a cost breakdown that recomputes from the backend
// as dates change. The tax bands from the accommodation guide are real
// content, so we show the math, in the same warm type as the rest of the
// site rather than a terminal-style readout.

import { estimateCardFeeCents, type PaymentMethod, type Quote } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";

const BAND_LABEL: Record<Quote["taxBand"], string> = {
  short: "14.75% + $1.50 per night",
  medium: "10.375%, no nightly fee",
  exempt: "0%, tax exempt",
};

export function QuoteReceipt({
  quote,
  moveIn,
  moveOut,
  buildingName,
  pending,
  paymentMethod = "card",
}: {
  quote: Quote | null;
  moveIn: string;
  moveOut: string;
  buildingName: string;
  pending: boolean;
  paymentMethod?: PaymentMethod;
}) {
  const cardFeeCents =
    quote && paymentMethod === "card" ? estimateCardFeeCents(quote.totalCents) : 0;
  return (
    <div
      className={`bg-sand border border-line text-[14px] leading-6 text-ink p-5 sm:p-6 transition-opacity ${
        pending ? "opacity-60" : "opacity-100"
      }`}
      aria-live="polite"
    >
      <div className="flex items-baseline justify-between pb-3 border-b border-line">
        <span className="font-display text-lg">Stay summary</span>
        <span className="text-[13px] text-ink/55">{buildingName}</span>
      </div>

      {!quote ? (
        <p className="pt-4 text-ink/60 leading-relaxed">
          Pick your move-in and move-out dates to see the full cost. One
          payment, nothing due later.
        </p>
      ) : (
        <>
          <dl className="pt-3.5 space-y-1.5 [font-variant-numeric:tabular-nums]">
            <Row k="Move-in" v={formatDate(moveIn)} />
            <Row k="Move-out" v={formatDate(moveOut)} />
            <Row
              k="Length"
              v={`${quote.nights} nights (${quote.weeks} wk${quote.weeks === 1 ? "" : "s"}${
                quote.extraDays > 0 ? ` + ${quote.extraDays} day${quote.extraDays === 1 ? "" : "s"}` : ""
              })`}
            />
            <div className="!my-3.5 border-t border-line" />
            <Row
              k={`Rent (${formatMoney(quote.weeklyRateCents)} per week)`}
              v={formatMoney(quote.rentCents)}
            />
            <Row
              k={`NYC tax (${BAND_LABEL[quote.taxBand]})`}
              v={quote.taxCents === 0 ? "$0" : formatMoney(quote.taxCents)}
            />
            {quote.unitFeeCents > 0 && (
              <Row
                k={`Unit fee ($1.50 x ${quote.nights} nights)`}
                v={formatMoney(quote.unitFeeCents)}
              />
            )}
            {cardFeeCents > 0 && (
              <Row k="Card processing fee" v={formatMoney(cardFeeCents)} />
            )}
            <div className="!my-3.5 border-t border-line" />
            <div className="flex items-baseline justify-between gap-4 text-[16px]">
              <dt className="font-medium">Total due today</dt>
              <dd className="text-pine font-display text-[20px]">
                {formatMoney(quote.totalCents + cardFeeCents)}
              </dd>
            </div>
          </dl>
          {quote.notes.map((n) => (
            <p key={n} className="mt-3 text-[12px] leading-5 text-ink/55">
              {n}
            </p>
          ))}
          <p className="mt-2 text-[12px] leading-5 text-ink/55">
            {paymentMethod === "ach"
              ? "Paying by US bank transfer: no card fee. ACH payments take a few business days to settle; your booking is held and confirms when the funds arrive."
              : "Prefer to skip the card fee? Pick US bank transfer (ACH) under payment method; it needs a US bank account."}
          </p>
        </>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink/60">{k}</dt>
      <dd className="text-right whitespace-nowrap">{v}</dd>
    </div>
  );
}
