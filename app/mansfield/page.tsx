import type { Metadata } from "next";
import { BuildingPage } from "@/components/BuildingPage";

export const metadata: Metadata = {
  title: "Mansfield | AI Startup House Lodging",
  description:
    "Short-term lodging at 12 W 44th St, Midtown Manhattan: private rooms from $150/night, $3,600/month from 30 nights with lower rates from 3 and 5 months, stays from one week, utilities and Wi-Fi included. Programming takes place on site.",
};

export default async function MansfieldPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <BuildingPage slug="mansfield" source={ref ?? null} />;
}
