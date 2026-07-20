import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roomTypeBySlug } from "@/lib/buildings";

export const metadata: Metadata = {
  title: "Book your stay | AI Startup House Lodging",
  description:
    "Pick a building and room type, choose your dates, see the full cost with tax upfront, and pay once. Rooms are confirmed the moment payment completes.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ building?: string; room?: string; ref?: string }>;
}) {
  const params = await searchParams;
  // ?room= wins and pins the room type; ?building= keeps working for the
  // organizer's existing deep links and picks that building's default room.
  const room = roomTypeBySlug(params.room);
  const building =
    room?.building ??
    (params.building === "seton" || params.building === "stratford"
      ? params.building
      : "mansfield");
  return (
    <main className="bg-paper min-h-svh flex flex-col">
      <div className="relative bg-sand text-ink border-b border-line">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-5 sm:px-10 pt-32 pb-12">
          <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">Booking</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-tight">
            Book your stay
          </h1>
          <p className="mt-4 max-w-xl text-ink/70 leading-relaxed">
            One payment covers your whole stay: rent plus any applicable NYC
            accommodation tax. The total updates live as you pick dates.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl w-full px-5 sm:px-10 py-12 sm:py-16 grow">
        <BookingForm
          initialBuilding={building}
          initialRoom={room?.slug ?? null}
          source={params.ref ?? null}
        />
      </div>
      <SiteFooter />
    </main>
  );
}
