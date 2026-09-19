export interface StayHWUnit {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  guests: number;
  bedrooms: number;
  fromCents: number;
}

export interface StayHWUnitDetail {
  unit: StayHWUnit;
  photos: string[]; // gallery order, featured image first
  description: string[]; // paragraphs, plain text
  bathrooms: number | null;
  checkInHour: string | null; // "16:00"
  checkOutHour: string | null;
  amenities: { group: string; items: string[] }[];
  airbnbUrl: string | null; // StayHW's "Book at Airbnb" link for this unit
}

export interface StayHWCalendar {
  unit: StayHWUnit;
  prices: Record<string, number>;
  blockedDates: string[];
  minNights: number;
  checkInDay: number;
  changeoverDay: number;
  dateRules: Record<string, {
    minNights: number;
    checkInDay: number;
    changeoverDay: number;
  }>;
  fetchedAt: string;
}

export interface StayHWQuote {
  unitId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  rentCents: number;
  cleaningCents: number;
  extraGuestCents: number;
  taxCents: number;
  totalCents: number;
  depositCents: number; // charged at StayHW's checkout
  balanceCents: number; // the remainder StayHW collects later
  fetchedAt: string;
}

export interface StayHWOwnerMessage {
  name: string;
  email: string;
  phone: string;
  checkIn: string; // YYYY-MM-DD, or "" when the guest gave no dates
  checkOut: string;
  guests: number;
  message: string;
}
