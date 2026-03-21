import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, ShieldCheck, Users } from "lucide-react";
import GuildMemberList from "@/components/GuildMemberList";
import GuildMembershipCallout from "@/components/GuildMembershipCallout";
import { getGuildDetailData } from "@/features/guilds/server/guilds";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getGuildDetailData(id);
  if (!detail) return { title: "Guild Not Found" };

  return {
    title: detail.guild.name,
    description:
      detail.guild.description ||
      `Explore the charter and members of ${detail.guild.name}.`,
    openGraph: {
      images: detail.guild.emblemUrl ? [detail.guild.emblemUrl] : [],
    },
  };
}

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
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      <div className="mb-8">
        <Link
          href="/guilds"
          className="text-parchment-400 hover:text-gold-400 text-sm tracking-[0.25em] uppercase transition"
        >
          Back to the Great Houses
        </Link>
      </div>

      <section className="border-iron-800 bg-parchment mb-10 border-4 p-8 shadow-[0_0_40px_rgba(0,0,0,0.45)] md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-6">
            <div className="border-leather-800 bg-iron-900/10 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden border-4">
              {guildDetail.emblemUrl ? (
                <Image
                  src={guildDetail.emblemUrl}
                  alt={`${guildDetail.name} emblem`}
                  width={224}
                  height={224}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <Crown className="text-leather-700 h-12 w-12 opacity-60" />
              )}
            </div>

            <div>
              <p className="text-leather-700 mb-2 text-xs tracking-[0.3em] uppercase">
                Guild Charter
              </p>
              <h1 className="text-ink-900 font-serif text-4xl md:text-5xl">
                {guildDetail.name}
              </h1>
              <p className="text-leather-900 mt-4 max-w-3xl text-base leading-relaxed">
                {guildDetail.description ||
                  "No charter has yet been recorded for this guild."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border-leather-800 bg-parchment-100 border-2 px-5 py-4 text-center">
              <p className="text-leather-700 text-xs tracking-[0.25em] uppercase">
                Members
              </p>
              <p className="text-ink-900 mt-2 font-serif text-3xl">
                {guildMembers.length}
              </p>
            </div>
            <div className="border-leather-800 bg-parchment-100 border-2 px-5 py-4 text-center">
              <p className="text-leather-700 text-xs tracking-[0.25em] uppercase">
                Status
              </p>
              <p className="text-ink-900 mt-2 font-serif text-xl">
                Open Charter
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <GuildMembershipCallout state={membershipState} variant="detail" />
      </div>

      <section>
        <div className="border-gold-600 mb-6 flex items-end justify-between border-b-2 pb-4">
          <div>
            <p className="text-gold-400 mb-2 text-xs tracking-[0.3em] uppercase">
              Member Roster
            </p>
            <h2 className="text-gold-accent font-serif text-3xl">
              Sworn to This Banner
            </h2>
          </div>
          <div className="text-parchment-300 hidden items-center gap-2 md:flex">
            <Users className="text-gold-500 h-4 w-4" />
            {guildMembers.length} listed
          </div>
        </div>

        <GuildMemberList members={guildMembers} />
      </section>

      <section className="border-iron-700 bg-iron-800/70 mt-12 border p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-parchment-200 font-serif text-2xl">
              Ready to pledge your colors?
            </h2>
            <p className="text-parchment-300 mt-2 text-sm">
              Guild affiliation is managed through your heraldry so the realm
              keeps a single source of truth.
            </p>
          </div>
          <Link
            href={membershipState.kind === "anonymous" ? "/login" : "/profile"}
            className="border-gold-600 bg-leather-800 text-gold-400 hover:bg-leather-700 hover:text-gold-300 inline-flex items-center gap-2 self-start border-2 px-5 py-3 font-serif tracking-wider transition"
          >
            <ShieldCheck className="h-4 w-4" />
            {membershipState.kind === "anonymous"
              ? "Enter the Guild"
              : "Open Heraldry"}
          </Link>
        </div>
      </section>
    </div>
  );
}
