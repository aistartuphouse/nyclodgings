"use client";

import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-40 text-ink">
      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-10">
        <Link href="/" className="flex items-baseline gap-2.5" onClick={() => setOpen(false)}>
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
            className="hidden font-mono text-[12px] tracking-[0.14em] uppercase px-4 py-2 border border-ink/25 transition-colors hover:border-teal hover:text-teal lg:inline-block"
          >
            Apply
          </a>
          <Link
            href="/book"
            className="font-mono text-[12px] tracking-[0.14em] uppercase px-4 py-2 bg-pine text-paper transition-colors hover:bg-pine-deep"
          >
            Book now
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-full border border-ink/25 text-ink transition-colors hover:border-teal hover:text-teal lg:hidden"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="mx-5 border border-line bg-sand/95 p-2 backdrop-blur-md lg:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 font-mono text-[13px] tracking-[0.14em] uppercase text-ink transition-colors hover:text-teal"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`${MAIN}/#/apply`}
            onClick={() => setOpen(false)}
            className="block px-4 py-3 font-mono text-[13px] tracking-[0.14em] uppercase text-teal transition-colors hover:text-teal-dim"
          >
            Apply
          </a>
        </div>
      )}
    </header>
  );
}
