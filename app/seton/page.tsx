import type { Metadata } from "next";
import { BuildingPage } from "@/components/BuildingPage";

export const metadata: Metadata = {
  title: "Seton | AI Startup House Lodging",
  description:
    "Private, hotel-style rooms with en-suite bathrooms at 144 E 40th St, Murray Hill. $650/week, utilities and Wi-Fi included. The residency program takes place on site.",
};

export default async function SetonPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <BuildingPage slug="seton" source={ref ?? null} />;
}
