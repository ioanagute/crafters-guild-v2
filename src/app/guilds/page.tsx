import { Crown } from "lucide-react";
import GuildDirectoryClient from "@/components/GuildDirectoryClient";
import GuildMembershipCallout from "@/components/GuildMembershipCallout";
import PageHeader from "@/components/PageHeader";
import StatPill from "@/components/StatPill";
import { getGuildDirectoryData } from "@/features/guilds/server/guilds";

export default async function GuildsPage() {
  const { guilds, membershipState, swornMembers } = await getGuildDirectoryData();

  return (
    <div className="page-shell">
      <div className="page-stack">
        <PageHeader
          eyebrow="Guild Directory"
          title="The Great Houses"
          description="Read the charters of the realm, study each banner, and decide where your craft belongs."
          actions={
            <>
              <StatPill label="Guilds" value={guilds.length} />
              <StatPill label="Sworn Members" value={swornMembers} emphasis="soft" />
            </>
          }
        />

        <GuildMembershipCallout state={membershipState} />

        {guilds.length === 0 ? (
          <section className="section-panel px-6 py-16 text-center shadow-2xl">
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
    </div>
  );
}
