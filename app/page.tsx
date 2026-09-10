import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BUILDING_LIST } from "@/lib/buildings";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "AI Startup House Lodging | New York and Austin",
  description:
    "Three buildings for Entrepreneur AI Startup House participants: Mansfield (short-term, Midtown Manhattan, from $150/night), Seton (Murray Hill, 4 months or longer) and Capitol (Downtown Austin, 3 months or longer). Furnished rooms, utilities and Wi-Fi included, one upfront payment once the team confirms your room.",
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
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(14,30,58,0.94)_0%,rgba(14,30,58,0.6)_38%,rgba(14,30,58,0)_62%)]"
          aria-hidden
        />
        <SiteHeader />
        <div className="pointer-events-none relative z-10 mx-auto max-w-6xl w-full px-5 sm:px-10 mt-auto mb-auto pt-36 pb-28">
          <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">
            Entrepreneur AI Startup House · New York City · Austin
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.4rem)] leading-[1.02] max-w-3xl">
            Stay where the
            <br />
            program happens.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/70">
            Housing for residency participants: two buildings in Manhattan and
            one in Downtown Austin. Furnished rooms with utilities and Wi-Fi
            included. Send your dates, we confirm the room, you pay once.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#choose"
              className="pointer-events-auto bg-pine text-paper font-mono text-[13px] tracking-[0.18em] uppercase px-7 py-4 transition-colors hover:bg-pine-deep"
            >
              Choose your building
            </a>
            <span className="font-mono text-[12px] tracking-wide text-ink/55">
              From $150/night in New York · from $650/week in Austin
            </span>
          </div>
        </div>
      </section>

      {/* ---- The choice (signature section) ---- */}
      <section id="choose" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 sm:px-10 py-20 sm:py-28">
          <Reveal>
            <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">
              Three buildings, two cities
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight max-w-2xl">
              Short stays at Mansfield, multi-month at Seton, and Austin at Capitol.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              Mansfield is the short-term building in New York, with stays from
              one week. Seton is multi-month lodging in New York and takes stays
              of four months or longer. Capitol is the Austin house, with stays
              of three months or longer. Staying in New York under four months?
              Mansfield is your building.
            </p>
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
                      {b.city}
                    </span>
                  </Link>
                  <div className="p-6 sm:p-8 flex flex-col gap-5 grow">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-3xl">{b.name}</h3>
                      <p className="font-mono text-[15px] whitespace-nowrap">
                        <span className="text-ink/45 text-[12px]">from </span>
                        {formatMoney(b.fromAmountCents)}
                        <span className="text-ink/45 text-[12px]"> /{b.fromUnit}</span>
                      </p>
                    </div>
                    <p className="font-mono text-[12px] tracking-wide text-ink/50 -mt-3">
                      {b.address} · {b.neighborhood}
                    </p>
                    <ul className="space-y-1.5 text-[15px] text-ink/80">
                      <li>{b.style}</li>
                      <li>{b.bathroom}</li>
                      <li>{b.minStay}</li>
                      <li>{b.city === "Austin" ? "Location" : "Program venue"}: {b.commuteShort}</li>
                    </ul>
                    <div className="mt-auto flex gap-3 pt-2">
                      <Link
                        href={`/${b.slug}`}
                        className="grow bg-pine text-paper text-center font-mono text-[12px] tracking-[0.18em] uppercase px-5 py-3.5 transition-colors hover:bg-pine-deep"
                      >
                        View rooms
                      </Link>
                      <Link
                        href={`/apply?building=${b.slug}`}
                        className="border border-ink/25 text-center font-mono text-[12px] tracking-[0.18em] uppercase px-5 py-3.5 transition-colors hover:border-pine hover:text-pine"
                      >
                        Request
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="bg-paper-dim border-y border-line text-ink">
        <div className="mx-auto max-w-6xl px-5 sm:px-10 py-16 sm:py-20 grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <Reveal>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-snug">
              In New York the program takes place at both Seton and Mansfield.
              In Austin, Capitol is the house.
            </h2>
            <p className="mt-5 text-ink/75 leading-relaxed max-w-xl">
              Activities and presentations in New York are held at Seton in
              Murray Hill and Mansfield in Midtown, so participants staying at
              either building live where the sessions happen. Capitol puts the
              Austin cohort two blocks from the Texas State Capitol. Every room
              is furnished, with utilities and Wi-Fi included.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="font-mono text-[13px] space-y-4 border-l border-pine/40 pl-6">
              <div>
                <dt className="text-ink/50 uppercase tracking-[0.18em] text-[11px]">How to book</dt>
                <dd className="mt-1">Send your dates, the team confirms the room and emails a payment link</dd>
              </div>
              <div>
                <dt className="text-ink/50 uppercase tracking-[0.18em] text-[11px]">Payment</dt>
                <dd className="mt-1">One upfront payment, card or US bank transfer</dd>
              </div>
              <div>
                <dt className="text-ink/50 uppercase tracking-[0.18em] text-[11px]">Minimum stay</dt>
                <dd className="mt-1">Mansfield 7 nights; Seton 4 months; Capitol 3 months</dd>
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
                    <th className="text-left font-medium px-5 py-3.5">Capitol</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["City", "New York, Midtown", "New York, Murray Hill", "Austin, Downtown"],
                    ["Rate", "$150/night under a month; $3,600/month from 30 nights", "From $525/week", "From $180/week"],
                    ["Longer stays", "$3,200/month from 3 months, $2,800 from 5", "Same weekly rate", "Same weekly rate"],
                    ["Room types", "1, Shared Suite", "3, Deluxe to King Studio", "3, Sunroom, Deluxe and Loft"],
                    ["Style", "Private hotel room", "Hotel-style studio room", "Private bedroom in a shared apartment, or a loft suite"],
                    ["Bathroom", "Shared with one adjacent room", "Private en-suite bathroom", "Two full bathrooms per apartment; private in the Loft"],
                    ["Stay length", "From one week", "4 months or longer", "3 months or longer"],
                    ["Furniture, utilities, Wi-Fi", "Included", "Included", "Included"],
                    ["Tax", "NYC accommodation tax by stay length", "NYC accommodation tax by stay length", "Texas and Austin hotel occupancy tax, 17%"],
                    ["Program", "On site", "On site", "The Austin house"],
                  ].map(([k, mansfield, seton, capitol], i) => (
                    <tr key={k} className={i % 2 ? "bg-paper-dim/60" : "bg-sand/45"}>
                      <th className="text-left font-medium px-5 py-3 border-b border-line">{k}</th>
                      <td className="px-5 py-3 border-b border-line">{mansfield}</td>
                      <td className="px-5 py-3 border-b border-line">{seton}</td>
                      <td className="px-5 py-3 border-b border-line">{capitol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-mono text-[12px] tracking-wide text-ink/50">
              Every rate above is the rate charged for that room, before tax.
              Seton and Capitol have several room types, so their rate is a
              starting price; Mansfield has one.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 bg-sand text-ink/80 p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div>
                <h3 className="font-display text-xl text-ink">Upgraded rooms</h3>
                <p className="mt-2 text-[14px] leading-relaxed max-w-xl">
                  Larger rooms, suites and apartments exist in limited numbers.
                  Ask for them in the same request form.
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
              Tax is itemized before you pay.
            </h2>
            <p className="mt-5 text-ink/70 leading-relaxed">
              New York taxes furnished stays by length: the longer you stay,
              the less tax you pay, and from six months there is none. Austin
              applies the Texas and City of Austin hotel occupancy tax. Either
              way the payment link shows rent and tax as separate lines, so
              the total you see is the total you pay. No adjustments later.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="bg-sand border border-line text-[15px]">
              <div className="px-6 py-4 border-b border-line font-display text-lg">
                New York (Mansfield, Seton) by stay length
              </div>
              {[
                ["7 to 89 nights", "14.75% of rent", "plus $1.50 per night"],
                ["90 to 179 nights", "10.375% of rent", "no nightly fee"],
                ["180 nights or more", "0%", "tax exempt"],
              ].map(([len, rate, extra]) => (
                <div key={len} className="px-6 py-4 flex items-baseline justify-between gap-4 border-b border-line">
                  <span className="text-ink/70">{len}</span>
                  <span className="text-right">
                    <span className="text-pine font-medium">{rate}</span>
                    <span className="text-ink/45"> · {extra}</span>
                  </span>
                </div>
              ))}
              <div className="px-6 py-4 border-b border-line font-display text-lg">
                Austin (Capitol)
              </div>
              <div className="px-6 py-4 flex items-baseline justify-between gap-4">
                <span className="text-ink/70">Every stay</span>
                <span className="text-right">
                  <span className="text-pine font-medium">17% of rent</span>
                  <span className="text-ink/45"> · Texas 6% + City of Austin 11%</span>
                </span>
              </div>
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
                "How do I book a room?",
                "Send a request with your dates and the room you have in mind. The housing team checks that the room is free, confirms the exact price with tax, and emails you a payment link. You pay the whole stay in one payment, by card or US bank transfer, and the room is confirmed the moment the payment clears. Nothing is charged until then.",
              ],
              [
                "What is included in the rate?",
                "Furniture, utilities and high-speed Wi-Fi at all three buildings, and nothing is billed separately once you have paid. The one exception is Capitol in Austin, where electricity is metered and billed separately; internet, gas and water are included there. Each building has one or more room types, and the price on a card is the price for that room.",
              ],
              [
                "How is the Mansfield priced?",
                "By length of stay. Under a month you pay $150 per night. From 30 nights you pay per month: $3,600 a month for one to two months, $3,200 a month from three months, and $2,800 a month from five months. A month is 30 nights, the whole stay is priced at the rate its total length earns, and extra days on a monthly stay are prorated at the monthly rate divided by 30. NYC accommodation tax comes on top.",
              ],
              [
                "What does “Shared Suite” mean at Mansfield, and what am I sharing?",
                "The room is yours alone. It has a queen bed, a study desk and a nightstand, and it locks like any hotel room. The only thing you share is the bathroom, and only with the one room next door. Mansfield’s rooms are arranged in pairs, so there is exactly one other guest on the other side of that bathroom, never a floor or a corridor.",
              ],
              [
                "Which building takes short stays?",
                "Mansfield, with stays from one week upwards. Seton is multi-month lodging and takes stays of four months (120 nights) or longer; Capitol in Austin takes three months (90 nights) or longer. If your dates genuinely do not fit anywhere, send the request anyway and the housing team will look at it individually.",
              ],
              [
                "What is Capitol like?",
                "A contemporary five-story building in Downtown Austin, two blocks west of the Texas State Capitol. Each apartment has four private bedrooms plus a sunroom around an open kitchen and living area, with two full bathrooms. You take one private room, the Sunroom (the bright partitioned room) or the Deluxe (a spacious bedroom with a full-size bed), and share the kitchen and bathrooms with your apartment-mates; the Loft is an open-plan suite with its own kitchen and bathroom and two queen sofa beds. Fitness center, rooftop terrace and free laundry on every floor are in the building.",
              ],
              [
                "Is the listed price really what I pay?",
                "Yes. The rate on a room card is the rate charged for that room, at every building. The only additions are itemized on your payment link before you pay: accommodation or hotel tax where it applies, and a card processing fee if you pay by card instead of bank transfer.",
              ],
              [
                "How does payment work?",
                "Once the team confirms your room you receive a payment link that does not expire. You pay for the whole stay upfront in one Stripe payment: rent plus tax. You choose card or US bank transfer (ACH) on the payment page. Card adds a processing fee, ACH has none but needs a US bank account and takes a few business days to settle.",
              ],
              [
                "Can I choose any dates?",
                "Move-in can be any day from today. Move-out is open in every month except October, November and December, which have their own rule below. Stays that are not whole weeks or months are prorated by the day.",
              ],
              [
                "Why can I only move out on the 1st or the 15th in October, November and December?",
                "The housing team keeps departures in those three months to two fixed dates so the turnovers stay manageable. If your stay ends in October, November or December, plan for the 1st or the 15th of the month. Every other month of the year is completely open. If neither date works for your plans, say so in your request and we will look at it individually.",
              ],
              [
                "What do the availability labels on the room cards mean?",
                "For the New York buildings, room availability comes straight from the buildings and is refreshed through the day: the label shows whether a room type is free now or the first day it opens up. The team confirms the actual room when you request it. Capitol availability is confirmed by the team on request.",
              ],
              [
                "I want a larger room or a suite.",
                "Larger rooms, suites and apartments exist in limited numbers and are not listed here. Send a request with your dates and tick the upgrade box; we will come back to you with what is open.",
              ],
              [
                "Who runs this?",
                "This site handles housing for the Entrepreneur AI Startup House, organized with the team behind Real AI Dynamics. In New York the program takes place at both Seton and Mansfield; Capitol houses the Austin cohort.",
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
                href="/apply"
                className="inline-block bg-pine text-paper font-mono text-[13px] tracking-[0.18em] uppercase px-10 py-4 transition-colors hover:bg-pine-deep"
              >
                Request a room
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
