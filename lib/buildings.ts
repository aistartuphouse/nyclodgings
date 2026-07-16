// Static building content (mirrors the backend seed and the accommodation
// guide PDF). Rates are display copy here; the backend quote is the source
// of truth for money.

export interface BuildingContent {
  slug: "seton" | "stratford";
  name: string;
  address: string;
  neighborhood: string;
  weeklyRateCents: number;
  tagline: string;
  style: string;
  bathroom: string;
  commute: string;
  commuteShort: string;
  description: string;
  included: string[];
  photos: { src: string; alt: string; pos?: string }[];
  cover: string;
  coverAlt: string;
}

export const BUILDINGS: Record<"seton" | "stratford", BuildingContent> = {
  seton: {
    slug: "seton",
    name: "Seton",
    address: "144 East 40th Street",
    neighborhood: "Murray Hill, Manhattan",
    weeklyRateCents: 65000,
    tagline: "Studio-style room, program on site",
    style: "Private hotel room (studio-style)",
    bathroom: "Private en-suite bathroom, inside the room",
    commute: "All main activities and presentations are held at Seton, so you stay in the building where the program happens. No commute at all.",
    commuteShort: "On site",
    description:
      "Each guest has a private, hotel-style room, similar to a small studio apartment, with a private en-suite bathroom inside the room. The boot camp's main activities and presentations take place at Seton.",
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
    weeklyRateCents: 45000,
    tagline: "Dorm-style, lower cost",
    style: "Basic, dorm-style room",
    bathroom: "Shared bathrooms",
    commute: "Main activities and presentations are held at Seton (144 E 40th St). From Stratford that is roughly two miles, about 20 minutes by subway.",
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
};

export const BUILDING_LIST = [BUILDINGS.seton, BUILDINGS.stratford];
