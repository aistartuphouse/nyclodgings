import type { Metadata } from "next";
import { BuildingPage } from "@/components/BuildingPage";

export const metadata: Metadata = {
  title: "The 46 | AI Startup House Lodging",
  description:
    "Private rooms with ensuite bathrooms at 129 W 46th St, one block from Times Square: five room types from $745/week, every real room listed live with its rate and free date, stays of 4 weeks or longer, utilities and Wi-Fi included.",
};

export default async function The46Page({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return <BuildingPage slug="the-46" source={ref ?? null} />;
}
