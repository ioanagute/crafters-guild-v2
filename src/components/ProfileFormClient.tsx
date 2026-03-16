"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { Save, Shield } from "lucide-react";
import FormMessage from "@/components/FormMessage";
import { idleFormState } from "@/lib/form-action-state";
import type {
  GuildOption,
  Profile,
  ProfileFormState,
} from "@/features/profiles/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-blood-700">{message}</p>;
}

export default function ProfileFormClient({
  action,
  profile,
  guildOptions,
}: {
  action: (
    state: ProfileFormState,
    formData: FormData,
  ) => Promise<ProfileFormState>;
  profile: Profile;
  guildOptions: GuildOption[];
}) {
  const [state, formAction, isPending] = useActionState(action, idleFormState());

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.status === "error" && state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}
      {state.status === "success" && state.message ? (
        <FormMessage tone="success">{state.message}</FormMessage>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-6 items-center border-b-2 border-dashed border-leather-800 pb-8">
        <div className="w-32 h-32 bg-iron-900 border-4 border-gold-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {profile.avatarUrl ? (
            <Image src={profile.avatarUrl} alt="Crest" width={160} height={160} className="h-full w-full object-cover" unoptimized />
          ) : (
            <Shield className="w-12 h-12 text-leather-700 opacity-50" />
          )}
        </div>
        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Crest Portrait (Image URL)</label>
          <input
            name="avatar_url"
            defaultValue={profile.avatarUrl || ""}
            placeholder="https://example.com/my-portrait.png"
            className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 w-full font-serif"
          />
          <FieldError message={state.fieldErrors?.avatar_url} />
          <p className="text-xs text-leather-700 italic">Provide a link to an image depicting your visage or guild animal.</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Chosen Name (Username)</label>
          <input
            name="username"
            defaultValue={profile.username || ""}
            placeholder="e.g. GromTheSmith"
            className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 font-serif"
          />
          <FieldError message={state.fieldErrors?.username} />
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Full Title</label>
          <input
            name="full_name"
            defaultValue={profile.fullName || ""}
            placeholder="Grom of the Iron Hills"
            className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 font-serif"
          />
          <FieldError message={state.fieldErrors?.full_name} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Current Role within the Realm</label>
          <div className="px-4 py-3 bg-iron-900 border-2 border-iron-800 text-gold-500 font-serif uppercase tracking-widest opacity-80 cursor-not-allowed">
            {profile.role || "Patron"}
          </div>
          <p className="text-xs text-leather-700 italic">Roles are declared upon registration.</p>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Guild Affiliation</label>
          <div className="rounded-sm border border-gold-600/60 bg-leather-800 px-4 py-3 text-sm text-parchment-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
            <span className="block text-[11px] uppercase tracking-[0.25em] text-gold-400">Current Banner</span>
            <span className="mt-1 block font-serif text-lg">
              {profile.guildName || "Unaffiliated (Lone Wanderer)"}
            </span>
          </div>
          <select
            name="guild_id"
            defaultValue={profile.guildId || ""}
            className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 font-serif"
          >
            <option value="">Unaffiliated (Lone Wanderer)</option>
            {guildOptions.map((guild) => (
              <option key={guild.id} value={guild.id}>{guild.name}</option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.guild_id} />
          <div className="flex items-center justify-between gap-3 text-xs text-leather-700 italic">
            <span>Join a guild to bear their colors in the Tavern.</span>
            <Link href="/guilds" className="not-italic text-leather-900 underline decoration-gold-600 underline-offset-2 hover:text-gold-600">
              Browse all guilds
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Biography & Lore</label>
        <textarea
          name="bio"
          defaultValue={profile.bio || ""}
          rows={5}
          placeholder="Tell the realm of your deeds and specialties..."
          className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 font-serif resize-y"
        />
        <FieldError message={state.fieldErrors?.bio} />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-leather-800 hover:bg-leather-700 text-parchment-200 font-serif border-2 border-gold-600 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all tracking-wider text-lg flex items-center gap-2 disabled:opacity-70"
        >
          <Save className="w-5 h-5" /> {isPending ? "Sealing..." : "Impress into Wax"}
        </button>
      </div>
    </form>
  );
}
