"use client";

// Success page: polls booking status by Checkout session id. Card payments
// confirm within seconds via webhook; ACH stays "processing" for days, so we
// stop polling after a short window and explain.

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchBookingStatus, type BookingStatus } from "@/lib/api";
import { BUILDINGS } from "@/lib/buildings";
import { formatDate, formatMoney } from "@/lib/format";

const POLL_MS = 2500;
const MAX_POLLS = 12; // ~30s, then settle on whatever status we have

export function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [booking, setBooking] = useState<BookingStatus | null>(null);
  const [missing, setMissing] = useState(false);
  const polls = useRef(0);

  useEffect(() => {
    if (!sessionId) {
      setMissing(true);
      return;
    }
    let cancelled = false;
    async function poll() {
      const b = await fetchBookingStatus(sessionId!);
      if (cancelled) return;
      polls.current += 1;
      if (b) setBooking(b);
      else if (polls.current >= 3) setMissing(true);
      const settled = b && b.status !== "pending_payment";
      if (!settled && polls.current < MAX_POLLS) {
        setTimeout(poll, POLL_MS);
      }
    }
    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (missing) {
    return (
      <div>
        <h1 className="font-display text-3xl">We could not find that booking</h1>
        <p className="mt-4 text-ink/70 leading-relaxed">
          The link may be incomplete. If you just paid, your booking is safe
          and the confirmation will reach your email. You can also start
          again below.
        </p>
        <Link href="/book" className="mt-8 inline-block bg-pine text-paper font-mono text-[13px] tracking-[0.18em] uppercase px-8 py-4">
          Back to booking
        </Link>
      </div>
    );
  }

  if (!booking) {
    return <p className="font-mono text-[13px] text-ink/50">Checking your booking…</p>;
  }

  const building = BUILDINGS[booking.building_id as "seton" | "stratford"];
  const confirmed = booking.status === "confirmed";
  const processing = booking.status === "processing" || booking.status === "pending_payment";

  return (
    <div>
      <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-teal-dim">
        {confirmed ? "Booking confirmed" : "Payment received"}
      </p>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight">
        {confirmed ? "You are in." : "Almost there."}
      </h1>
      <p className="mt-4 text-ink/70 leading-relaxed">
        {confirmed
          ? `Your room at ${building?.name ?? booking.building_id} is booked. Keep your reference code; the housing team will contact you before move-in with arrival details.`
          : "Your bank transfer is on its way. ACH payments take a few business days to settle; your booking is held in the meantime and confirms automatically when the funds arrive."}
      </p>

      <dl className="mt-8 bg-sand border border-line text-[14px] text-ink p-6 space-y-1.5 [font-variant-numeric:tabular-nums]">
        <Row k="Reference" v={booking.ref} highlight />
        <Row k="Building" v={`${building?.name ?? booking.building_id} · ${building?.address ?? ""}`} />
        <Row k="Move-in" v={formatDate(booking.move_in)} />
        <Row k="Move-out" v={formatDate(booking.move_out)} />
        <Row k="Nights" v={String(booking.nights)} />
        <Row k="Paid" v={formatMoney(booking.total_cents + booking.processing_fee_cents)} />
        <Row k="Status" v={confirmed ? "Confirmed" : processing ? "Payment processing" : booking.status} />
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="border border-ink/25 font-mono text-[12px] tracking-[0.18em] uppercase px-6 py-3.5 hover:border-pine hover:text-pine transition-colors">
          Back to the site
        </Link>
        <Link href="/apply" className="border border-ink/25 font-mono text-[12px] tracking-[0.18em] uppercase px-6 py-3.5 hover:border-pine hover:text-pine transition-colors">
          Questions? Contact the team
        </Link>
      </div>
    </div>
  );
}

function Row({ k, v, highlight = false }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-ink/60">{k}</dt>
      <dd className={`text-right ${highlight ? "text-pine font-semibold" : ""}`}>{v}</dd>
    </div>
  );
}
