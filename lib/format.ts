// Money and date formatting. Date-only strings are anchored at NOON UTC
// before formatting (CLAUDE.md pitfall 4) so "2026-09-10" never renders as
// September 9 in New York.

export function formatMoney(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function formatDate(value: string): string {
  if (!DATE_ONLY.test(value)) return value;
  const [y, m, d] = value.split("-").map(Number) as [number, number, number];
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(noonUtc);
}

// Today's calendar date in New York as YYYY-MM-DD (for date input min).
export function todayNY(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDays(dateOnly: string, days: number): string {
  const [y, m, d] = dateOnly.split("-").map(Number) as [number, number, number];
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12));
  noonUtc.setUTCDate(noonUtc.getUTCDate() + days);
  return noonUtc.toISOString().slice(0, 10);
}

export const MOVE_IN_DEADLINE = "2026-09-10";

// Move-outs in October, November and December are restricted to the 1st and
// the 15th (team request 2026-07-26); the backend enforces it, this mirrors
// the rule so the form can warn before the guest submits.
export const RESTRICTED_MOVE_OUT_MONTHS = [10, 11, 12];
export const RESTRICTED_MOVE_OUT_DAYS = [1, 15];

export function isRestrictedMoveOut(dateOnly: string): boolean {
  if (!DATE_ONLY.test(dateOnly)) return false;
  const [, m, d] = dateOnly.split("-").map(Number) as [number, number, number];
  return RESTRICTED_MOVE_OUT_MONTHS.includes(m) && !RESTRICTED_MOVE_OUT_DAYS.includes(d);
}

// The valid move-out dates either side of what the guest picked, so the form
// can offer them as one-click fixes. Never earlier than `notBefore`.
export function allowedMoveOutsNear(dateOnly: string, notBefore?: string): string[] {
  if (!DATE_ONLY.test(dateOnly)) return [];
  const [y, m] = dateOnly.split("-").map(Number) as [number, number, number];
  const candidates: string[] = [];
  for (const offset of [-1, 0, 1]) {
    const month = m + offset;
    const year = y + (month < 1 ? -1 : month > 12 ? 1 : 0);
    const norm = ((month - 1 + 12) % 12) + 1;
    const mm = String(norm).padStart(2, "0");
    const days = RESTRICTED_MOVE_OUT_MONTHS.includes(norm) ? RESTRICTED_MOVE_OUT_DAYS : [1];
    for (const day of days) candidates.push(`${year}-${mm}-${String(day).padStart(2, "0")}`);
  }
  const usable = candidates.filter((d) => !notBefore || d >= notBefore).sort();
  const after = usable.find((d) => d >= dateOnly);
  const before = [...usable].reverse().find((d) => d < dateOnly);
  return [before, after].filter((d): d is string => !!d);
}
