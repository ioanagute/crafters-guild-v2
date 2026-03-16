import { createClient } from "@/utils/supabase/server";
import { getCurrentSessionProfile } from "@/lib/auth";
import type { Database } from "@/lib/database.types";

type LandingProduct = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  "id" | "title" | "category" | "price"
>;

type LandingPost = Pick<
  Database["public"]["Tables"]["posts"]["Row"],
  "id" | "content" | "tier_required"
>;

export async function getHomePageData() {
  const supabase = await createClient();
  const session = await getCurrentSessionProfile();
  const [{ data: products }, { count: guildCount }, { data: posts }] = await Promise.all([
    supabase.from("products").select("id, title, category, price").order("created_at", { ascending: false }).limit(3),
    supabase.from("guilds").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id, content, tier_required").order("created_at", { ascending: false }).limit(3),
  ]);

  return {
    user: session.user,
    profile: session.profile,
    latestProducts: (products as LandingProduct[] | null) ?? [],
    latestPosts: (posts as LandingPost[] | null) ?? [],
    guildCount: guildCount ?? 0,
  };
}
