import { getStayHWCalendar, StayHWError } from "@/lib/stayhw";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id))) return Response.json({ error: "Invalid unit." }, { status: 400 });
  try {
    return Response.json(await getStayHWCalendar(Number(id)));
  } catch (error) {
    return Response.json({ error: error instanceof StayHWError ? error.message : "StayHW's calendar could not be loaded. Please try again later." }, { status: error instanceof StayHWError ? error.status : 502 });
  }
}
