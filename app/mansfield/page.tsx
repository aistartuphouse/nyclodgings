import type { Metadata } from "next";
import { BuildingPage } from "@/components/BuildingPage";

export const metadata: Metadata = {
  title: "Mansfield | AI Startup House Lodging",
  description:
    "Hotel living at 12 W 44th St, Midtown Manhattan: five room types from $575/week, short-term stays on request, utilities and Wi-Fi included. Programming takes place on site.",
};

export default async function MansfieldPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; room?: string }>;
}) {
  const { ref, room } = await searchParams;
  return <BuildingPage slug="mansfield" source={ref ?? null} room={room ?? null} />;
}
