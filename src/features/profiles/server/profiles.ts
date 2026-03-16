import { ok, fail } from "@/lib/action-result";
import type { Database } from "@/lib/database.types";
import { readOptionalString } from "@/lib/forms";
import { createClient } from "@/utils/supabase/server";
import { requireSessionProfile } from "@/lib/auth";
import type {
  GuildOption,
  Profile,
  ProfileMutationResult,
  ProfilePageData,
  UpdateProfileInput,
} from "@/features/profiles/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"] & {
  guilds?: { name: string } | { name: string }[] | null;
};

type GuildRow = Database["public"]["Tables"]["guilds"]["Row"];

function getGuildName(guilds: ProfileRow["guilds"]) {
  if (!guilds) return null;
  return Array.isArray(guilds) ? guilds[0]?.name ?? null : guilds.name;
}

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    role: row.role ?? "patron",
    bio: row.bio,
    guildId: row.guild_id,
    guildName: getGuildName(row.guilds),
  };
}

export function validateProfileInput(formData: FormData) {
  return ok<UpdateProfileInput>({
    username: readOptionalString(formData, "username"),
    fullName: readOptionalString(formData, "full_name"),
    bio: readOptionalString(formData, "bio"),
    avatarUrl: readOptionalString(formData, "avatar_url"),
    guildId: readOptionalString(formData, "guild_id"),
  });
}

export async function getProfilePageData(userId: string): Promise<ProfilePageData | null> {
  const supabase = await createClient();
  const [{ data: profile }, { data: guilds }, { count: listedWares }, { count: pinnedNotices }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          role,
          bio,
          guild_id,
          guilds ( name )
        `)
        .eq("id", userId)
        .single(),
      supabase.from("guilds").select("id, name").order("name"),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("crafter_id", userId),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("author_id", userId),
    ]);

  if (!profile) return null;

  return {
    profile: mapProfile(profile as ProfileRow),
    guildOptions: ((guilds as GuildRow[] | null) ?? []).map<GuildOption>((guild) => ({
      id: guild.id,
      name: guild.name,
    })),
    summary: {
      listedWares: listedWares ?? 0,
      pinnedNotices: pinnedNotices ?? 0,
    },
  };
}

export async function updateProfile(input: UpdateProfileInput): Promise<ProfileMutationResult> {
  const { user, supabase } = await requireSessionProfile("/profile");

  const { data, error } = await supabase
    .from("profiles")
    .update({
      username: input.username,
      full_name: input.fullName,
      bio: input.bio,
      avatar_url: input.avatarUrl,
      guild_id: input.guildId,
    })
    .eq("id", user.id)
    .select("id")
    .single();

  if (error || !data) {
    return fail("Unable to update your heraldry.");
  }

  return ok({ id: data.id as string });
}

export async function signOutCurrentUser() {
  const { supabase } = await requireSessionProfile("/");
  await supabase.auth.signOut();
}
