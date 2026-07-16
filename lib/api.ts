export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8090";

export interface Quote {
  nights: number;
  weeks: number;
  extraDays: number;
  weeklyRateCents: number;
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

export async function fetchQuote(
  building: string,
  moveIn: string,
  moveOut: string,
): Promise<{ quote: Quote } | { error: QuoteErrorBody }> {
  const res = await fetch(`${BACKEND_URL}/v1/public/quote`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ building, moveIn, moveOut }),
  });
  const body = await res.json();
  if (!res.ok) return { error: body as QuoteErrorBody };
  return { quote: body.quote as Quote };
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
