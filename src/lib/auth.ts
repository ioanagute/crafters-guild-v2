import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { toErrorRedirect } from "@/lib/errors";
import type { Database } from "@/lib/database.types";

export type AppRole = "artisan" | "patron" | "apprentice";

export type SessionProfile = {
  id: string;
  username: string | null;
  fullName: string | null;
  role: AppRole;
  guildId: string | null;
  guildName?: string | null;
};

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"] & {
  guilds?: { name: string } | { name: string }[] | null;
};

function getGuildName(guilds: ProfileRow["guilds"]) {
  if (!guilds) return null;
  return Array.isArray(guilds) ? guilds[0]?.name ?? null : guilds.name;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentSessionProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, supabase };
  }

  const { data } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      full_name,
      role,
      guild_id,
      guilds:guild_id ( name )
    `)
    .eq("id", user.id)
    .single();

  const row = data as ProfileRow | null;

  return {
    user,
    supabase,
    profile: row
      ? {
          id: row.id,
          username: row.username,
          fullName: row.full_name,
          role: row.role ?? "patron",
          guildId: row.guild_id,
          guildName: getGuildName(row.guilds),
        }
      : null,
  };
}

export async function requireAuthenticatedUser(returnTo = "/login") {
  const { user, supabase } = await getCurrentSessionProfile();

  if (!user) {
    redirect(returnTo);
  }

  return { user, supabase };
}

export async function requireSessionProfile(returnTo = "/login") {
  const { user, profile, supabase } = await getCurrentSessionProfile();

  if (!user) {
    redirect(returnTo);
  }

  if (!profile) {
    redirect(toErrorRedirect("Your heraldry could not be found.", returnTo));
  }

  return { user, profile, supabase };
}

export async function requireArtisanProfile(returnTo = "/marketplace") {
  const { user, profile, supabase } = await requireSessionProfile(returnTo);

  if (profile.role !== "artisan") {
    redirect(
      toErrorRedirect(
        "Only artisans may perform this action.",
        returnTo,
      ),
    );
  }

  return { user, profile, supabase };
}
