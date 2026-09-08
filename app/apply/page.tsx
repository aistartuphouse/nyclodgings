import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { isBuildingSlug, roomTypeBySlug } from "@/lib/buildings";

export const metadata: Metadata = {
  title: "Request a room | AI Startup House Lodging",
  description:
    "Send your dates and preferred room. The housing team confirms the room and the exact price with tax, then emails a payment link. No payment until the room is confirmed.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; building?: string; room?: string }>;
}) {
  const { ref, building, room } = await searchParams;
  // ?room= pins a room type; ?building= (the organizer's deep links) picks
  // "any room" at that building.
  const preference =
    roomTypeBySlug(room)?.slug ?? (isBuildingSlug(building) ? building : null);
  return (
    <main className="bg-paper min-h-svh flex flex-col">
      <div className="relative bg-sand text-ink border-b border-line">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-5 sm:px-10 pt-32 pb-12">
          <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">Request a room</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-tight">
            Tell us your dates
          </h1>
          <p className="mt-4 max-w-xl text-ink/70 leading-relaxed">
            Every stay is arranged by the housing team: send your dates and
            the room you have in mind, and we come back by email with the
            room, the exact price including tax, and a payment link. Use the
            same form for suites, apartments or anything the room cards do not
            cover. No payment, no commitment until the room is confirmed.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl w-full px-5 sm:px-10 py-12 sm:py-16 grow">
        <ApplyForm source={ref ?? null} initialPreference={preference} />
      </div>
      <SiteFooter />
    </main>
  );
}
