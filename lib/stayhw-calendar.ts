import type { StayHWCalendar } from "./stayhw-types";

export function isCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function addDays(value: string, days: number): string {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// StayHW's date format is mm-dd-yy (jQuery UI: four-digit year). A two-digit
// year is accepted but always answers "run", including for reserved nights.
export function siteDate(date: string): string {
  return `${date.slice(5, 7)}-${date.slice(8, 10)}-${date.slice(0, 4)}`;
}

// The unit's page on stayhw.com with its "Book Now" card already filled in.
// StayHW's checkout is a WooCommerce cart held in the visitor's own session
// on stayhw.com, so the booking itself has to start in their browser, there.
export function stayHWCheckoutUrl(slug: string, checkIn: string, checkOut: string, guests: number): string {
  const url = new URL(`https://stayhw.com/properties/${encodeURIComponent(slug)}/`);
  if (checkIn && checkOut) { url.searchParams.set("check_in_prop", siteDate(checkIn)); url.searchParams.set("check_out_prop", siteDate(checkOut)); }
  if (guests > 0) url.searchParams.set("guest_no_prop", String(guests));
  return url.href;
}

export function todayLA(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

export interface StaySearch { checkIn: string; checkOut: string; guests: number } // "" and 0 mean "any"
export const MAX_SEARCH_GUESTS = 16; // StayHW's own guest dropdown stops at 16.

// Reads untrusted query values. Dates count only as a complete, future,
// ordered pair; anything else is dropped rather than rejected.
export function parseStaySearch(values: { checkIn?: unknown; checkOut?: unknown; guests?: unknown }): StaySearch {
  const guests = Number(values.guests);
  const datesOk = isCalendarDate(values.checkIn) && isCalendarDate(values.checkOut) && values.checkIn >= todayLA() && values.checkOut > values.checkIn && values.checkOut <= addDays(values.checkIn, 366);
  return {
    checkIn: datesOk ? (values.checkIn as string) : "",
    checkOut: datesOk ? (values.checkOut as string) : "",
    guests: Number.isInteger(guests) && guests >= 1 && guests <= MAX_SEARCH_GUESTS ? guests : 0,
  };
}

export function staySearchQuery(search: StaySearch, source?: string | null): string {
  const params = new URLSearchParams();
  if (search.checkIn && search.checkOut) { params.set("checkIn", search.checkIn); params.set("checkOut", search.checkOut); }
  if (search.guests) params.set("guests", String(search.guests));
  if (source) params.set("ref", source);
  const query = params.toString();
  return query ? `?${query}` : "";
}

function weekday(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay() || 7;
}

export function stayError(calendar: StayHWCalendar, checkIn: string, checkOut: string, guests: number): string | null {
  if (!isCalendarDate(checkIn) || !isCalendarDate(checkOut)) return "Choose your check-in and check-out dates.";
  if (checkIn < todayLA()) return "Check-in must be today or later.";
  const nights = Math.round((Date.parse(`${checkOut}T12:00:00Z`) - Date.parse(`${checkIn}T12:00:00Z`)) / 86400000);
  if (nights < 1 || nights > 366) return "Choose a stay between 1 and 366 nights.";
  if (!Number.isInteger(guests) || guests < 1 || guests > calendar.unit.guests) return `Choose between 1 and ${calendar.unit.guests} guests.`;
  const rules = calendar.dateRules[checkIn];
  const minNights = rules?.minNights || calendar.minNights;
  if (nights < minNights) return `This arrival date requires at least ${minNights} nights.`;
  const arrivalDay = rules?.checkInDay || calendar.checkInDay;
  const changeover = rules?.changeoverDay || calendar.changeoverDay;
  const weekdays = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  if (arrivalDay > 0 && weekday(checkIn) !== arrivalDay) return `Check-in must be on ${weekdays[arrivalDay]}.`;
  if (changeover > 0 && (weekday(checkIn) !== changeover || weekday(checkOut) !== changeover)) return `Check-in and check-out must be on ${weekdays[changeover]}.`;
  const blocked = new Set(calendar.blockedDates);
  for (let day = checkIn; day < checkOut; day = addDays(day, 1)) {
    if (!(day in calendar.prices)) return "Some dates are outside the published calendar. Choose dates shown in the calendar.";
    if (blocked.has(day)) return "This stay includes unavailable nights. Choose another unit or different dates.";
  }
  return null;
}
