import type { Metadata } from "next";
import { BuildingPage } from "@/components/BuildingPage";

export const metadata: Metadata = {
  title: "Seton | AI Startup House Lodging",
  description:
    "Hotel-style rooms at 144 E 40th St, Murray Hill, Manhattan: three room types from $525/week with private en-suite bathrooms, multi-month stays of 4 months or longer, utilities and Wi-Fi included. Programming takes place on site.",
};

export default async function SetonPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <BuildingPage slug="seton" source={ref ?? null} />;
}
