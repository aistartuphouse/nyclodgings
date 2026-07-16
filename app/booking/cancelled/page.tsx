import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Checkout cancelled | AI Startup House Lodging",
  robots: { index: false },
};

export default function CancelledPage() {
  return (
    <main className="bg-paper min-h-svh flex flex-col">
      <div className="relative bg-sand border-b border-line">
        <SiteHeader />
        <div className="pt-28 pb-8" />
      </div>
      <div className="mx-auto max-w-2xl w-full px-5 sm:px-10 py-14 grow">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight">
          No charge was made
        </h1>
        <p className="mt-4 text-ink/70 leading-relaxed max-w-lg">
          You left checkout before paying, so nothing was booked and nothing
          was charged. Your dates are not held; when you are ready, start
          again and the price will recalculate.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/book"
            className="bg-pine text-paper font-mono text-[13px] tracking-[0.18em] uppercase px-8 py-4 transition-colors hover:bg-pine-deep"
          >
            Start again
          </Link>
          <Link
            href="/apply"
            className="border border-ink/25 font-mono text-[12px] tracking-[0.18em] uppercase px-6 py-4 hover:border-pine hover:text-pine transition-colors"
          >
            Talk to the team instead
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
