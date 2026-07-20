import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BookingForm } from "@/components/BookingForm";
import { BUILDING_LIST, BUILDINGS, type BuildingSlug } from "@/lib/buildings";
import { formatMoney } from "@/lib/format";

export function BuildingPage({
  slug,
  source,
}: {
  slug: BuildingSlug;
  source?: string | null;
}) {
  const b = BUILDINGS[slug];
  const others = BUILDING_LIST.filter((x) => x.slug !== slug);
  const [lead, second, ...rest] = b.photos;

  return (
    <main className="bg-paper">
      {/* Photo hero */}
      <section className="relative isolate bg-paper text-ink">
        <SiteHeader />
        <div className="relative h-[62svh] min-h-[420px]">
          <Image
            src={lead!.src}
            alt={lead!.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
            // Portrait leads read best anchored below center: the furniture
            // band stays in view instead of ceiling and wall.
            style={{ objectPosition: slug === "stratford" ? "center 62%" : "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-paper/40" aria-hidden />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-6xl px-5 sm:px-10 pb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-teal">
                  {b.roomsLabel}
                </p>
                <h1 className="mt-3 font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-none">{b.name}</h1>
                <p className="mt-3 font-mono text-[13px] text-ink/70">
                  {b.address} · {b.neighborhood}
                </p>
              </div>
              <p className="font-display text-4xl">
                {formatMoney(b.weeklyRateCents)}
                <span className="font-mono text-[13px] text-ink/60"> per week</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="mx-auto max-w-6xl px-5 sm:px-10 py-16 sm:py-20 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="text-lg leading-relaxed text-ink/80 max-w-2xl">{b.description}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/60 max-w-2xl">{b.commute}</p>
          <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-6 font-mono text-[13px] max-w-xl">
            <div>
              <dt className="text-ink/45 uppercase tracking-[0.18em] text-[11px]">Room type</dt>
              <dd className="mt-1.5">{b.roomTypeShort}</dd>
            </div>
            <div>
              <dt className="text-ink/45 uppercase tracking-[0.18em] text-[11px]">Bathroom</dt>
              <dd className="mt-1.5">{b.bathroomShort}</dd>
            </div>
            <div>
              <dt className="text-ink/45 uppercase tracking-[0.18em] text-[11px]">Commute</dt>
              <dd className="mt-1.5">{b.commuteShort}</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="bg-sand border border-pine/40 text-ink p-7 sm:p-8">
            <h2 className="font-mono text-[11px] tracking-[0.22em] uppercase text-teal">
              {slug === "seton" ? "What's included" : "Included in the rate"}
            </h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {b.included.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[9px] block size-1.5 shrink-0 bg-teal" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-5 sm:px-10 pb-16 sm:pb-20">
        <Reveal>
          <h2 className="font-display text-[clamp(1.7rem,3.5vw,2.4rem)]">Rooms and common areas</h2>
          <p className="mt-2 font-mono text-[12px] text-ink/50">
            Room styles vary; images are representative.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[second, ...rest].filter(Boolean).map((photo, i) => (
            <Reveal key={photo!.src} delay={(i % 3) * 0.08} className={i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}>
              <div className={`relative overflow-hidden ${i === 0 ? "aspect-[4/3] sm:h-full sm:aspect-auto" : "aspect-[4/3]"}`}>
                <Image
                  src={photo!.src}
                  alt={photo!.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  style={photo!.pos ? { objectPosition: photo!.pos } : undefined}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="bg-paper-dim border-y border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-10 py-16 sm:py-20">
          <Reveal>
            <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">Reserve your room</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.6rem)]">
              Book {b.name} in one payment
            </h2>
          </Reveal>
          <div className="mt-10">
            <BookingForm initialBuilding={slug} source={source} lockBuilding />
          </div>
        </div>
      </section>

      {/* Cross-link + upgrade */}
      <section className="mx-auto max-w-6xl px-5 sm:px-10 py-14 grid gap-4 sm:grid-cols-3">
        {others.map((other) => (
          <Link
            key={other.slug}
            href={`/${other.slug}`}
            className="group border border-line bg-sand p-6 transition-colors hover:border-pine"
          >
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink/45">Also available</p>
            <p className="mt-2 font-display text-2xl">
              {other.name}
              <span className="text-ink/40 text-lg"> · {formatMoney(other.weeklyRateCents)}/week</span>
            </p>
            <p className="mt-1 text-[14px] text-ink/60">{other.tagline}</p>
          </Link>
        ))}
        <Link
          href="/apply"
          className="group border border-line bg-sand p-6 transition-colors hover:border-pine"
        >
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink/45">Larger rooms</p>
          <p className="mt-2 font-display text-2xl">Suites and apartments</p>
          <p className="mt-1 text-[14px] text-ink/60">
            Limited numbers at all three buildings, requested separately.
          </p>
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
