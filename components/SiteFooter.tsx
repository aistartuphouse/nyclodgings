import Link from "next/link";
import { BUILDING_LIST } from "@/lib/buildings";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-dim text-ink/80">
      <div className="mx-auto max-w-6xl px-5 sm:px-10 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-baseline gap-2.5 text-ink">
              <span className="inline-block size-2.5 bg-teal" aria-hidden />
              <span className="font-mono text-[13px] font-medium tracking-[0.22em] uppercase">
                AI Startup House
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              Housing for Entrepreneur AI Startup House participants in New York
              City and Austin. Organized with the residency team at Real AI
              Dynamics.
            </p>
            <a
              href="https://realaidynamics.com"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-mono text-[12px] tracking-[0.14em] uppercase text-teal hover:text-ink transition-colors"
            >
              realaidynamics.com
            </a>
          </div>
          <div className="font-mono text-[13px] leading-7 text-ink/70">
            <div className="text-ink/40 uppercase tracking-[0.18em] text-[11px] mb-3">Buildings</div>
            {BUILDING_LIST.map((b) => (
              <div key={b.slug}>
                <Link href={`/${b.slug}`} className="hover:text-teal transition-colors">{b.name}</Link>
                <span className="text-ink/40"> · {b.address}, {b.neighborhood}</span>
              </div>
            ))}
            <div className="mt-4 text-ink/40 uppercase tracking-[0.18em] text-[11px] mb-3">Booking</div>
            <div><Link href="/apply" className="hover:text-teal transition-colors">Request a room</Link></div>
          </div>
          <div className="text-[12px] leading-relaxed text-ink/45">
            <div className="font-mono text-ink/40 uppercase tracking-[0.18em] text-[11px] mb-3">Notes</div>
            <p>
              Mansfield hosts short-term stays from one week, priced per night
              under a month and per month from 30 nights. Seton hosts stays of
              four months (120 nights) or longer and Capitol stays of three
              months (90 nights) or longer, both at weekly rates. Every stay is
              confirmed by the housing team and paid in one upfront payment.
              New York stays of less than six months may be subject to New
              York accommodation tax; stays of 180 days or longer are not.
              Austin stays are subject to Texas and City of Austin hotel
              occupancy tax. Tax treatment depends on individual circumstances
              and is subject to change. Room types, pricing and availability
              are subject to confirmation at the time of booking. Images are
              representative and actual rooms may vary.
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-line-dark pt-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.14em] uppercase text-ink/35">
          <span>Entrepreneur AI Startup House · New York City · Austin</span>
          <span>Payments processed by Stripe</span>
        </div>
      </div>
    </footer>
  );
}
