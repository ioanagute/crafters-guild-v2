import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, ShieldCheck, Users } from "lucide-react";
import GuildMemberList from "@/components/GuildMemberList";
import GuildMembershipCallout from "@/components/GuildMembershipCallout";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import RemoteImage from "@/components/RemoteImage";
import StatPill from "@/components/StatPill";
import ThemedLinkButton from "@/components/ThemedLinkButton";
import { getGuildDetailData } from "@/features/guilds/server/guilds";

export default async function GuildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getGuildDetailData(id);

  if (!detail) {
    notFound();
  }
  const { guild: guildDetail, members: guildMembers, membershipState } = detail;

  return (
    <div className="page-shell">
      <div className="page-stack">
      <div className="mb-8">
        <Link
          href="/guilds"
          className="text-sm uppercase tracking-[0.25em] text-parchment-400 transition hover:text-gold-400"
        >
          Back to the Great Houses
        </Link>
      </div>

        <ParchmentCard variant="elevated" className="p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
            <div className="flex items-start gap-6">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] border-4 border-leather-800 bg-iron-900/10">
              {guildDetail.emblemUrl ? (
                <RemoteImage
                  src={guildDetail.emblemUrl}
                  alt={`${guildDetail.name} emblem`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Crown className="h-12 w-12 text-leather-700 opacity-60" />
              )}
            </div>

              <div>
                <PageHeader
                  eyebrow="Guild Charter"
                  title={guildDetail.name}
                  description={guildDetail.description || "No charter has yet been recorded for this guild."}
                  compact
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <StatPill label="Members" value={guildMembers.length} />
              <StatPill label="Status" value="Open Charter" emphasis="soft" />
            </div>
          </div>
        </ParchmentCard>

        <GuildMembershipCallout state={membershipState} variant="detail" />

      <section>
        <div className="mb-6 flex items-end justify-between border-b border-gold-600/30 pb-4">
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

        <GuildMemberList members={guildMembers} />
      </section>

        <section className="section-panel px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-parchment-200">Ready to pledge your colors?</h2>
            <p className="mt-2 text-sm text-parchment-300">
              Guild affiliation is managed through your heraldry so the realm keeps a single source of truth.
            </p>
          </div>
            <ThemedLinkButton
              href={membershipState.kind === "anonymous" ? "/login" : "/profile"}
              icon={<ShieldCheck className="h-4 w-4" />}
            >
              {membershipState.kind === "anonymous" ? "Enter the Guild" : "Open Heraldry"}
            </ThemedLinkButton>
        </div>
      </section>
      </div>
    </div>
  );
}
