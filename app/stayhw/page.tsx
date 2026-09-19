import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StayHWRooms } from "@/components/StayHWRooms";
import { StayHWSearchBar, StayHWSearchProvider } from "@/components/StayHWSearch";
import { BUILDINGS } from "@/lib/buildings";
import { getStayHWUnits, searchStayHWUnits } from "@/lib/stayhw";
import { parseStaySearch } from "@/lib/stayhw-calendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "StayHW, Hollywood",
  description: "Explore StayHW condos in Hollywood, Los Angeles. Choose a unit, see its nightly calendar and date-based price, and request your stay on AI Startup House Lodging.",
};

export default async function StayHWPage({ searchParams }: { searchParams: Promise<{ ref?: string; checkIn?: string; checkOut?: string; guests?: string }> }) {
  const { ref, ...rawSearch } = await searchParams;
  const b = BUILDINGS.stayhw;
  const search = parseStaySearch(rawSearch);
  const filtering = !!(search.checkIn || search.guests);
  const [units, unitIds] = await Promise.all([
    getStayHWUnits().catch(() => null),
    // A failed search falls back to every condo; the visitor can search again.
    filtering ? searchStayHWUnits(search.checkIn || null, search.checkOut || null, search.guests || null).catch(() => null) : null,
  ]);
  return (
    <main className="bg-paper min-h-svh">
      <StayHWSearchProvider initialSearch={unitIds ? search : { checkIn: "", checkOut: "", guests: 0 }} initialUnitIds={unitIds} source={ref ?? null}>
        {/* z-20 keeps the date popup above the grid; the photo is clipped by its own wrapper so the popup can overflow. */}
        <section className="relative z-20 bg-sand border-b border-line">
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
            <Image src="/images/hollywood/hollywood_bg.png" alt="" fill priority sizes="100vw" className="object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-sand via-sand/65 to-sand/25" />
          </div>
          <SiteHeader />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-10 pt-28 pb-14">
            <StayHWSearchBar />
            <Link href="/#choose" className="mt-12 inline-block font-mono text-[12px] text-teal">← All properties</Link>
            <p className="mt-8 font-mono text-[12px] tracking-[0.22em] uppercase text-pine">Hollywood · Los Angeles</p>
            <h1 className="mt-3 font-display text-[clamp(2.8rem,7vw,5rem)]">StayHW</h1>
            <p className="mt-3 font-mono text-[13px] text-ink/60">{b.address} · {b.neighborhood}</p>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-5 sm:px-10 py-14 sm:py-20">
          <h2 className="font-display text-3xl">Find your Hollywood condo</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/60">Pick your dates above to see the condos that are free, or open any condo for its photos, calendar and price.</p>
          <StayHWRooms initialUnits={units} />
        </div>
      </StayHWSearchProvider>
      <SiteFooter />
    </main>
  );
}
