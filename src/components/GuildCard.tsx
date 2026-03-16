import Link from "next/link";
import { Crown, Users } from "lucide-react";
import RemoteImage from "@/components/RemoteImage";
import type { Guild } from "@/features/guilds/types";
import ParchmentCard from "./ParchmentCard";

export default function GuildCard({ guild }: { guild: Guild }) {
  return (
    <ParchmentCard variant="elevated" className="h-full p-6">
      <div className="mb-5 flex items-start justify-between gap-4 border-b-2 border-dashed border-leather-800/20 pb-5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border-2 border-leather-800 bg-iron-900/10 shadow-inner">
            {guild.emblemUrl ? (
              <RemoteImage
                src={guild.emblemUrl}
                alt={`${guild.name} emblem`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Crown className="h-8 w-8 text-leather-700 opacity-60" />
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.35em] text-leather-700/80">
              House Charter
            </p>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-ink-900 line-clamp-1">
              {guild.name}
            </h2>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-gold-600/40 bg-gold-500/5 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-leather-900">
          <Users className="h-3.5 w-3.5 text-gold-600" />
          <span>{guild.memberCount} members</span>
        </div>
      </div>

      <p className="mb-6 h-20 overflow-hidden text-sm leading-relaxed text-leather-900/90 line-clamp-3">
        {guild.description || "No charter has yet been inscribed for this house."}
      </p>

      <div className="flex items-center justify-between border-t border-leather-800/30 pt-4">
        <span className="text-[0.65rem] uppercase tracking-[0.25em] text-leather-700/80 font-bold">
          Open Enrollment
        </span>
        <Link
          href={`/guilds/${guild.id}`}
          className="group relative inline-flex min-h-10 items-center overflow-hidden rounded-full bg-leather-800 px-5 py-2 font-serif text-[0.75rem] uppercase tracking-[0.18em] text-parchment-200 transition hover:bg-leather-700 hover:text-gold-200"
        >
          <div className="absolute inset-x-0 inset-y-0 h-full w-8 -translate-x-full rotate-25 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-sheen" />
          <span className="relative">View Charter</span>
        </Link>
      </div>
    </ParchmentCard>
  );
}
