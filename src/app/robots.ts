import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/profile",
        "/marketplace/my-listings",
        "/marketplace/new",
        "/marketplace/*/edit",
      ],
    },
    sitemap: "https://crafters-guild.example.com/sitemap.xml",
  };
}
