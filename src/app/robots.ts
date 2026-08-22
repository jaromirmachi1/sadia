import type { MetadataRoute } from "next";

import { getMetadataBase } from "@/seo/site";

export default function robots(): MetadataRoute.Robots {
  const base = getMetadataBase();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/studio/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", base).toString(),
    host: base.origin,
  };
}
