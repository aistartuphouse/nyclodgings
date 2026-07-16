import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Apply | Real AI Bootcamp Housing",
  description:
    "Ask about upgraded rooms, suites, and apartments, or send your dates before booking. The housing team replies by email.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <main className="bg-paper min-h-svh flex flex-col">
      <div className="relative bg-sand text-ink border-b border-line">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-5 sm:px-10 pt-32 pb-12">
          <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-pine">Application</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-tight">
            Tell us what you need
          </h1>
          <p className="mt-4 max-w-xl text-ink/70 leading-relaxed">
            Use this form for upgraded rooms (suites and apartments are
            limited and not booked online), or if you want to talk to the
            housing team before booking. No payment, no commitment.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl w-full px-5 sm:px-10 py-12 sm:py-16 grow">
        <ApplyForm source={ref ?? null} />
      </div>
      <SiteFooter />
    </main>
  );
}
