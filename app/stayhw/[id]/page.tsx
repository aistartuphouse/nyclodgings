import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StayHWUnitView } from "@/components/StayHWUnitView";
import { getStayHWUnitDetail, getStayHWUnits, StayHWError } from "@/lib/stayhw";
import { parseStaySearch } from "@/lib/stayhw-calendar";

export const dynamic = "force-dynamic";

// The URL carries StayHW's own slug (/stayhw/401 mirrors stayhw.com/properties/401/);
// a numeric WordPress ID is accepted as a fallback.
async function resolveUnit(value: string) {
  if (!/^[a-z0-9-]{1,80}$/.test(value)) return null;
  const units = await getStayHWUnits();
  return units.find((unit) => unit.slug === value) ?? units.find((unit) => String(unit.id) === value) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const unit = await resolveUnit((await params).id).catch(() => null);
  return unit
    ? { title: `${unit.name} · StayHW, Hollywood`, description: `Entire condo in Hollywood, Los Angeles: ${unit.bedrooms} bedrooms, up to ${unit.guests} guests. See photos, the calendar and the price for your dates.` }
    : { title: "StayHW, Hollywood" };
}

export default async function StayHWUnitPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ref?: string; checkIn?: string; checkOut?: string; guests?: string }> }) {
  const slug = (await params).id;
  const { ref, ...rawSearch } = await searchParams;
  const unit = await resolveUnit(slug).catch(() => undefined);
  if (unit === null) notFound();
  const result = !unit ? null : await getStayHWUnitDetail(unit.id).catch((error: unknown) => {
    if (error instanceof StayHWError && error.status === 404) notFound();
    return null;
  });
  return (
    <main className="relative bg-paper min-h-svh flex flex-col">
      <SiteHeader />
      <div className="grow">
        {result
          ? <StayHWUnitView detail={result.detail} calendar={result.calendar} source={ref ?? null} initialSearch={parseStaySearch(rawSearch)} />
          : <div className="mx-auto max-w-6xl px-5 pt-36 pb-24 sm:px-10"><p role="alert" className="text-lg">This condo is temporarily unavailable.</p><p className="mt-4 text-ink/60"><Link href={`/stayhw/${encodeURIComponent(slug)}`} className="text-teal underline">Try again</Link> or <Link href="/stayhw" className="text-teal underline">see all Hollywood condos</Link>.</p></div>}
      </div>
      <SiteFooter />
    </main>
  );
}
