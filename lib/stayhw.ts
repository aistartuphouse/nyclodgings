import "server-only";
import type { StayHWCalendar, StayHWOwnerMessage, StayHWQuote, StayHWUnit, StayHWUnitDetail } from "./stayhw-types";
import { siteDate, stayError } from "./stayhw-calendar";

const ORIGIN = "https://stayhw.com";
const pages = new Map<string, { expires: number; result: Promise<{ html: string; fetchedAt: string }> }>();

export class StayHWError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

// These are JSON literals embedded by WordPress, not executable JavaScript.
export function jsonVariable(html: string, name: string): Record<string, unknown> {
  const match = new RegExp(`\\bvar\\s+${name}\\s*=\\s*`).exec(html);
  if (!match) throw new StayHWError("StayHW's calendar format has changed. Please try again later.");
  const start = match.index + match[0].length;
  let depth = 0, quoted = false, escaped = false;
  for (let i = start; i < html.length; i++) {
    const char = html[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') quoted = false;
    } else {
      if (char === '"') quoted = true;
      else if (char === "{" || char === "[") depth++;
      else if (char === "}" || char === "]") {
        depth--;
        if (depth === 0) return JSON.parse(html.slice(start, i + 1));
      }
    }
  }
  throw new StayHWError("StayHW's calendar could not be read.");
}

function entityText(value: string): string {
  return value.replace(/&#(x[\da-f]+|\d+);/gi, (_, code: string) => {
    const n = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
  }).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;|&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

async function htmlPage(path: string, ttlMs = 300000): Promise<{ html: string; fetchedAt: string }> {
  const cached = pages.get(path);
  if (cached && cached.expires > Date.now()) return cached.result;
  const result = loadHtmlPage(path).catch((error) => { pages.delete(path); throw error; });
  pages.delete(path);
  pages.set(path, { expires: Date.now() + ttlMs, result });
  // Search URLs are visitor-chosen; drop the oldest entries to bound memory.
  while (pages.size > 150) pages.delete(pages.keys().next().value as string);
  return result;
}

async function loadHtmlPage(path: string): Promise<{ html: string; fetchedAt: string }> {
  const url = new URL(path, ORIGIN);
  // The unqualified URLs served expired nonces and old calendars in testing.
  // A five-minute bucket avoids that page cache without one URL per visitor.
  url.searchParams.set("ash_calendar", String(Math.floor(Date.now() / 300000)));
  // WordPress's catalogue exceeds Next's 2 MB fetch-cache limit. The bounded
  // process cache above retains the original fetch timestamp and deduplicates reads.
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new StayHWError("StayHW is temporarily unavailable. Please try again later.");
  return { html: await response.text(), fetchedAt: new Date().toISOString() };
}

