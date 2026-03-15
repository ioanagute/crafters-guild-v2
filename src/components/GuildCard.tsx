import Link from "next/link";
import { Crown, Users } from "lucide-react";

export type GuildListItem = {
  id: string;
  name: string;
  description: string | null;
  emblem_url: string | null;
  memberCount: number;
};

export default function GuildCard({ guild }: { guild: GuildListItem }) {
  return (
    <article className="bg-parchment border-4 border-iron-800 p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-1">
      <div className="mb-5 flex items-start justify-between gap-4 border-b-2 border-dashed border-leather-800/40 pb-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden border-2 border-leather-800 bg-iron-900/10">
            {guild.emblem_url ? (
              <img
                src={guild.emblem_url}
                alt={`${guild.name} emblem`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Crown className="h-8 w-8 text-leather-700 opacity-60" />
            )}
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-leather-700">
              Guild Charter
            </p>
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              {guild.name}
            </h2>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 border border-gold-600/70 bg-gold-500/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.25em] text-leather-900">
          <Users className="h-4 w-4 text-gold-600" />
          {guild.memberCount} sworn
        </div>
      </div>

      <p className="mb-6 min-h-20 text-sm leading-relaxed text-leather-900">
        {guild.description || "No charter has yet been inscribed for this house."}
      </p>

      <div className="flex items-center justify-between border-t-2 border-leather-800 pt-4">
        <span className="text-xs uppercase tracking-[0.25em] text-leather-700">
          Open to the realm
        </span>
        <Link
          href={`/guilds/${guild.id}`}
          className="bg-leather-800 px-4 py-2 font-serif text-sm tracking-wider text-parchment-200 transition hover:bg-leather-700"
        >
          View Charter
        </Link>
      </div>
    </article>
  );
}
