import type { Metadata } from "next";
import { BuildingPage } from "@/components/BuildingPage";

export const metadata: Metadata = {
  title: "Stratford | AI Startup House Lodging",
  description:
    "Dorm-style rooms with shared bathrooms at 117 W 70th St, Upper West Side. From $400/week, utilities and Wi-Fi included. About 20 minutes by subway to the program venues.",
};

export default async function StratfordPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; room?: string }>;
}) {
  const { ref, room } = await searchParams;
  return <BuildingPage slug="stratford" source={ref ?? null} room={room ?? null} />;
}
