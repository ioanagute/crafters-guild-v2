'use client';

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import GuildCard, { type GuildListItem } from "@/components/GuildCard";

export default function GuildDirectoryClient({
  guilds,
}: {
  guilds: GuildListItem[];
}) {
  const [query, setQuery] = useState("");

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
      <div className="flex flex-col gap-4 border-b-2 border-gold-600/60 pb-6 md:flex-row md:items-center md:justify-between">
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
            placeholder="Search guilds..."
            className="w-full border-2 border-iron-700 bg-iron-900 px-11 py-3 font-serif text-parchment-200 outline-none transition placeholder:text-iron-700 focus:border-gold-500"
          />
        </label>
      </div>

      {filteredGuilds.length === 0 ? (
        <div className="border-2 border-dashed border-iron-700 bg-iron-800/60 px-6 py-12 text-center">
          <p className="mb-2 font-serif text-2xl text-gold-400">No charter matches your search</p>
          <p className="text-sm text-parchment-300">
            Try another title or search by a craft named in the guild&apos;s lore.
          </p>
        </div>
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
