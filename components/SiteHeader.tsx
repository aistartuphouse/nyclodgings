"use client";

import Link from "next/link";

// The lodging page shares the main site's menu so the two feel like one site.
// TODO: swap MAIN to https://aistartuphouse.com once the domain is pointed.
const MAIN = "https://ai-startup-house-site.vercel.app";

const LINKS = [
  { href: `${MAIN}/#features`, label: "The House" },
  { href: `${MAIN}/#philosophy`, label: "Manifesto" },
  { href: `${MAIN}/#protocol`, label: "How It Works" },
  { href: `${MAIN}/#founder`, label: "Founder" },
  { href: `${MAIN}/#pricing`, label: "Ways In" },
  { href: `${MAIN}/#/dream-life`, label: "Calculator" },
  { href: `${MAIN}/#/blog`, label: "Blog" },
];

export function SiteHeader() {
  const dim = "text-ink/55";
  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-5 py-5 sm:px-10 text-ink">
      <Link href="/" className="flex items-baseline gap-2.5">
        <span className="inline-block size-2.5 bg-teal" aria-hidden />
        <span className="font-mono text-[13px] font-medium tracking-[0.22em] uppercase">
          AI Startup House
        </span>
        <span className={`hidden sm:inline font-mono text-[11px] tracking-[0.18em] uppercase ${dim}`}>
          Lodging
        </span>
      </Link>

      <nav className="flex items-center gap-5 sm:gap-7">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`hidden lg:inline font-mono text-[12px] tracking-[0.14em] uppercase transition-colors hover:text-teal ${dim}`}
          >
            {l.label}
          </a>
        ))}
        <a
          href={`${MAIN}/#/apply`}
          className="font-mono text-[12px] tracking-[0.14em] uppercase px-4 py-2 border border-ink/25 transition-colors hover:border-teal hover:text-teal"
        >
          Apply
        </a>
        <Link
          href="/book"
          className="font-mono text-[12px] tracking-[0.14em] uppercase px-4 py-2 bg-pine text-paper transition-colors hover:bg-pine-deep"
        >
          Book now
        </Link>
      </nav>
    </header>
  );
}
