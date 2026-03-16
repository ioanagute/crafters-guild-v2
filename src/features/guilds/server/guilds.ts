import { createClient } from "@/utils/supabase/server";
import { getCurrentSessionProfile } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import type {
  Guild,
  GuildDetailData,
  GuildDirectoryData,
  GuildMember,
  MembershipState,
} from "@/features/guilds/types";

type GuildRow = Database["public"]["Tables"]["guilds"]["Row"];
type MemberRow = Database["public"]["Tables"]["profiles"]["Row"];

export function buildMembershipState(args: {
  isAuthenticated: boolean;
  username?: string | null;
  guildId?: string | null;
  guildName?: string | null;
  currentGuildId?: string | null;
}): MembershipState {
  if (!args.isAuthenticated) {
    return { kind: "anonymous" };
  }

  if (!args.guildId || !args.guildName) {
    return { kind: "unaffiliated", username: args.username };
  }

  return {
    kind: "member",
    username: args.username,
    guildId: args.guildId,
    guildName: args.guildName,
    isCurrentGuild: args.currentGuildId === args.guildId,
  };
}

function mapGuild(row: GuildRow, memberCount: number): Guild {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    emblemUrl: row.emblem_url,
    memberCount,
    createdAt: row.created_at,
  };
}

export async function getGuildDirectoryData(): Promise<GuildDirectoryData> {
  const supabase = await createClient();
  const [{ data: guildRows }, { data: profiles }, session] = await Promise.all([
    supabase
      .from("guilds")
      .select("id, name, description, emblem_url, created_at")
      .order("name"),
    supabase.from("profiles").select("guild_id").not("guild_id", "is", null),
    getCurrentSessionProfile(),
  ]);

  const memberCounts = new Map<string, number>();
  for (const profile of profiles ?? []) {
    if (!profile.guild_id) continue;
    memberCounts.set(profile.guild_id, (memberCounts.get(profile.guild_id) ?? 0) + 1);
  }

  return {
    guilds: ((guildRows as GuildRow[] | null) ?? []).map((guild) =>
      mapGuild(guild, memberCounts.get(guild.id) ?? 0),
    ),
    swornMembers: profiles?.length ?? 0,
    membershipState: buildMembershipState({
      isAuthenticated: Boolean(session.user),
      username: session.profile?.username,
      guildId: session.profile?.guildId,
      guildName: session.profile?.guildName,
    }),
  };
}

export async function getGuildDetailData(id: string): Promise<GuildDetailData | null> {
  const supabase = await createClient();
  const [{ data: guild }, { data: members }, session] = await Promise.all([
    supabase
      .from("guilds")
      .select("id, name, description, emblem_url, created_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("id, username, full_name, role, avatar_url, bio")
      .eq("guild_id", id)
      .order("username", { ascending: true }),
    getCurrentSessionProfile(),
  ]);

  if (!guild) return null;

  const mappedMembers = ((members as MemberRow[] | null) ?? []).map<GuildMember>((member) => ({
    id: member.id,
    username: member.username,
    fullName: member.full_name,
    role: member.role,
    avatarUrl: member.avatar_url,
    bio: member.bio,
  }));

  return {
    guild: mapGuild(guild as GuildRow, mappedMembers.length),
    members: mappedMembers,
    membershipState: buildMembershipState({
      isAuthenticated: Boolean(session.user),
      username: session.profile?.username,
      guildId: session.profile?.guildId,
      guildName: session.profile?.guildName,
      currentGuildId: id,
    }),
  };
}
