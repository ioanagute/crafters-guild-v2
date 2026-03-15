import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, ScrollText, ShieldCheck, Users } from "lucide-react";
import GuildMemberList, { type GuildMember } from "@/components/GuildMemberList";
import GuildMembershipCallout from "@/components/GuildMembershipCallout";
import { createClient } from "@/utils/supabase/server";

type GuildDetail = {
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

export default async function GuildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: guild, error: guildError } = await supabase
    .from("guilds")
    .select("id, name, description, emblem_url, created_at")
    .eq("id", id)
    .maybeSingle();

  if (guildError || !guild) {
    notFound();
  }

  const { data: members, error: membersError } = await supabase
    .from("profiles")
    .select("id, username, full_name, role, avatar_url, bio")
    .eq("guild_id", id)
    .order("username", { ascending: true });

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

  const resolvedGuild = getRelatedGuild(userProfile?.guilds);

  const membershipState = !user
    ? { kind: "anonymous" as const }
    : userProfile?.guild_id && resolvedGuild
      ? {
          kind: "member" as const,
          username: userProfile.username,
          guildId: resolvedGuild.id,
          guildName: resolvedGuild.name,
          isCurrentGuild: userProfile.guild_id === id,
        }
      : {
          kind: "unaffiliated" as const,
          username: userProfile?.username,
        };

  const guildMembers = (members as GuildMember[] | null) || [];
  const guildDetail = guild as GuildDetail;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      <div className="mb-8">
        <Link
          href="/guilds"
          className="text-sm uppercase tracking-[0.25em] text-parchment-400 transition hover:text-gold-400"
        >
          Back to the Great Houses
        </Link>
      </div>

      <section className="mb-10 border-4 border-iron-800 bg-parchment p-8 shadow-[0_0_40px_rgba(0,0,0,0.45)] md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-6">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden border-4 border-leather-800 bg-iron-900/10">
              {guildDetail.emblem_url ? (
                <Image
                  src={guildDetail.emblem_url}
                  alt={`${guildDetail.name} emblem`}
                  width={224}
                  height={224}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <Crown className="h-12 w-12 text-leather-700 opacity-60" />
              )}
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-leather-700">
                Guild Charter
              </p>
              <h1 className="font-serif text-4xl text-ink-900 md:text-5xl">
                {guildDetail.name}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-leather-900">
                {guildDetail.description || "No charter has yet been recorded for this guild."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border-2 border-leather-800 bg-parchment-100 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-leather-700">Members</p>
              <p className="mt-2 font-serif text-3xl text-ink-900">{guildMembers.length}</p>
            </div>
            <div className="border-2 border-leather-800 bg-parchment-100 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-leather-700">Status</p>
              <p className="mt-2 font-serif text-xl text-ink-900">Open Charter</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <GuildMembershipCallout state={membershipState} variant="detail" />
      </div>

      <section>
        <div className="mb-6 flex items-end justify-between border-b-2 border-gold-600 pb-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold-400">
              Member Roster
            </p>
            <h2 className="font-serif text-3xl text-gold-accent">Sworn to This Banner</h2>
          </div>
          <div className="hidden items-center gap-2 text-parchment-300 md:flex">
            <Users className="h-4 w-4 text-gold-500" />
            {guildMembers.length} listed
          </div>
        </div>

        {membersError ? (
          <div className="border border-blood-600 bg-blood-600/10 p-8 text-center">
            <ScrollText className="mx-auto mb-4 h-10 w-10 text-blood-600" />
            <h3 className="mb-2 font-serif text-2xl text-parchment-200">
              The roster could not be unsealed
            </h3>
            <p className="mx-auto max-w-2xl text-sm text-parchment-300">
              The guild charter is intact, but its member roll is not presently available.
            </p>
          </div>
        ) : (
          <GuildMemberList members={guildMembers} />
        )}
      </section>

      <section className="mt-12 border border-iron-700 bg-iron-800/70 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-parchment-200">Ready to pledge your colors?</h2>
            <p className="mt-2 text-sm text-parchment-300">
              Guild affiliation is managed through your heraldry so the realm keeps a single source of truth.
            </p>
          </div>
          <Link
            href={user ? "/profile" : "/login"}
            className="inline-flex items-center gap-2 self-start border-2 border-gold-600 bg-leather-800 px-5 py-3 font-serif tracking-wider text-gold-400 transition hover:bg-leather-700 hover:text-gold-300"
          >
            <ShieldCheck className="h-4 w-4" />
            {user ? "Open Heraldry" : "Enter the Guild"}
          </Link>
        </div>
      </section>
    </div>
  );
}
