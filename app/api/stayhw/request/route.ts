import { checkStayHWStay, StayHWError } from "@/lib/stayhw";
import { isCalendarDate } from "@/lib/stayhw-calendar";

// StayHW is not seeded in the separately operated housing backend. Send a
// normal application with the verified preference in its message instead of
// sending an unknown building ID that the existing backend may reject.
export async function POST(request: Request) {
  let input;
  try { input = await request.json(); } catch { return Response.json({ error: "invalid_request" }, { status: 400 }); }
  if (!input || typeof input.name !== "string" || input.name.trim().length < 2 || input.name.length > 200 || typeof input.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) || input.email.length > 254 || (input.phone != null && (typeof input.phone !== "string" || input.phone.length > 100)) || (input.message != null && (typeof input.message !== "string" || input.message.length > 5000)) || (input.source != null && (typeof input.source !== "string" || input.source.length > 500))) {
    return Response.json({ error: "invalid_request", message: "Check your name, email and message." }, { status: 400 });
  }
  const building = typeof input.building === "string" ? input.building : "";
  const match = /^stayhw-(\d+)$/.exec(building);
  if (building !== "stayhw" && !match) return Response.json({ error: "invalid_unit" }, { status: 400 });
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!backend) return Response.json({ error: "backend_unavailable", message: "Room requests are temporarily unavailable. Please try again later." }, { status: 503 });
  try {
    let preference = "Preferred property: StayHW, Hollywood, Los Angeles. Any available condo.";
    if (match) {
      const id = Number(match[1]);
      if (!Number.isSafeInteger(id) || !isCalendarDate(input.moveIn) || !isCalendarDate(input.moveOut) || !Number.isInteger(input.guests)) return Response.json({ error: "invalid_dates", message: "Choose dates and a number of guests." }, { status: 400 });
      const calendar = await checkStayHWStay(id, input.moveIn, input.moveOut, input.guests);
      preference = `Preferred property: StayHW, Hollywood, Los Angeles.\nUnit: ${calendar.unit.name}\nStayHW property ID: ${id}\nUnit page: https://stayhw.com/properties/${calendar.unit.slug}/\nGuests: ${input.guests}\nRequested dates: ${input.moveIn} to ${input.moveOut}\nAvailability and final price require confirmation; no StayHW reservation has been created.`;
    } else if ((input.moveIn && !isCalendarDate(input.moveIn)) || (input.moveOut && !isCalendarDate(input.moveOut))) {
      return Response.json({ error: "invalid_dates", message: "Check your requested dates." }, { status: 400 });
    }
    const response = await fetch(`${backend}/v1/public/applications`, {
      method: "POST", headers: { "content-type": "application/json" }, signal: AbortSignal.timeout(15000),
      body: JSON.stringify({ name: input.name, email: input.email, phone: input.phone ?? "", moveIn: input.moveIn || undefined, moveOut: input.moveOut || undefined, upgradeInterest: input.upgradeInterest === true, message: `${preference}\n\n${input.message ?? ""}`, source: input.source ?? null }),
    });
    if (!response.ok) return Response.json({ error: "request_failed", message: "The housing team could not receive your request. Please try again later." }, { status: response.status >= 500 ? 502 : 400 });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: "request_failed", message: error instanceof StayHWError ? error.message : "Your request could not be sent. Please try again later." }, { status: error instanceof StayHWError ? error.status : 502 });
  }
}
