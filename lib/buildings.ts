// Static building content (mirrors the backend seed). Rates are display copy
// here; the backend quote is the source of truth for money, and every booking
// is created by the housing team from an application (instant booking left
// the site on 2026-09-08).
//
// Portfolio since 2026-09-08 (CEO request):
//   Mansfield (NYC)  - short-term building, ONE room type (Shared Suite),
//                      priced per night under a month and per month from 30
//                      nights, with lower monthly rates from 3 and 5 months.
//   Seton (NYC)      - multi-month only, 4 months (120 nights) or longer,
//                      weekly rates unchanged.
//   Capitol (Austin) - new, multi-month, 3 months (90 nights) or longer,
//                      weekly all-inclusive rates, Texas + City of Austin
//                      hotel tax (17%) instead of the NYC bands. Three room
//                      types since 2026-09-10: Sunroom $180, Deluxe $210,
//                      Loft $240 (the 09-08 $650/$900 figures were wrong).
//   Stratford        - retired.

export type BuildingSlug = "mansfield" | "seton" | "capitol";
export type City = "New York" | "Austin";
export type TaxProfile = "nyc" | "austin";

// Mirrors buildings.public_min_nights in the backend; keep in sync.
export const PUBLIC_MIN_NIGHTS: Record<BuildingSlug, number> = {
  mansfield: 7,
  seton: 120,
  capitol: 90,
};

// The Mansfield schedule, mirrors MONTHLY_PRICING in the backend's pricing.ts.
export const MANSFIELD_PRICING = {
  nightlyCents: 15000,
  tiers: [
    { minNights: 30, monthlyCents: 360000, label: "1 to 2 months" },
    { minNights: 90, monthlyCents: 320000, label: "3 to 4 months" },
    { minNights: 150, monthlyCents: 280000, label: "5 months or longer" },
  ],
} as const;

export interface BuildingContent {
  slug: BuildingSlug;
  name: string;
  city: City;
  address: string;
  neighborhood: string;
  taxProfile: TaxProfile;
  // "from $150" + "per night" / "from $525" + "per week"
  fromAmountCents: number;
  fromUnit: "night" | "week";
  tagline: string;
  style: string;
  bathroom: string;
  roomsLabel: string;
  roomTypeShort: string;
  bathroomShort: string;
  minStay: string;
  minStayShort: string;
  commute: string;
  commuteShort: string;
  description: string;
  included: string[];
  photos: { src: string; alt: string; pos?: string }[];
  cover: string;
  coverAlt: string;
}

