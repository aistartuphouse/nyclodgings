export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8090";

export interface ApiErrorBody {
  error: string;
  message?: string;
}

// Since 2026-09-08 the site takes applications only: the housing team creates
// the booking and sends a payment link. Nothing here can mint a checkout.
export async function createApplication(payload: {
  name: string;
  email: string;
  phone: string;
  building?: string; // a building slug or a room-type slug, both accepted
  moveIn?: string;
  moveOut?: string;
  upgradeInterest: boolean;
  message: string;
  source?: string | null;
}): Promise<{ ok: true } | { error: ApiErrorBody }> {
  const res = await fetch(`${BACKEND_URL}/v1/public/applications`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) return { error: body as ApiErrorBody };
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

// Success page after a payment link: looks the booking up by Checkout session.
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
// backend, and is shown as information on the room cards. `null` means the
// backend has no inventory data yet. Listings without a lobbyboard (Capitol)
// are left out so their cards show no availability pill at all.
export async function fetchAvailability(): Promise<Record<string, RoomAvailability> | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/v1/public/buildings`, { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      buildings: { id: string; availability: RoomAvailability | null }[];
    };
    const out: Record<string, RoomAvailability> = {};
    for (const b of body.buildings) {
      if (b.availability && !b.id.startsWith("capitol-")) out[b.id] = b.availability;
    }
    return Object.keys(out).length ? out : null;
  } catch {
    // The site must not go dark because the backend blinked.
    return null;
  }
}
