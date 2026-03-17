'use client';

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GuildCard from "@/components/GuildCard";
import StatePanel from "@/components/StatePanel";
import type { Guild } from "@/features/guilds/types";
import { buildSearchParams, sanitizeGuildQuery } from "@/lib/filters";

export default function GuildDirectoryClient({
  guilds,
}: {
  guilds: Guild[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlQuery = useMemo(() => sanitizeGuildQuery(searchParams.get("query")), [searchParams]);
  const [query, setQuery] = useState(() => urlQuery);

  function commitQuery(nextQuery: string) {
    const normalized = nextQuery.trim();
    if (normalized === urlQuery) return;

    const next = buildSearchParams({ query: normalized });
    const nextUrl = next.toString() ? `${pathname}?${next.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }

  const filteredGuilds = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return guilds;

    return guilds.filter((guild) => {
      return (
        guild.name.toLowerCase().includes(normalized) ||
        (guild.description || "").toLowerCase().includes(normalized)
      );
    });
  }, [guilds, query]);

  return (
    <div className="space-y-8">
      <div className="section-panel px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold-400">
            Search The Charters
          </p>
            <p className="text-sm text-parchment-300">
            Seek a guild by its name, discipline, or written lore.
          </p>
        </div>

          <label className="relative block w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-parchment-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={(event) => commitQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitQuery(query);
              }
            }}
            placeholder="Search guilds..."
            aria-label="Search guilds"
            className="min-h-12 w-full rounded-[1rem] border border-iron-700 bg-iron-900/90 px-11 py-3 font-serif text-parchment-100 outline-none transition placeholder:text-iron-500 focus:border-gold-500"
          />
        </label>
      </div>
      </div>

      {query.trim() ? (
        <div className="-mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setQuery("");
              commitQuery("");
            }}
            className="min-h-11 rounded-full border border-iron-700 bg-iron-800 px-4 py-2 font-serif text-sm tracking-[0.16em] text-parchment-200 transition hover:border-gold-600 hover:bg-iron-700"
          >
            Clear Search
          </button>
        </div>
      ) : null}

      {filteredGuilds.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No charter matches your search"
          description="Try another title or search by a craft named in the guild's lore."
          icon={<Search className="h-10 w-10 text-gold-500" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {filteredGuilds.map((guild) => (
            <GuildCard key={guild.id} guild={guild} />
          ))}
        </div>
      )}
    </div>
  );
}