export const BUILDINGS: Record<BuildingSlug, BuildingContent> = {
  mansfield: {
    slug: "mansfield",
    name: "Mansfield",
    city: "New York",
    address: "12 West 44th Street",
    neighborhood: "Midtown Manhattan",
    taxProfile: "nyc",
    fromAmountCents: 15000,
    fromUnit: "night",
    tagline: "Short-term lodging, heart of Midtown",
    style: "Private room, shared bathroom with one neighbour",
    bathroom: "Bathroom shared with one adjacent room",
    roomsLabel: "Short-term lodging",
    roomTypeShort: "Private room",
    bathroomShort: "Shared with one room",
    minStay: "From one week; nightly under a month, monthly from 30 nights",
    minStayShort: "One week",
    commute: "Programming takes place at both Seton and Mansfield, so many sessions happen right in the building. Seton is under a mile away, about a 15-minute walk.",
    commuteShort: "On site",
    description:
      "The Mansfield is the short-term building: a historic boutique hotel on West 44th Street with private rooms for stays from one week upwards. Every room has a queen bed, study desk and nightstand, and locks like any hotel room; the bathroom is shared with the one room next door. Under a month you pay per night; from 30 nights you pay per month, and the monthly rate drops from three and again from five months. Programming takes place at both Seton and Mansfield, and Times Square and Grand Central are a five-minute walk.",
    included: [
      "Private room, queen bed, study desk",
      "Bathroom shared with one adjacent room",
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
  seton: {
    slug: "seton",
    name: "Seton",
    city: "New York",
    address: "144 East 40th Street",
    neighborhood: "Murray Hill, Manhattan",
    taxProfile: "nyc",
    fromAmountCents: 52500,
    fromUnit: "week",
    tagline: "Hotel-style room, program on site",
    style: "Hotel-style room (studio layout)",
    bathroom: "Private en-suite bathroom, inside the room",
    roomsLabel: "Hotel-style rooms",
    roomTypeShort: "Hotel-style studio",
    bathroomShort: "En-suite bathroom",
    minStay: "Multi-month stays only (4 months or longer)",
    minStayShort: "Four months",
    commute: "Programming takes place at both Seton and Mansfield. Sessions at Seton happen in your building; Mansfield is about a 15-minute walk.",
    commuteShort: "On site",
    description:
      "Each guest has a private, hotel-style room, similar to a small studio apartment, with a private en-suite bathroom inside the room. The residency's activities and presentations take place at Seton and Mansfield. Seton is multi-month lodging: stays start at four months. For a shorter stay, ask about the Mansfield.",
    included: [
      "Hotel-style room (studio layout)",
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
  capitol: {
    slug: "capitol",
    name: "Capitol",
    city: "Austin",
    address: "1108 Nueces Street",
    neighborhood: "Downtown Austin",
    taxProfile: "austin",
    fromAmountCents: 18000,
    fromUnit: "week",
    tagline: "Austin: private rooms and a loft suite, downtown",
    style: "Private bedroom in a shared apartment, or an open-plan loft suite",
    bathroom: "Two full bathrooms shared within the apartment; the Loft has its own",
    roomsLabel: "Austin residence",
    roomTypeShort: "Bedroom or loft suite",
    bathroomShort: "Two per apartment",
    minStay: "Multi-month stays only (3 months or longer)",
    minStayShort: "Three months",
    commute: "Capitol is the house for the Austin program. It sits two blocks west of the Texas State Capitol, a 15-minute walk from UT Austin and three blocks from 6th Street.",
    commuteShort: "Downtown Austin",
    description:
      "Capitol is a contemporary five-story building in the heart of Downtown Austin. Each apartment has four private bedrooms plus a sunroom set around an open kitchen and living area, with two full bathrooms, quartz counters, stainless appliances and polished concrete floors. You take one private room, the Sunroom or the Deluxe, and share the kitchen and bathrooms with your apartment-mates; the Loft is an open-plan suite with its own kitchen and bathroom. Every rate is all-inclusive. The building has a fitness center, a designer lobby, secure gated entry, bike storage, a rooftop terrace and free laundry on every floor. Capitol is multi-month lodging: stays start at three months.",
    included: [
      "Private bedroom or loft suite, study desk",
      "Shared kitchen with dishwasher, two full bathrooms (the Loft has its own)",
      "All utilities, internet and Wi-Fi",
      "Furniture and furnishings",
      "Fitness center and rooftop terrace",
      "Free laundry on every floor",
    ],
    photos: [
      { src: "/images/capitol/1.webp", alt: "Capitol building exterior on Nueces Street, Downtown Austin" },
      { src: "/images/capitol/2.webp", alt: "Capitol resident lounge with sofas, dining table and city views" },
      { src: "/images/capitol/3.webp", alt: "Capitol apartment kitchen with island, quartz counters and stainless appliances" },
      { src: "/images/capitol/4.webp", alt: "Capitol fitness center with squat rack, free weights and cardio machines" },
      { src: "/images/capitol/5.webp", alt: "Capitol lobby with botanical mural, wood-slat ceiling and mailboxes" },
      { src: "/images/capitol/6.webp", alt: "Capitol rooftop terrace with dining table and downtown Austin skyline" },
      { src: "/images/capitol/7.webp", alt: "Capitol study room with long wooden table and bookshelves" },
    ],
    cover: "/images/capitol/1.webp",
    coverAlt: "Capitol building exterior on Nueces Street, Downtown Austin",
  },
};

// Site order: Mansfield, Seton, then Capitol.
export const BUILDING_LIST = [BUILDINGS.mansfield, BUILDINGS.seton, BUILDINGS.capitol];

// ---- Room types (sub-listings) ----
// Each room type has its own backend listing; the slug here IS the backend
// building id the application form sends as the preference.

export type RoomRate =
  | { kind: "weekly"; weeklyRateCents: number }
  | { kind: "monthly"; nightlyCents: number; tiers: readonly { minNights: number; monthlyCents: number; label: string }[] };

export interface RoomType {
  slug: string; // backend listing id, e.g. "capitol-loft"
  building: BuildingSlug;
  name: string; // short name shown on cards, e.g. "Loft"
  rate: RoomRate;
  bed: string;
  bathroom: string;
  summary: string;
  photos: { src: string; alt: string; pos?: string }[];
}

export const ROOM_TYPES: RoomType[] = [
  {
    slug: "mansfield-semi-basic",
    building: "mansfield",
    name: "Shared Suite",
    rate: { kind: "monthly", nightlyCents: MANSFIELD_PRICING.nightlyCents, tiers: MANSFIELD_PRICING.tiers },
    bed: "Queen bed",
    bathroom: "Shared with one adjacent room",
    summary:
      "Your own room: queen bed, study desk and nightstand. Only the bathroom is shared, with the one room next door. Priced per night under a month, per month from 30 nights.",
    photos: [
      { src: "/images/mansfield/1.webp", alt: "Mansfield Shared Suite with queen bed, desk and floor lamp" },
      { src: "/images/mansfield/2.webp", alt: "Mansfield Shared Suite with bay windows, mini-fridge and microwave" },
      { src: "/images/mansfield/3.webp", alt: "Mansfield Shared Suite with wall-mounted TV" },
    ],
  },
  {
    slug: "seton-deluxe",
    building: "seton",
    name: "Deluxe Room",
    rate: { kind: "weekly", weeklyRateCents: 52500 },
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
    rate: { kind: "weekly", weeklyRateCents: 65000 },
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
    rate: { kind: "weekly", weeklyRateCents: 74500 },
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
    slug: "capitol-loft",
    building: "capitol",
    name: "Loft",
    rate: { kind: "weekly", weeklyRateCents: 24000 },
    bed: "Two queen sofa beds",
    bathroom: "Private bathroom inside the loft",
    summary:
      "An open-plan loft suite rather than a bedroom: your own full kitchen and bathroom, two queen sofa beds, a big Smart TV, a dining table for eight and a dedicated workspace, with floor-to-ceiling windows over downtown and access to the terrace. Everything included.",
    photos: [
      { src: "/images/capitol/loft-1.webp", alt: "Capitol Loft suite: open-plan living area with kitchen, dining table and sofas" },
      { src: "/images/capitol/loft-2.webp", alt: "Capitol Loft suite: queen sofa beds with downtown Austin views" },
      { src: "/images/capitol/loft-3.webp", alt: "Capitol Loft suite: dining table for eight beside the kitchen and bed" },
    ],
  },
  {
    slug: "capitol-deluxe",
    building: "capitol",
    name: "Deluxe",
    rate: { kind: "weekly", weeklyRateCents: 21000 },
    bed: "Full-size bed",
    bathroom: "Two full bathrooms shared in the apartment",
    summary:
      "The signature private room: full-size bed, study desk, nightstand and a 55-inch Smart TV, with big windows and plenty of natural light. Kitchen and the two bathrooms are shared with your apartment-mates. Everything included.",
    photos: [
      { src: "/images/capitol/deluxe-1.webp", alt: "Capitol Deluxe bedroom with bed, desk and armchair" },
      { src: "/images/capitol/deluxe-2.webp", alt: "Capitol Deluxe bedroom with two windows and clothes rack" },
      { src: "/images/capitol/deluxe-3.webp", alt: "Capitol Deluxe bedroom with bed, nightstand and wall art" },
    ],
  },
  {
    slug: "capitol-sunroom",
    building: "capitol",
    name: "Sunroom",
    rate: { kind: "weekly", weeklyRateCents: 18000 },
    bed: "Twin bed",
    bathroom: "Two full bathrooms shared in the apartment",
    summary:
      "The most budget-friendly room: the apartment's sunroom set up as a private bedroom with a twin bed, study desk, nightstand and a Smart TV behind a curtain partition. Bright, with less sound isolation than the Deluxe. Everything included.",
    photos: [
      { src: "/images/capitol/sunroom-1.webp", alt: "Capitol Sunroom bedroom with desk, gallery wall and city view" },
      { src: "/images/capitol/sunroom-2.webp", alt: "Capitol Sunroom with curtain partition, wall-mounted TV and desk", pos: "50% 60%" },
      { src: "/images/capitol/sunroom-3.webp", alt: "Capitol Sunroom bedroom with bed, wall-mounted TV and clothes rack", pos: "50% 60%" },
    ],
  },
];

export function roomTypesFor(building: BuildingSlug): RoomType[] {
  return ROOM_TYPES.filter((r) => r.building === building);
}

export function roomTypeBySlug(slug: string | undefined | null): RoomType | null {
  return ROOM_TYPES.find((r) => r.slug === slug) ?? null;
}

export function isBuildingSlug(value: string | undefined | null): value is BuildingSlug {
  return value === "mansfield" || value === "seton" || value === "capitol";
}

// The headline price on a room card: "$150" + "/night" or "$900" + "/week".
export function rateHeadline(rate: RoomRate): { amountCents: number; unit: "night" | "week" } {
  return rate.kind === "monthly"
    ? { amountCents: rate.nightlyCents, unit: "night" }
    : { amountCents: rate.weeklyRateCents, unit: "week" };
}
