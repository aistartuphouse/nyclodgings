"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/seton", label: "Seton" },
  { href: "/stratford", label: "Stratford" },
  { href: "/apply", label: "Apply" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const dim = "text-ink/55";
  return (
    <header
      className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-5 sm:px-10 text-ink"
    >
      <Link href="/" className="flex items-baseline gap-2.5">
        <span className="inline-block size-2.5 bg-teal" aria-hidden />
        <span className="font-mono text-[13px] font-medium tracking-[0.22em] uppercase">
          AI Startup House
        </span>
        <span className={`hidden sm:inline font-mono text-[11px] tracking-[0.18em] uppercase ${dim}`}>
          Lodging
        </span>
      </Link>
      <nav className="flex items-center gap-5 sm:gap-8">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`font-mono text-[12px] tracking-[0.14em] uppercase transition-colors hover:text-teal ${
              pathname === l.href ? "text-teal" : dim
            } hidden sm:inline`}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/book"
          className="font-mono text-[12px] tracking-[0.14em] uppercase px-4 py-2 border border-ink/25 transition-colors hover:border-teal hover:text-teal"
        >
          Book now
        </Link>
      </nav>
    </header>
  );
}
