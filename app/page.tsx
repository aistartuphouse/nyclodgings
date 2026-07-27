import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BUILDING_LIST } from "@/lib/buildings";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "AI Startup House Lodging | New York",
  description:
    "Three Manhattan buildings for Entrepreneur AI Startup House participants: Mansfield (hotel-style rooms, Midtown), Seton (hotel-style rooms, program on site) and Stratford (dorm-style). Several room types per building, weekly rates, one upfront payment.",
};

export default function HomePage() {
  return (
    <main>
      {/* ---- Hero ---- */}
      <section className="relative isolate bg-sand text-ink min-h-[92svh] flex flex-col overflow-hidden border-b border-line">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/manhattan-bg.mp4"
          poster="/videos/poster-manhattan.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
        {/* Text-protection scrim over the copy column only; the orbit scene
            on the right stays fully visible. */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(14,30,58,0.94)_0%,rgba(14,30,58,0.6)_38%,rgba(14,30,58,0)_62%)]"
          aria-hidden
        />
        <SiteHeader />
        <div className="pointer-events-none relative z-10 mx-auto max-w-6xl w-full px-5 sm:px-10 mt-auto mb-auto pt-36 pb-28">
          <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">
            Entrepreneur AI Startup House · New York City
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.4rem)] leading-[1.02] max-w-3xl">
            Stay where the
            <br />
            program happens.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/70">
            Housing for residency participants at three Manhattan buildings.
            Weekly rates with utilities and Wi-Fi included. Pick your dates,
            pay once, done.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#choose"
              className="pointer-events-auto bg-pine text-paper font-mono text-[13px] tracking-[0.18em] uppercase px-7 py-4 transition-colors hover:bg-pine-deep"
            >
              Choose your building
            </a>
            <span className="font-mono text-[12px] tracking-wide text-ink/55">
              From $400/week · book until Sep 10, 2026 move-in
            </span>
          </div>
        </div>
      </section>

      {/* ---- The choice (signature section) ---- */}
      <section id="choose" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 sm:px-10 py-20 sm:py-28">
          <Reveal>
            <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">
              Three buildings, one decision
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight max-w-2xl">
              Hotel-style rooms at Mansfield and Seton, or dorm-style at Stratford.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BUILDING_LIST.map((b, i) => (
              <Reveal key={b.slug} delay={i * 0.12}>
                <article className="group border border-line bg-sand flex flex-col h-full">
                  <Link href={`/${b.slug}`} className="relative aspect-[4/3] overflow-hidden block">
                    <Image
                      src={b.cover}
                      alt={b.coverAlt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-4 left-4 bg-paper/80 text-ink font-mono text-[11px] tracking-[0.18em] uppercase px-3 py-1.5">
                      {b.roomsLabel}
                    </span>
                  </Link>
                  <div className="p-6 sm:p-8 flex flex-col gap-5 grow">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-3xl">{b.name}</h3>
                      <p className="font-mono text-[15px] whitespace-nowrap">
                        <span className="text-ink/45 text-[12px]">from </span>
                        {formatMoney(b.weeklyRateCents)}
                        <span className="text-ink/45 text-[12px]"> /week</span>
                      </p>
                    </div>
                    <p className="font-mono text-[12px] tracking-wide text-ink/50 -mt-3">
                      {b.address} · {b.neighborhood}
                    </p>
                    <ul className="space-y-1.5 text-[15px] text-ink/80">
                      <li>{b.style}</li>
                      <li>{b.bathroom}</li>
                      <li>{b.minStay}</li>
                      <li>Program venue: {b.commuteShort}</li>
                    </ul>
                    <div className="mt-auto flex gap-3 pt-2">
                      <Link
                        href={`/book?building=${b.slug}`}
                        className="grow bg-pine text-paper text-center font-mono text-[12px] tracking-[0.18em] uppercase px-5 py-3.5 transition-colors hover:bg-pine-deep"
                      >
                        Book now
                      </Link>
                      <Link
                        href={`/${b.slug}`}
                        className="border border-ink/25 text-center font-mono text-[12px] tracking-[0.18em] uppercase px-5 py-3.5 transition-colors hover:border-pine hover:text-pine"
                      >
                        View rooms
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Why this exists ---- */}
      <section className="bg-paper-dim border-y border-line text-ink">
        <div className="mx-auto max-w-6xl px-5 sm:px-10 py-16 sm:py-20 grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <Reveal>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-snug">
              The program takes place at both Seton and Mansfield.
            </h2>
            <p className="mt-5 text-ink/75 leading-relaxed max-w-xl">
              Activities and presentations are held at Seton in Murray Hill
              and Mansfield in Midtown, so participants staying at either
              building live where the sessions happen. From Stratford it is
              roughly 20 minutes by subway. All three buildings are furnished,
              with utilities and Wi-Fi included in the weekly rate.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="font-mono text-[13px] space-y-4 border-l border-pine/40 pl-6">
              <div>
                <dt className="text-ink/50 uppercase tracking-[0.18em] text-[11px]">Booking window</dt>
                <dd className="mt-1">Move-in any day until Sep 10, 2026</dd>
              </div>
              <div>
                <dt className="text-ink/50 uppercase tracking-[0.18em] text-[11px]">Payment</dt>
                <dd className="mt-1">One upfront payment, card or US bank transfer</dd>
              </div>
              <div>
                <dt className="text-ink/50 uppercase tracking-[0.18em] text-[11px]">Minimum stay</dt>
                <dd className="mt-1">7 nights, priced weekly with daily proration</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---- Compare ---- */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 sm:px-10 py-20 sm:py-24">
          <Reveal>
            <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">Side by side</p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.8rem)]">Compare your options</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-[15px]">
                <thead>
                  <tr className="bg-pine text-paper font-mono text-[11px] tracking-[0.18em] uppercase">
                    <th className="text-left font-medium px-5 py-3.5 w-[25%]"> </th>
                    <th className="text-left font-medium px-5 py-3.5">Mansfield</th>
                    <th className="text-left font-medium px-5 py-3.5">Seton</th>
                    <th className="text-left font-medium px-5 py-3.5">Stratford</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Weekly rate", "From $575", "From $525", "From $400"],
                    ["Room types", "6, Shared Suite to Double Suite", "3, Deluxe to King Studio", "2, private or Jack and Jill"],
                    ["Style", "Hotel-style, single or shared", "Hotel-style studio room", "Dorm-style room"],
                    ["Bathroom", "Varies by room", "Private en-suite bathroom", "Shared bathrooms"],
                    ["Minimum stay", "One week", "One week", "One week"],
                    ["Furniture and furnishings", "Included", "Included", "Included"],
                    ["Utilities", "Included", "Included", "Included"],
                    ["Wi-Fi", "Included", "Included", "Included"],
                    ["Program venue", "On site, same building", "On site, same building", "~20 min by subway"],
                    ["Neighborhood", "Midtown", "Murray Hill", "Upper West Side"],
                  ].map(([k, mansfield, seton, stratford], i) => (
                    <tr key={k} className={i % 2 ? "bg-paper-dim/60" : "bg-sand/45"}>
                      <th className="text-left font-medium px-5 py-3 border-b border-line">{k}</th>
                      <td className="px-5 py-3 border-b border-line">{mansfield}</td>
                      <td className="px-5 py-3 border-b border-line">{seton}</td>
                      <td className="px-5 py-3 border-b border-line">{stratford}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-mono text-[12px] tracking-wide text-ink/50">
              Mansfield rates are for stays of 6 months or longer; 1 to 3 month
              stays are priced 25% higher and 3 to 6 months 15% higher. Every
              rate above is a starting price; each building has several room
              types.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 bg-sand text-ink/80 p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div>
                <h3 className="font-display text-xl text-ink">Upgraded rooms</h3>
                <p className="mt-2 text-[14px] leading-relaxed max-w-xl">
                  All three properties also have larger rooms, suites, and
                  apartments in limited numbers. These are requested
                  separately, not booked online.
                </p>
              </div>
              <Link
                href="/apply"
                className="shrink-0 border border-ink/30 font-mono text-[12px] tracking-[0.18em] uppercase px-6 py-3.5 text-center transition-colors hover:border-teal hover:text-teal"
              >
                Request an upgrade
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Tax explainer ---- */}
      <section className="bg-paper-dim border-y border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-10 py-20 sm:py-24 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">Taxes, upfront and exact</p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight">
              The longer you stay, the less tax you pay.
            </h2>
            <p className="mt-5 text-ink/70 leading-relaxed">
              New York taxes furnished stays by length. We apply the correct
              rate for your whole stay at checkout, so the total you see is
              the total you pay. No adjustments later, no refund paperwork.
            </p>
            <p className="mt-3 text-ink/70 leading-relaxed">
              Stay six months or longer and there is no accommodation tax at
              all.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="bg-sand border border-line text-[15px]">
              <div className="px-6 py-4 border-b border-line font-display text-lg">
                NYC accommodation tax by stay length
              </div>
              {[
                ["7 to 89 nights", "14.75% of rent", "plus $1.50 per night"],
                ["90 to 179 nights", "10.375% of rent", "no nightly fee"],
                ["180 nights or more", "0%", "tax exempt"],
              ].map(([len, rate, extra]) => (
                <div key={len} className="px-6 py-4 flex items-baseline justify-between gap-4 border-b border-line last:border-0">
                  <span className="text-ink/70">{len}</span>
                  <span className="text-right">
                    <span className="text-pine font-medium">{rate}</span>
                    <span className="text-ink/45"> · {extra}</span>
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 sm:px-10 py-20 sm:py-24">
          <Reveal>
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)]">Questions people ask</h2>
          </Reveal>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {[
              [
                "What is included in the weekly rate?",
                "Furniture, all utilities and high-speed Wi-Fi at all three buildings. Nothing is billed separately once you have paid. Each building has several room types at different weekly rates, so the price you see on a card is the price for that room, not a starting point that grows later.",
              ],
              [
                "What does \u201cShared Suite\u201d mean at Mansfield, and what am I sharing?",
                "The room is yours alone. It has a queen bed, a study desk and a nightstand, and it locks like any hotel room. The only thing you share is the bathroom, and only with the one room next door. Mansfield\u2019s rooms are arranged in pairs, so there is exactly one other guest on the other side of that bathroom, never a floor or a corridor. The Deluxe Shared Suite is the same arrangement with more floor space. If you would rather not share anything, the Studio rooms at Mansfield and every room at Seton have a private bathroom inside the room.",
              ],
              [
                "Can I book both rooms of a pair?",
                "Yes, that is the Double Suite. You take both bedrooms of one pair, each with its own queen bed, and the bathroom between them becomes yours alone. It suits two people travelling together who want their own rooms, and it works just as well for one person who wants the extra space. It costs the two rooms added together. It is only bookable when both halves of the same pair happen to be free, so it appears and disappears as rooms turn over.",
              ],
              [
                "How do Mansfield prices work?",
                "Mansfield rates are the six-month-and-longer prices. Shorter stays cost more: one to three months is 25% above the listed rate and three to six months is 15% above it. The booking summary always shows the exact weekly rate for the dates you picked before you pay anything. Seton and Stratford rates do not change with stay length.",
              ],
              [
                "How does payment work?",
                "You pay for the whole stay upfront in one Stripe payment: rent plus any NYC accommodation tax that applies. You choose card or US bank transfer (ACH) at checkout. Card adds a processing fee, ACH has none but needs a US bank account and takes a few business days to settle.",
              ],
              [
                "Can I choose any dates?",
                "Move-in can be any day up to and including September 10, 2026. The minimum stay is one week, seven nights. Move-out is open in every month except October, November and December, which have their own rule below. Stays that are not whole weeks are prorated by the day, so a ten-night stay costs one week plus three days.",
              ],
              [
                "Why can I only move out on the 1st or the 15th in October, November and December?",
                "The housing team keeps departures in those three months to two fixed dates so the turnovers stay manageable. If your stay ends in October, November or December, pick the 1st or the 15th of the month and the booking will go through normally. Every other month of the year is completely open, you can leave on any day. If neither date works for your plans, send a request through the application form and we will look at it individually.",
              ],
              [
                "Why can I not book the room I want?",
                "Room availability comes straight from the buildings, and a room is only offered once we can see the date it actually frees up. If a room type shows a date instead of a booking button, that is the first day it opens up, and you can book from that date onwards. If it shows nothing at all, we cannot confirm it is free, so we would rather not sell it to you. Send a request in that case and the housing team will find you something.",
              ],
              [
                "I want a larger room or a suite.",
                "All three buildings have a limited number of larger rooms, suites and apartments that are not listed here. Send an application with your dates and we will come back to you with what is open.",
              ],
              [
                "Who runs this?",
                "This site handles housing for the Entrepreneur AI Startup House, organized with the team behind Real AI Dynamics. The program itself takes place at both Seton and Mansfield.",
              ],
            ].map(([q, a]) => (
              <Reveal key={q}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer items-baseline justify-between gap-6 list-none font-display text-lg">
                    {q}
                    <span className="font-mono text-teal-dim transition-transform group-open:rotate-45 text-xl leading-none" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/70 max-w-2xl">{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 text-center">
              <Link
                href="/book"
                className="inline-block bg-pine text-paper font-mono text-[13px] tracking-[0.18em] uppercase px-10 py-4 transition-colors hover:bg-pine-deep"
              >
                Book your stay
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
