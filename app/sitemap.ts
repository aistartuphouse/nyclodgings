import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lodgings.aistartuphouse.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/seton", "/stratford", "/book", "/apply"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
