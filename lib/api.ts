export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8090";

export interface Quote {
  nights: number;
  weeks: number;
  extraDays: number;
  weeklyRateCents: number; // effective rate charged (includes any stay premium)
  baseWeeklyRateCents: number;
  stayPremiumRate: number; // Mansfield only: 0.25 / 0.15 / 0
  rentCents: number;
  taxBand: "short" | "medium" | "exempt";
  taxRate: number;
  taxCents: number;
  unitFeeCents: number;
  totalCents: number;
  notes: string[];
}

export interface QuoteErrorBody {
  error: string;
  message?: string;
}

// Whether the requested room is actually free for those dates. `ok` is true
// when the backend has no inventory data yet, so pricing keeps working exactly
// as before until the first lobbyboard import lands.
export interface QuoteAvailability {
  ok: boolean;
  reason: string | null;
  earliestFrom: string | null;
}

export async function fetchQuote(
  building: string,
  moveIn: string,
  moveOut: string,
): Promise<{ quote: Quote; availability: QuoteAvailability | null } | { error: QuoteErrorBody }> {
  const res = await fetch(`${BACKEND_URL}/v1/public/quote`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ building, moveIn, moveOut }),
  });
  const body = await res.json();
  if (!res.ok) return { error: body as QuoteErrorBody };
  return {
    quote: body.quote as Quote,
    availability: (body.availability as QuoteAvailability | undefined) ?? null,
  };
}

export type PaymentMethod = "card" | "ach";

// Client-side mirror of the backend gross-up, for display only; the server
// recomputes the real fee when the session is created.
export function estimateCardFeeCents(baseCents: number): number {
  if (baseCents <= 0) return 0;
  return Math.ceil((baseCents + 30) / (1 - 0.044)) - baseCents;
}

export async function createBooking(payload: {
  building: string;
  moveIn: string;
  moveOut: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  source?: string | null;
  paymentMethod: PaymentMethod;
}): Promise<{ checkoutUrl: string; ref: string } | { error: QuoteErrorBody }> {
  const res = await fetch(`${BACKEND_URL}/v1/public/bookings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) return { error: body as QuoteErrorBody };
  return body as { checkoutUrl: string; ref: string };
}

export async function createApplication(payload: {
  name: string;
  email: string;
  phone: string;
  building?: string;
  moveIn?: string;
  moveOut?: string;
  upgradeInterest: boolean;
  message: string;
  source?: string | null;
}): Promise<{ ok: true } | { error: QuoteErrorBody }> {
  const res = await fetch(`${BACKEND_URL}/v1/public/applications`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) return { error: body as QuoteErrorBody };
  return { ok: true };
}

export interface BookingStatus {
  ref: string;
  status: string;
  building_id: string;
  move_in: string;
  move_out: string;
  nights: number;
  total_cents: number;
  processing_fee_cents: number;
}

export async function fetchBookingStatus(
  sessionId: string,
): Promise<BookingStatus | null> {
  const res = await fetch(
    `${BACKEND_URL}/v1/public/bookings/status?session_id=${encodeURIComponent(sessionId)}`,
  );
  if (!res.ok) return null;
  const body = await res.json();
  return body.booking as BookingStatus;
}

// ---- Availability ----

export interface RoomAvailability {
  bookable: boolean;
  stale: boolean;
  unitsFreeNow: number;
  earliestFrom: string | null; // date-only, YYYY-MM-DD
}

// Availability comes from the landlord's lobbyboard, imported into the
// backend. `null` means the backend has no inventory data yet, in which case
// the site behaves exactly as it did before: everything is bookable.
export async function fetchAvailability(): Promise<Record<string, RoomAvailability> | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/v1/public/buildings`, { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      buildings: { id: string; availability: RoomAvailability | null }[];
    };
    const out: Record<string, RoomAvailability> = {};
    for (const b of body.buildings) if (b.availability) out[b.id] = b.availability;
    return Object.keys(out).length ? out : null;
  } catch {
    // The site must not go dark because the backend blinked; the booking
    // endpoint still enforces availability server-side.
    return null;
  }
}
