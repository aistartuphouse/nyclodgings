import { searchStayHWUnits, StayHWError } from "@/lib/stayhw";
import { parseStaySearch } from "@/lib/stayhw-calendar";

// Units free for the whole stay that sleep the group, straight from StayHW's search.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const search = parseStaySearch({ checkIn: params.get("checkIn"), checkOut: params.get("checkOut"), guests: params.get("guests") });
  try {
    const unitIds = await searchStayHWUnits(search.checkIn || null, search.checkOut || null, search.guests || null);
    return Response.json({ search, unitIds });
  } catch (error) {
    return Response.json({ error: error instanceof StayHWError ? error.message : "StayHW's availability could not be loaded. Please try again later." }, { status: error instanceof StayHWError ? error.status : 502 });
  }
}
