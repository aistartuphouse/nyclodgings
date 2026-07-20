// Static building content (mirrors the backend seed and the accommodation
// guide PDF). Rates are display copy here; the backend quote is the source
// of truth for money.

export type BuildingSlug = "seton" | "stratford" | "mansfield";

export interface BuildingContent {
  slug: BuildingSlug;
  name: string;
  address: string;
  neighborhood: string;
  weeklyRateCents: number; // lowest room-type rate, shown as "from $X/week"
  tagline: string;
  style: string;
  bathroom: string;
  roomsLabel: string;
  roomTypeShort: string;
  bathroomShort: string;
  minStay: string;
  commute: string;
  commuteShort: string;
  description: string;
  included: string[];
  photos: { src: string; alt: string; pos?: string }[];
  cover: string;
  coverAlt: string;
}

export const BUILDINGS: Record<BuildingSlug, BuildingContent> = {
  seton: {
    slug: "seton",
    name: "Seton",
    address: "144 East 40th Street",
    neighborhood: "Murray Hill, Manhattan",
    weeklyRateCents: 52500,
    tagline: "Studio-style room, program on site",
    style: "Private hotel room (studio-style)",
    bathroom: "Private en-suite bathroom, inside the room",
    roomsLabel: "Studio-style rooms",
    roomTypeShort: "Studio-style",
    bathroomShort: "En-suite bathroom",
    minStay: "One-month minimum stay",
    commute: "Programming takes place at both Seton and Mansfield. Sessions at Seton happen in your building; Mansfield is about a 15-minute walk.",
    commuteShort: "On site",
    description:
      "Each guest has a private, hotel-style room, similar to a small studio apartment, with a private en-suite bathroom inside the room. The residency's activities and presentations take place at Seton and Mansfield.",
    included: [
      "Private hotel room (studio-style)",
      "Private en-suite bathroom inside the room",
      "All utilities",
      "Furniture and furnishings",
      "High-speed Wi-Fi",
      "On-site program venue",
    ],
    photos: [
      { src: "/images/seton/2.webp", alt: "Seton guest room with iron bed and diamond-pattern wall" },
      { src: "/images/seton/4.webp", alt: "Seton guest room with queen bed and private en-suite bathroom" },
      { src: "/images/seton/3.webp", alt: "Seton lounge with teal armchairs and chandelier" },
      { src: "/images/seton/5.webp", alt: "Seton lobby with marble wall and pendant lights" },
      { src: "/images/seton/6.webp", alt: "Seton courtyard with brick walls and shade sails" },
      { src: "/images/seton/1.webp", alt: "Seton Hotel entrance on East 40th Street" },
      { src: "/images/seton/7.webp", alt: "Seton building exterior at dusk, lit blue" },
    ],
    cover: "/images/seton/1.webp",
    coverAlt: "Seton Hotel entrance on East 40th Street",
  },
  stratford: {
    slug: "stratford",
    name: "Stratford",
    address: "117 West 70th Street",
    neighborhood: "Upper West Side",
    weeklyRateCents: 40000,
    tagline: "Dorm-style, lower cost",
    style: "Basic, dorm-style room",
    bathroom: "Shared bathrooms",
    roomsLabel: "Dorm-style rooms",
    roomTypeShort: "Dorm-style",
    bathroomShort: "Shared",
    minStay: "One-month minimum stay",
    commute: "Activities and presentations are held at Seton and Mansfield, both in Midtown. From Stratford that is roughly 20 minutes by subway.",
    commuteShort: "~20 min by subway",
    description:
      "Stratford is the lower-cost option. Rooms are basic and dorm-style, with shared bathrooms, shared common spaces, and a courtyard on the Upper West Side.",
    included: [
      "Basic, dorm-style room",
      "Shared bathrooms",
      "All utilities",
      "Furniture and furnishings",
      "High-speed Wi-Fi",
      "Shared common spaces and courtyard",
    ],
    photos: [
      { src: "/images/stratford/s7.jpeg", alt: "Stratford dorm room with bed, desk and rug" },
      { src: "/images/stratford/s6.jpeg", alt: "Stratford dorm room with single bed, nightstand and window", pos: "center 72%" },
      { src: "/images/stratford/s3.jpeg", alt: "Stratford lobby with blue walls and front desk" },
      { src: "/images/stratford/s1.jpeg", alt: "Stratford game room with pool table and arcade machines" },
      { src: "/images/stratford/s4.jpeg", alt: "Stratford courtyard deck with benches and tables" },
      { src: "/images/stratford/s2.jpeg", alt: "Stratford shared laundry room" },
      { src: "/images/stratford/facade.jpeg", alt: "The Stratford building on West 70th Street, full facade" },
    ],
    cover: "/images/stratford/facade.jpeg",
    coverAlt: "The Stratford building on West 70th Street, full facade",
  },
  mansfield: {
    slug: "mansfield",
    name: "Mansfield",
    address: "12 West 44th Street",
    neighborhood: "Midtown Manhattan",
    weeklyRateCents: 57500,
    tagline: "Hotel living, heart of Midtown",
    style: "Hotel living: single and shared rooms",
    bathroom: "Private and shared bathroom options, varies by room",
    roomsLabel: "Hotel living",
    roomTypeShort: "Single or shared",
    bathroomShort: "Varies by room",
    minStay: "Short-term stays on request",
    commute: "Programming takes place at both Seton and Mansfield, so many sessions happen right in the building. Seton is under a mile away, about a 15-minute walk.",
    commuteShort: "On site",
    description:
      "The Mansfield is a historic boutique hotel building on West 44th Street offering hotel living with both single and shared room options, including short-term stays on request. Rooms come furnished with a queen bed, study desk, Smart TV, and a mini-fridge and microwave. Programming takes place at both Seton and Mansfield, and Times Square and Grand Central are a five-minute walk.",
    included: [
      "Single and shared room options",
      "Short-term stays on request",
      "All utilities",
      "Furniture and furnishings",
      "High-speed Wi-Fi",
      "Fitness center, lounge and shared kitchen",
    ],
    photos: [
      { src: "/images/mansfield/1.webp", alt: "Mansfield guest room with queen bed, desk and floor lamp" },
      { src: "/images/mansfield/2.webp", alt: "Mansfield room with bay windows, mini-fridge and microwave" },
      { src: "/images/mansfield/3.webp", alt: "Mansfield guest room with wall-mounted TV and bathroom" },
      { src: "/images/mansfield/4.webp", alt: "Mansfield wood-paneled lounge with fireplace and TV" },
      { src: "/images/mansfield/5.webp", alt: "Mansfield shared kitchen and dining area" },
      { src: "/images/mansfield/6.webp", alt: "Mansfield lobby with ornate ceiling and front desk" },
      { src: "/images/mansfield/7.webp", alt: "The Mansfield facade on West 44th Street" },
    ],
    cover: "/images/mansfield/7.webp",
    coverAlt: "The Mansfield facade on West 44th Street",
  },
};

