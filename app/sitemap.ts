import type { MetadataRoute } from "next";
import { BUILDING_LIST } from "@/lib/buildings";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lodgings.aistartuphouse.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...BUILDING_LIST.map((b) => `/${b.slug}`), "/apply"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
