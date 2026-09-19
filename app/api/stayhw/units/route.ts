import { getStayHWUnits, StayHWError } from "@/lib/stayhw";

export async function GET() {
  try {
    return Response.json({ units: await getStayHWUnits() });
  } catch (error) {
    return Response.json({ error: error instanceof StayHWError ? error.message : "StayHW's rooms could not be loaded. Please try again later." }, { status: error instanceof StayHWError ? error.status : 502 });
  }
}
