import Link from "next/link";
import { Crown, ScrollText } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import GuildDirectoryClient from "@/components/GuildDirectoryClient";
import GuildMembershipCallout from "@/components/GuildMembershipCallout";
import type { GuildListItem } from "@/components/GuildCard";

type GuildRow = {
  id: string;
  name: string;
  description: string | null;
  emblem_url: string | null;
  created_at: string;
};

type UserProfile = {
  id: string;
  guild_id: string | null;
  username: string | null;
  guilds?: { id: string; name: string } | { id: string; name: string }[] | null;
};

function getRelatedGuild(
  guilds: UserProfile["guilds"],
): { id: string; name: string } | null {
  if (!guilds) return null;
  return Array.isArray(guilds) ? guilds[0] || null : guilds;
}

export default async function GuildsPage() {
  const supabase = await createClient();
  const { data: guildRows, error: guildError } = await supabase
    .from("guilds")
    .select("id, name, description, emblem_url, created_at")
    .order("name");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("guild_id")
    .not("guild_id", "is", null);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile: UserProfile | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select(`
        id,
        guild_id,
        username,
        guilds:guild_id (
          id,
          name
        )
      `)
      .eq("id", user.id)
      .single();

    userProfile = data as UserProfile | null;
  }

  const memberCounts = new Map<string, number>();
  for (const profile of profiles || []) {
    if (!profile.guild_id) continue;
    memberCounts.set(profile.guild_id, (memberCounts.get(profile.guild_id) || 0) + 1);
  }

  const guilds: GuildListItem[] = (guildRows as GuildRow[] | null)?.map((guild) => ({
    id: guild.id,
    name: guild.name,
    description: guild.description,
    emblem_url: guild.emblem_url,
    memberCount: memberCounts.get(guild.id) || 0,
  })) || [];

  const resolvedGuild = getRelatedGuild(userProfile?.guilds);

  const membershipState = !user
    ? { kind: "anonymous" as const }
    : userProfile?.guild_id && resolvedGuild
      ? {
          kind: "member" as const,
          username: userProfile.username,
          guildId: resolvedGuild.id,
          guildName: resolvedGuild.name,
        }
      : {
          kind: "unaffiliated" as const,
          username: userProfile?.username,
        };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      <section className="mb-10 border-b-2 border-gold-600 pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold-400">
              Guild Directory
            </p>
            <h1 className="font-serif text-4xl tracking-widest text-gold-accent md:text-5xl">
              The Great Houses
            </h1>
            <p className="mt-4 text-lg italic text-parchment-300">
              Read the charters of the realm, study each banner, and decide where
              your craft belongs.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="border border-gold-600/80 bg-iron-800/80 px-5 py-4 text-center shadow-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-parchment-400">Guilds</p>
              <p className="mt-2 font-serif text-3xl text-gold-400">{guilds.length}</p>
            </div>
            <div className="border border-gold-600/80 bg-iron-800/80 px-5 py-4 text-center shadow-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-parchment-400">Sworn Members</p>
              <p className="mt-2 font-serif text-3xl text-gold-400">{profiles?.length || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <GuildMembershipCallout state={membershipState} />
      </div>

      {guildError ? (
        <section className="border border-blood-600 bg-blood-600/10 p-8 text-center shadow-2xl">
          <ScrollText className="mx-auto mb-4 h-10 w-10 text-blood-600" />
          <h2 className="mb-2 font-serif text-3xl text-parchment-200">
            The ledgers could not be read
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-parchment-300">
            The guild directory is presently beyond reach. Return shortly, or inspect
            your <Link href="/profile" className="text-gold-400 underline decoration-gold-600">Heraldry</Link> if you must confirm your allegiance.
          </p>
        </section>
      ) : guilds.length === 0 ? (
        <section className="border-2 border-dashed border-iron-700 bg-iron-800/70 px-6 py-16 text-center shadow-2xl">
          <Crown className="mx-auto mb-4 h-12 w-12 text-gold-500 opacity-80" />
          <h2 className="mb-3 font-serif text-3xl text-parchment-200">
            No guilds have raised their banners
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-parchment-300">
            The halls stand ready, but no charter has yet been entered into the record.
          </p>
        </section>
      ) : (
        <GuildDirectoryClient guilds={guilds} />
      )}
    </div>
  );
}
