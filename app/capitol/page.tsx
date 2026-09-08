import type { Metadata } from "next";
import { BuildingPage } from "@/components/BuildingPage";

export const metadata: Metadata = {
  title: "Capitol, Austin | AI Startup House Lodging",
  description:
    "Austin lodging at 1108 Nueces St, Downtown: private bedrooms in shared four-bedroom apartments, Loft $900/week and Sunroom $650/week plus Texas hotel tax, stays of 3 months or longer. Two blocks from the Texas State Capitol.",
};

export default async function CapitolPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <BuildingPage slug="capitol" source={ref ?? null} />;
}
