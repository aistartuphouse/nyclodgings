import { getStayHWQuote, StayHWError } from "@/lib/stayhw";
import { isCalendarDate } from "@/lib/stayhw-calendar";

export async function POST(request: Request) {
  let input;
  try { input = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (!input || !Number.isSafeInteger(input.unitId) || input.unitId < 1 || !isCalendarDate(input.checkIn) || !isCalendarDate(input.checkOut) || !Number.isInteger(input.guests) || input.guests < 1 || input.guests > 50) {
    return Response.json({ error: "Choose a unit, dates and number of guests." }, { status: 400 });
  }
  try {
    return Response.json(await getStayHWQuote(input.unitId, input.checkIn, input.checkOut, input.guests));
  } catch (error) {
    return Response.json({ error: error instanceof StayHWError ? error.message : "StayHW's price could not be calculated. Please try again later." }, { status: error instanceof StayHWError ? error.status : 502 });
  }
}
