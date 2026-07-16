import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main className="bg-paper min-h-svh flex flex-col">
      <div className="relative bg-sand border-b border-line">
        <SiteHeader />
        <div className="pt-28 pb-8" />
      </div>
      <div className="mx-auto max-w-2xl w-full px-5 sm:px-10 py-16 grow">
        <p className="font-mono text-[12px] tracking-[0.26em] uppercase text-teal-dim">404</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight">
          That page does not exist.
        </h1>
        <p className="mt-4 text-ink/70 leading-relaxed max-w-lg">
          The address may have changed. Everything on this site starts from
          the two buildings.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="bg-pine text-paper font-mono text-[13px] tracking-[0.18em] uppercase px-8 py-4 transition-colors hover:bg-pine-deep">
            Home
          </Link>
          <Link href="/book" className="border border-ink/25 font-mono text-[12px] tracking-[0.18em] uppercase px-6 py-4 hover:border-pine hover:text-pine transition-colors">
            Book a room
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
