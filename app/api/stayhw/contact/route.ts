import { sendStayHWOwnerMessage, StayHWError } from "@/lib/stayhw";
import { isCalendarDate } from "@/lib/stayhw-calendar";

// "Contact Owner": relays the guest's message through StayHW's own contact
// form, so the owner gets it in the StayHW inbox exactly as from stayhw.com.
export async function POST(request: Request) {
  let input;
  try { input = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const text = (value: unknown, max: number) => (typeof value === "string" && value.trim().length > 0 && value.length <= max ? value.trim() : null);
  const name = text(input?.name, 200), email = text(input?.email, 254), message = text(input?.message, 5000);
  // StayHW's modal requires a phone; digits only, as its field expects.
  const phone = typeof input?.phone === "string" ? input.phone.replace(/\D/g, "") : "";
  if (!input || !Number.isSafeInteger(input.unitId) || input.unitId < 1) return Response.json({ error: "Choose a condo first." }, { status: 400 });
  if (!name || !message) return Response.json({ error: "Please fill in your name and a message." }, { status: 400 });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  if (phone.length < 7 || phone.length > 15) return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });
  const hasDates = !!(input.checkIn || input.checkOut);
  if (hasDates && (!isCalendarDate(input.checkIn) || !isCalendarDate(input.checkOut) || input.checkOut <= input.checkIn)) return Response.json({ error: "Check your dates." }, { status: 400 });
  const guests = Number.isInteger(input.guests) && input.guests >= 1 && input.guests <= 50 ? input.guests : 1;
  try {
    const confirmation = await sendStayHWOwnerMessage(input.unitId, { name, email, phone, message, guests, checkIn: hasDates ? input.checkIn : "", checkOut: hasDates ? input.checkOut : "" });
    return Response.json({ ok: true, confirmation });
  } catch (error) {
    return Response.json({ error: error instanceof StayHWError ? error.message : "Your message could not be sent. Please try again later." }, { status: error instanceof StayHWError ? error.status : 502 });
  }
}
