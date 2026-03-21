import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = "https://crafters-guild.example.com";

  // Static routes
  const routes = ["", "/marketplace", "/guilds", "/tavern", "/login"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );

  // Dynamic guild routes
  const { data: guilds } = await supabase
    .from("guilds")
    .select("id, created_at");
  const guildRoutes = (guilds || []).map(
    (guild: { id: string; created_at: string | null }) => ({
      url: `${baseUrl}/guilds/${guild.id}`,
      lastModified: new Date(guild.created_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  return [...routes, ...guildRoutes];
}
