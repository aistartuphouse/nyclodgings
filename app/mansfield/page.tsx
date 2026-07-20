import type { Metadata } from "next";
import { BuildingPage } from "@/components/BuildingPage";

export const metadata: Metadata = {
  title: "Mansfield | AI Startup House Lodging",
  description:
    "Semi-private rooms in a historic boutique hotel building at 12 W 44th St, Midtown Manhattan. $650/week, utilities and Wi-Fi included. Five minutes to Times Square and Grand Central.",
};

export default async function MansfieldPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <BuildingPage slug="mansfield" source={ref ?? null} />;
}