// Organizer request 2026-07-20: Mansfield first, then Seton, then Stratford.
export const BUILDING_LIST = [BUILDINGS.mansfield, BUILDINGS.seton, BUILDINGS.stratford];

// ---- Room types (sub-listings) ----
// Each bookable room type has its own backend listing; the slug here IS the
// backend building id the quote/booking API expects. Weekly rates mirror the
// backend and are display copy only; Mansfield rates are the 6+ month base
// prices (1-3 months +25%, 3-6 months +15%, applied by the backend quote).

export interface RoomType {
  slug: string; // backend listing id, e.g. "mansfield-studio-king"
  building: BuildingSlug;
  name: string; // short name shown on cards, e.g. "Studio King"
  weeklyRateCents: number;
  bed: string;
  bathroom: string;
  summary: string;
  photos: { src: string; alt: string; pos?: string }[];
}

export const ROOM_TYPES: RoomType[] = [
  {
    slug: "mansfield-semi-basic",
    building: "mansfield",
    name: "Semi Private Basic",
    weeklyRateCents: 57500,
    bed: "Queen bed",
    bathroom: "Shared with one adjacent room",
    summary:
      "Budget-friendly with a private-room feel: queen bed, study desk and nightstand; the bathroom is shared with one adjacent room.",
    photos: [
      { src: "/images/mansfield/1.webp", alt: "Mansfield semi-private room with queen bed, desk and floor lamp" },
      { src: "/images/mansfield/2.webp", alt: "Mansfield semi-private room with bay windows, mini-fridge and microwave" },
      { src: "/images/mansfield/3.webp", alt: "Mansfield semi-private room with wall-mounted TV" },
    ],
  },
  {
    slug: "mansfield-semi-plus",
    building: "mansfield",
    name: "Semi Private Plus",
    weeklyRateCents: 59500,
    bed: "Queen bed",
    bathroom: "Shared with one adjacent room",
    summary:
      "A more spacious semi-private room: queen bed, study desk and extra floor space, with the bathroom shared with one adjacent room.",
    photos: [
      { src: "/images/mansfield/semi-plus-1.webp", alt: "Mansfield Semi Private Plus room with queen bed and desk" },
      { src: "/images/mansfield/semi-plus-2.webp", alt: "Mansfield Semi Private Plus room, seating corner" },
      { src: "/images/mansfield/semi-plus-3.webp", alt: "Mansfield Semi Private Plus room with window view" },
    ],
  },
  {
    slug: "mansfield-studio-basic",
    building: "mansfield",
    name: "Studio Basic",
    weeklyRateCents: 69500,
    bed: "Queen bed",
    bathroom: "Private en-suite",
    summary:
      "A studio-style room with its own entrance from the hallway. Nothing is shared: private bathroom, own study desk, queen bed.",
    photos: [
      { src: "/images/mansfield/studio-basic-1.webp", alt: "Mansfield Studio Basic room with queen bed" },
      { src: "/images/mansfield/studio-basic-2.webp", alt: "Mansfield Studio Basic room, desk and TV" },
      { src: "/images/mansfield/studio-basic-3.webp", alt: "Mansfield Studio Basic private bathroom" },
    ],
  },
  {
    slug: "mansfield-studio-plus",
    building: "mansfield",
    name: "Studio Plus",
    weeklyRateCents: 72500,
    bed: "Queen bed",
    bathroom: "Private en-suite",
    summary:
      "A brighter, larger studio-style room with its own entrance from the hallway, private bathroom, study desk and queen bed.",
    photos: [
      { src: "/images/mansfield/studio-plus-1.webp", alt: "Mansfield Studio Plus room with queen bed and bright windows" },
      { src: "/images/mansfield/studio-plus-2.webp", alt: "Mansfield Studio Plus room, work desk" },
      { src: "/images/mansfield/studio-plus-3.webp", alt: "Mansfield Studio Plus room interior" },
    ],
  },
  {
    slug: "mansfield-studio-king",
    building: "mansfield",
    name: "Studio King",
    weeklyRateCents: 74500,
    bed: "King bed",
    bathroom: "Private en-suite",
    summary:
      "The largest room at the Mansfield: king bed, private entrance from the hallway, private bathroom and the most living space.",
    photos: [
      { src: "/images/mansfield/studio-king-1.webp", alt: "Mansfield Studio King room with king bed" },
      { src: "/images/mansfield/studio-king-2.webp", alt: "Mansfield Studio King room, lounge corner" },
      { src: "/images/mansfield/studio-king-3.webp", alt: "Mansfield Studio King room with desk and TV" },
    ],
  },
  {
    slug: "seton-deluxe",
    building: "seton",
    name: "Deluxe Room",
    weeklyRateCents: 52500,
    bed: "Full-size bed",
    bathroom: "Private en-suite",
    summary:
      "A comfortable private room with a full-size bed, study desk, nightstand and flat TV, with a private en-suite bathroom.",
    photos: [
      { src: "/images/seton/deluxe-1.webp", alt: "Seton Deluxe room with full-size bed and desk" },
      { src: "/images/seton/deluxe-2.webp", alt: "Seton Deluxe room interior" },
      { src: "/images/seton/deluxe-3.webp", alt: "Seton Deluxe room with TV and nightstand" },
    ],
  },
  {
    slug: "seton-studio-basic",
    building: "seton",
    name: "Studio Basic",
    weeklyRateCents: 65000,
    bed: "Queen bed",
    bathroom: "Private en-suite",
    summary:
      "A private, hotel-style room similar to a small studio apartment, with a private en-suite bathroom inside the room.",
    photos: [
      { src: "/images/seton/studio-basic-1.webp", alt: "Seton Studio Basic room with queen bed" },
      { src: "/images/seton/studio-basic-2.webp", alt: "Seton Studio Basic room, desk and window" },
      { src: "/images/seton/studio-basic-3.webp", alt: "Seton Studio Basic room interior" },
    ],
  },
  {
    slug: "seton-king-studio",
    building: "seton",
    name: "King Studio",
    weeklyRateCents: 74500,
    bed: "King bed",
    bathroom: "Private en-suite",
    summary:
      "The largest room at Seton: king bed and the most living space, run like a studio with a private en-suite bathroom.",
    photos: [
      { src: "/images/seton/king-studio-1.webp", alt: "Seton King Studio room with king bed" },
      { src: "/images/seton/king-studio-2.webp", alt: "Seton King Studio room, seating area" },
      { src: "/images/seton/king-studio-3.webp", alt: "Seton King Studio room with desk" },
    ],
  },
  {
    slug: "stratford-private",
    building: "stratford",
    name: "Private Room",
    weeklyRateCents: 40000,
    bed: "Single bed",
    bathroom: "Shared bathrooms on the floor",
    summary:
      "A basic, dorm-style private room at the lower-cost Stratford, with shared bathrooms on the floor and shared common spaces.",
    photos: [
      { src: "/images/stratford/s7.jpeg", alt: "Stratford dorm room with bed, desk and rug" },
      { src: "/images/stratford/s6.jpeg", alt: "Stratford dorm room with single bed, nightstand and window", pos: "center 72%" },
    ],
  },
  {
    slug: "stratford-jack-jill",
    building: "stratford",
    name: "Jack and Jill",
    weeklyRateCents: 45000,
    bed: "Single bed",
    bathroom: "Shared with one neighboring room",
    summary:
      "A dorm-style room where the bathroom is shared with just one neighboring room instead of the whole floor.",
    photos: [
      { src: "/images/stratford/s6.jpeg", alt: "Stratford dorm room with single bed, nightstand and window", pos: "center 72%" },
      { src: "/images/stratford/s7.jpeg", alt: "Stratford dorm room with bed, desk and rug" },
    ],
  },
];

export function roomTypesFor(building: BuildingSlug): RoomType[] {
  return ROOM_TYPES.filter((r) => r.building === building);
}

export function roomTypeBySlug(slug: string | undefined | null): RoomType | null {
  return ROOM_TYPES.find((r) => r.slug === slug) ?? null;
}

// Lowest active room-type rate, for "from $X/week" copy.
export function fromRateCents(building: BuildingSlug): number {
  return Math.min(...roomTypesFor(building).map((r) => r.weeklyRateCents));
}

// Where old parent-building deep links land: the room type whose price the
// site advertised before sub-listings existed.
export const DEFAULT_ROOM: Record<BuildingSlug, string> = {
  mansfield: "mansfield-semi-basic",
  seton: "seton-studio-basic",
  stratford: "stratford-private",
};

// Only Mansfield rooms carry the stay-length premium (base = 6+ month rate).
export function hasStayPremium(building: BuildingSlug): boolean {
  return building === "mansfield";
}
