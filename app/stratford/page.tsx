import type { Metadata } from "next";
import { BuildingPage } from "@/components/BuildingPage";

export const metadata: Metadata = {
  title: "Stratford | Real AI Bootcamp Housing",
  description:
    "Dorm-style rooms with shared bathrooms at 117 W 70th St, Upper West Side. $450/week, utilities and Wi-Fi included. About 20 minutes by subway to the program venue.",
};

export default async function StratfordPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <BuildingPage slug="stratford" source={ref ?? null} />;
}
