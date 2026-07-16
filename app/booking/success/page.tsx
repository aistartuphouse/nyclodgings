import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SuccessContent } from "./SuccessContent";

export const metadata: Metadata = {
  title: "Booking confirmed | Real AI Bootcamp Housing",
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <main className="bg-paper min-h-svh flex flex-col">
      <div className="relative bg-sand border-b border-line">
        <SiteHeader />
        <div className="pt-28 pb-8" />
      </div>
      <div className="mx-auto max-w-2xl w-full px-5 sm:px-10 py-14 grow">
        <Suspense fallback={<p className="font-mono text-[13px] text-ink/50">Checking your booking…</p>}>
          <SuccessContent />
        </Suspense>
      </div>
      <SiteFooter />
    </main>
  );
}
