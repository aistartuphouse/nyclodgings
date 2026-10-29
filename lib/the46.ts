// The 46's real rooms, read from its own backend (a sister operation, not the
// program backend). One public feed per building, the same one its room
// explorer draws: every room with its number, floor, weekly rate, status and
// the date it frees up, plus its published listing with photos.
//
// Read server-side and cached for five minutes, so the browser never talks to
// the 46's backend and its CORS allowlist does not matter. The photo URLs are
// signed for six days, far longer than the cache.

import type { RoomAvailability } from "@/lib/api";

const THE46_BACKEND_URL =
  process.env.THE46_BACKEND_URL ?? "https://the46-backend-kvx5mvdoyq-ue.a.run.app";
const THE46_PROJECT_ID = "the-46";

// The 46's type slugs are the program's room-type slugs minus the prefix.
export const THE46_PREFIX = "the-46-";

export type The46Status = "available" | "upcoming" | "taken";

export interface The46Room {
  number: string;
  floor: number;
  typeSlug: string; // program room-type slug, e.g. "the-46-classic-queen"
  typeName: string; // "Classic Queen"
  weeklyCents: number;
  status: The46Status;
  // date-only; set when the room is occupied and its move-out is known
  availableFrom: string | null;
  photo: { url: string; alt: string } | null;
}

interface FeedRoom {
  roomId: string;
  status: "available" | "reserved" | "occupied" | string;
  availableFrom: string | null;
  priceWeekly: number;
  roomType: string;
  typeSlug: string;
  listing: {
    shortName: string;
    floor: string;
    images: { url: string; alt: string }[];
  } | null;
}

export async function fetchThe46Rooms(): Promise<The46Room[] | null> {
  try {
    const res = await fetch(`${THE46_BACKEND_URL}/v1/public/explorer/the-46`, {
      headers: { "X-Project-Id": THE46_PROJECT_ID },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { rooms: FeedRoom[] };
    return body.rooms
      .map((r): The46Room => {
        // "reserved" has no end date in the feed: someone holds the room.
        const status: The46Status =
          r.status === "available" ? "available" : r.status === "occupied" && r.availableFrom ? "upcoming" : "taken";
        const image = r.listing?.images[0];
        return {
          number: r.roomId,
          floor: Number(r.listing?.floor ?? r.roomId.slice(0, -2)),
          typeSlug: `${THE46_PREFIX}${r.typeSlug}`,
          typeName: r.listing?.shortName ?? r.roomType.replace(/ Room$/, ""),
          weeklyCents: Math.round(r.priceWeekly * 100),
          status,
          availableFrom: status === "upcoming" ? r.availableFrom : null,
          photo: image ? { url: image.url, alt: image.alt } : null,
        };
      })
      .sort((a, b) => Number(a.number) - Number(b.number));
  } catch {
    // The page keeps its room-type cards when the 46's backend blinks.
    return null;
  }
}

// Room-type pills from the real rooms, in the shape the lobbyboard uses.
export function the46Availability(rooms: The46Room[]): Record<string, RoomAvailability> {
  const out: Record<string, RoomAvailability> = {};
  for (const r of rooms) {
    const a = (out[r.typeSlug] ??= { bookable: false, stale: false, unitsFreeNow: 0, earliestFrom: null });
    if (r.status === "available") {
      a.bookable = true;
      a.unitsFreeNow += 1;
    } else if (r.availableFrom && (!a.earliestFrom || r.availableFrom < a.earliestFrom)) {
      a.earliestFrom = r.availableFrom;
    }
  }
  return out;
}
