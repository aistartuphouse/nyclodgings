import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lodgings.aistartuphouse.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/booking/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