export async function getStayHWUnits(): Promise<StayHWUnit[]> {
  const { html } = await htmlPage("/advanced-search-3/");
  const listingMatches = [...html.matchAll(/data-listid=["'](\d+)["'][\s\S]*?data-link=["']https:\/\/stayhw\.com\/properties\/([a-z0-9-]+)\/["']/g)];
  if (!listingMatches.length) throw new StayHWError("StayHW's units could not be loaded.");
  const listed = new Map(listingMatches.map((match) => [Number(match[1]), match[2]]));
  // Search-page map markers are empty because its map is disabled. Property
  // pages carry the portfolio's marker data, including capacities and bedrooms.
  const property = await htmlPage(`/properties/${listingMatches[0][2]}/`);
  const config = jsonVariable(property.html, "googlecode_property_vars");
  const markers = JSON.parse(String(config.markers)) as unknown[][];
  const units = new Map<number, StayHWUnit>();
  for (const row of markers) {
    const url = new URL(decodeURIComponent(String(row[9])));
    const slug = /^\/properties\/([a-z0-9-]+)\/$/.exec(url.pathname)?.[1];
    const id = Number(row[10]);
    if (url.origin !== ORIGIN || !slug || !Number.isSafeInteger(id) || id < 1 || listed.get(id) !== slug) continue;
    const image = new URL(decodeURIComponent(String(row[4])), ORIGIN);
    units.set(id, {
      id, slug, name: entityText(decodeURIComponent(String(row[0]))),
      image: image.origin === ORIGIN && image.pathname.startsWith("/wp-content/uploads/") ? image.href : null,
      fromCents: Math.round(Number(row[13]) * 100), bedrooms: Number(row[14]), guests: Number(row[15]),
    });
  }
  // WP Rentals caps its map data at 30 listings. Load metadata for the
  // remaining public cards in small batches, including newly added listings.
  const missing = listingMatches.filter((match) => !units.has(Number(match[1])));
  for (let offset = 0; offset < missing.length; offset += 3) {
    await Promise.all(missing.slice(offset, offset + 3).map(async (match) => {
      const id = Number(match[1]);
      const slug = match[2];
      const index = listingMatches.indexOf(match);
      const card = html.slice(match.index, listingMatches[index + 1]?.index);
      const page = await htmlPage(`/properties/${slug}/`);
      const guests = Number(/data-maxguest=["'](\d+)["']/.exec(page.html)?.[1]);
      const bedrooms = Number(/Bedrooms:\s*<\/span>\s*(\d+)/.exec(page.html)?.[1]);
      const name = /itemprop=["']name["'][^>]*>([\s\S]*?)<\/span>/.exec(card)?.[1];
      const price = /class=["']price_unit["'][^>]*>[\s\S]*?\$([\d,.]+)/.exec(card)?.[1];
      const imageSrc = /itemprop=["']image["'][^>]*src=["']([^"']+)["']/.exec(card)?.[1];
      const image = imageSrc ? new URL(entityText(imageSrc), ORIGIN) : null;
      if (!name || !price || !Number.isInteger(guests) || guests < 1 || !Number.isInteger(bedrooms) || bedrooms < 0) throw new StayHWError("StayHW's unit details could not be loaded.");
      units.set(id, { id, slug, name: entityText(name.replace(/<[^>]*>/g, "").trim()), guests, bedrooms,
        fromCents: Math.round(Number(price.replace(/,/g, "")) * 100),
        image: image?.origin === ORIGIN && image.pathname.startsWith("/wp-content/uploads/") ? image.href : null,
      });
    }));
  }
  if (units.size !== listed.size) throw new StayHWError("StayHW's complete unit list could not be loaded. Please try again later.");
  return [...units.values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

// StayHW's own search: the listings free for every night of the stay that
// sleep the group. Dates use the site format (mm-dd-yyyy); no token is needed.
export async function searchStayHWUnits(checkIn: string | null, checkOut: string | null, guests: number | null): Promise<number[]> {
  const params = new URLSearchParams();
  if (checkIn && checkOut) { params.set("check_in", siteDate(checkIn)); params.set("check_out", siteDate(checkOut)); }
  if (guests) params.set("guest_no", String(guests));
  const [units, page] = await Promise.all([getStayHWUnits(), htmlPage(`/advanced-search-3/?${params}`, 60000)]);
  const found = new Set([...page.html.matchAll(/data-listid=["'](\d+)["']/g)].map((match) => Number(match[1])));
  return units.filter((unit) => found.has(unit.id)).map((unit) => unit.id);
}

function timestampDate(value: string): string {
  if (!/^\d{10}$/.test(value)) throw new StayHWError("StayHW returned an invalid calendar date.");
  return new Date(Number(value) * 1000).toISOString().slice(0, 10);
}

function embeddedObject(config: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = config[key];
  if (!value) return {};
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

async function unitPage(id: number) {
  const units = await getStayHWUnits();
  const unit = units.find((u) => u.id === id);
  if (!unit) throw new StayHWError("That StayHW unit was not found.", 404);
  const page = await htmlPage(`/properties/${unit.slug}/`);
  return { ...page, unit };
}

function parseCalendar(unit: StayHWUnit, html: string, fetchedAt: string): StayHWCalendar {
  const config = jsonVariable(html, "control_vars_property");
  const prices: Record<string, number> = {};
  for (const [key, value] of Object.entries(embeddedObject(config, "custom_price"))) {
    const cents = Math.round(Number(value) * 100);
    if (Number.isFinite(cents) && cents >= 0) prices[timestampDate(key)] = cents;
  }
  const dateRules: StayHWCalendar["dateRules"] = {};
  for (const [key, value] of Object.entries(embeddedObject(config, "mega_details"))) {
    if (!value || typeof value !== "object") continue;
    const rule = value as Record<string, unknown>;
    dateRules[timestampDate(key)] = {
      minNights: Number(rule.period_min_days_booking) || 0,
      checkInDay: Number(rule.period_checkin_change_over) || 0,
      changeoverDay: Number(rule.period_checkin_checkout_change_over) || 0,
    };
  }
  if (!Object.keys(prices).length) throw new StayHWError("StayHW's nightly calendar is not available.");
  return {
    unit, prices, blockedDates: Object.keys(embeddedObject(config, "booking_array")).filter(Boolean).map(timestampDate).sort(),
    minNights: Math.max(1, Number(config.min_days_booking) || 1),
    checkInDay: Number(config.checkin_change_over) || 0,
    changeoverDay: Number(config.checkin_checkout_change_over) || 0,
    dateRules, fetchedAt,
  };
}

function plainText(html: string): string {
  return entityText(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "")).replace(/[ \t]+/g, " ").trim();
}

function uploadUrl(value: string): string | null {
  try {
    const url = new URL(entityText(value), ORIGIN);
    return url.origin === ORIGIN && url.pathname.startsWith("/wp-content/uploads/") ? url.href : null;
  } catch { return null; }
}

function parseDetail(unit: StayHWUnit, html: string): StayHWUnitDetail {
  // The lightbox list holds every photo at a sized rendition; the masonry
  // tiles reference unsized originals, some of which are 0-byte files.
  const galleryStart = html.indexOf("hidden_photos");
  const gallery = galleryStart < 0 ? "" : html.slice(galleryStart, html.indexOf("</div>", galleryStart));
  const photos = [...new Set([...gallery.matchAll(/<a\s+href=["']([^"']+)["']/g)].map((match) => uploadUrl(match[1])).filter((url): url is string => !!url))];
  if (!photos.length && unit.image) photos.push(unit.image);
  const descriptionHtml = /id=["']listing_description_content["'][^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1] ?? "";
  const description = descriptionHtml.split(/<\/p>/i).map(plainText).filter(Boolean);
  const detail = (label: string) => {
    const value = new RegExp(`<span class=["']item_head["']>${label}:</span>\\s*([^<]+)<`).exec(html)?.[1];
    return value ? entityText(value).trim() : null;
  };
  const amenities: StayHWUnitDetail["amenities"] = [];
  const featuresStart = html.search(/id=["']listing_ammenities["']/);
  if (featuresStart >= 0) {
    const nextPanel = html.indexOf("panel-wrapper", featuresStart);
    const features = html.slice(featuresStart, nextPanel < 0 ? featuresStart + 60000 : nextPanel);
    for (const chunk of features.split(/class=["']feature_chapter_name[^"']*["']>/).slice(1)) {
      const group = entityText(chunk.slice(0, chunk.indexOf("<"))).trim();
      const items = [...chunk.matchAll(/checkon["']><\/i>([^<]+)</g)].map((match) => entityText(match[1]).trim()).filter(Boolean);
      if (group && items.length) amenities.push({ group, items });
    }
  }
  const bathrooms = Number(detail("Bathrooms"));
  const airbnbHref = /id=["']book_airbnb["'][\s\S]{0,300}?href=["']([^"']+)["']/.exec(html)?.[1];
  let airbnbUrl: string | null = null;
  try {
    const link = airbnbHref ? new URL(entityText(airbnbHref)) : null;
    if (link && link.protocol === "https:" && /^(www\.)?airbnb\.(com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/.test(link.hostname)) airbnbUrl = link.href;
  } catch { /* not a usable link */ }
  return {
    unit, photos, description, amenities, airbnbUrl,
    bathrooms: Number.isFinite(bathrooms) && bathrooms > 0 ? bathrooms : null,
    checkInHour: detail("Check-in Hour"), checkOutHour: detail("Check-Out Hour"),
  };
}

export async function getStayHWUnitDetail(id: number): Promise<{ detail: StayHWUnitDetail; calendar: StayHWCalendar }> {
  const page = await unitPage(id);
  return { detail: parseDetail(page.unit, page.html), calendar: parseCalendar(page.unit, page.html, page.fetchedAt) };
}

export async function getStayHWCalendar(id: number): Promise<StayHWCalendar> {
  const page = await unitPage(id);
  return parseCalendar(page.unit, page.html, page.fetchedAt);
}

function quoteMoney(html: string, name: string): number {
  const match = new RegExp(`\\bvar\\s+${name}\\s*=\\s*["']([\\d.]+)["']`).exec(html);
  const cents = match ? Math.round(Number(match[1]) * 100) : NaN;
  if (!Number.isSafeInteger(cents) || cents < 0) throw new StayHWError("StayHW's price could not be calculated. Please try again later.");
  return cents;
}

function bookingToken(html: string): string {
  const token = /id=["']wprentals_add_booking["'][^>]*value=["']([^"']+)["']/.exec(html)?.[1];
  if (!token) throw new StayHWError("StayHW's booking service is temporarily unavailable.");
  return token;
}

// Live check against StayHW's reservations, which can be newer than the
// calendar embedded in the (page-cached) property HTML. Read-only.
async function assertStayHWAvailable(id: number, html: string, checkIn: string, checkOut: string): Promise<void> {
  const response = await fetch(`${ORIGIN}/wp-admin/admin-ajax.php`, {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(20000),
    body: new URLSearchParams({ action: "wpestate_ajax_check_booking_valability", book_from: siteDate(checkIn), book_to: siteDate(checkOut), listing_id: String(id), internal: "0", security: bookingToken(html) }),
  });
  if (!response.ok) throw new StayHWError("StayHW could not confirm these dates. Please try again later.");
  const answer = (await response.text()).trim();
  if (answer === "run") return;
  if (/reserved|^stop/i.test(answer)) throw new StayHWError("These dates are no longer available. Choose another unit or different dates.", 409);
  throw new StayHWError("StayHW could not confirm these dates. Please try again later.");
}

export async function checkStayHWStay(id: number, checkIn: string, checkOut: string, guests: number): Promise<StayHWCalendar> {
  const page = await unitPage(id);
  const calendar = parseCalendar(page.unit, page.html, page.fetchedAt);
  const error = stayError(calendar, checkIn, checkOut, guests);
  if (error) throw new StayHWError(error, 400);
  await assertStayHWAvailable(id, page.html, checkIn, checkOut);
  return calendar;
}

export async function getStayHWQuote(id: number, checkIn: string, checkOut: string, guests: number): Promise<StayHWQuote> {
  const page = await unitPage(id);
  const error = stayError(parseCalendar(page.unit, page.html, page.fetchedAt), checkIn, checkOut, guests);
  if (error) throw new StayHWError(error, 400);
  await assertStayHWAvailable(id, page.html, checkIn, checkOut);
  const token = bookingToken(page.html);
  const response = await fetch(`${ORIGIN}/wp-admin/admin-ajax.php`, {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(20000),
    body: new URLSearchParams({ action: "wpestate_ajax_show_booking_costs", fromdate: checkIn, todate: checkOut, property_id: String(id), guest_no: String(guests), guest_fromone: String(Number(jsonVariable(page.html, "control_vars_property").price_per_guest_from_one) || 0), security: token }),
  });
  if (!response.ok) throw new StayHWError("StayHW could not return a current price. Please try again later.");
  const html = await response.text();
  return {
    unitId: id, checkIn, checkOut, guests,
    nights: Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86400000),
    rentCents: quoteMoney(html, "customprice"), cleaningCents: quoteMoney(html, "cleaningFeeShow"),
    extraGuestCents: quoteMoney(html, "totalpriceguest"), taxCents: quoteMoney(html, "taxes"), totalCents: quoteMoney(html, "totalprice"),
    depositCents: quoteMoney(html, "Deposit"), balanceCents: quoteMoney(html, "Balance"),
    fetchedAt: new Date().toISOString(),
  };
}

// StayHW's "Contact Owner" form: the same admin-ajax action, field names,
// token and date format its own modal sends. The owner receives the message
// in the StayHW inbox and by email. Returns StayHW's confirmation text.
export async function sendStayHWOwnerMessage(id: number, input: StayHWOwnerMessage): Promise<string> {
  const page = await unitPage(id);
  const token = /id=["']wprentals_submit_mess_front_nonce["'][^>]*value=["']([^"']+)["']/.exec(page.html)?.[1];
  if (!token) throw new StayHWError("StayHW's contact form is temporarily unavailable.");
  const response = await fetch(`${ORIGIN}/wp-admin/admin-ajax.php`, {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(20000),
    body: new URLSearchParams({
      action: "wpestate_mess_front_end", message: input.message, booking_guest_no: String(input.guests),
      booking_from_date: input.checkIn ? siteDate(input.checkIn) : "", booking_to_date: input.checkOut ? siteDate(input.checkOut) : "",
      agent_property_id: String(id), agent_id: "0",
      contact_u_email: input.email, contact_u_phone: input.phone, contact_u_name: input.name, security: token,
    }),
  });
  const answer = plainText(await response.text());
  // WordPress answers a rejected token with 403 or a bare "-1" / "0".
  if (!response.ok || !answer || answer === "-1" || answer === "0") throw new StayHWError("StayHW could not receive your message. Please try again later.");
  return answer.slice(0, 300);
}
