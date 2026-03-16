"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { Save, Shield } from "lucide-react";
import RemoteImage from "@/components/RemoteImage";
import FieldError from "@/components/form/FieldError";
import FormField from "@/components/form/FormField";
import FormStatusBanner from "@/components/form/FormStatusBanner";
import PendingButton from "@/components/form/PendingButton";
import { useAutoFocusFirstError } from "@/lib/client/useAutoFocusFirstError";
import { idleFormState } from "@/lib/form-action-state";
import type {
  GuildOption,
  Profile,
  ProfileFormState,
} from "@/features/profiles/types";

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
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl || "");
  const formRef = useRef<HTMLFormElement>(null);
  useAutoFocusFirstError(state.fieldErrors, state.status, formRef);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6">
      <FormStatusBanner status="error" message={state.status === "error" ? state.message : undefined} />
      <FormStatusBanner status="success" message={state.status === "success" ? state.message : undefined} />

      <section className="rounded-[1.2rem] border border-leather-800/30 bg-parchment-100/50 p-6">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-leather-700">Crest & Presence</p>
        <div className="flex flex-col items-center gap-6 border-b-2 border-dashed border-leather-800 pb-8 sm:flex-row">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[1.2rem] border-4 border-gold-600 bg-iron-900">
            {avatarPreview ? (
              <RemoteImage src={avatarPreview} alt="Crest" className="h-full w-full object-cover" />
            ) : (
              <Shield className="w-12 h-12 text-leather-700 opacity-50" />
            )}
          </div>
          <FormField
          label="Crest Portrait (Image URL)"
          htmlFor="avatar_url"
          className="flex-1 w-full flex flex-col gap-2"
          helpText="Provide a link to an image depicting your visage or guild animal."
        >
          <input
            id="avatar_url"
            name="avatar_url"
            defaultValue={profile.avatarUrl || ""}
            data-field-name="avatar_url"
            aria-invalid={Boolean(state.fieldErrors?.avatar_url)}
            aria-describedby={state.fieldErrors?.avatar_url ? "avatar-url-error" : undefined}
            placeholder="https://example.com/my-portrait.png"
            onChange={(event) => setAvatarPreview(event.target.value.trim())}
            className="field-input w-full font-serif"
          />
          <FieldError id="avatar-url-error" message={state.fieldErrors?.avatar_url} />
        </FormField>
        </div>
      </section>

      <section className="rounded-[1.2rem] border border-leather-800/30 bg-parchment-100/50 p-6">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-leather-700">Declared Identity</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="Chosen Name (Username)" htmlFor="username">
          <input
            id="username"
            name="username"
            defaultValue={profile.username || ""}
            data-field-name="username"
            aria-invalid={Boolean(state.fieldErrors?.username)}
            aria-describedby={state.fieldErrors?.username ? "username-error" : undefined}
            placeholder="e.g. GromTheSmith"
            className="field-input font-serif"
          />
          <FieldError id="username-error" message={state.fieldErrors?.username} />
        </FormField>

        <FormField label="Full Title" htmlFor="full_name">
          <input
            id="full_name"
            name="full_name"
            defaultValue={profile.fullName || ""}
            data-field-name="full_name"
            aria-invalid={Boolean(state.fieldErrors?.full_name)}
            aria-describedby={state.fieldErrors?.full_name ? "full-name-error" : undefined}
            placeholder="Grom of the Iron Hills"
            className="field-input font-serif"
          />
          <FieldError id="full-name-error" message={state.fieldErrors?.full_name} />
        </FormField>
        </div>
      </section>

      <section className="rounded-[1.2rem] border border-leather-800/30 bg-parchment-100/50 p-6">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-leather-700">Affiliation & Rank</p>
        <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Current Role within the Realm</label>
          <div className="rounded-[0.95rem] border border-iron-800 bg-iron-900 px-4 py-3 font-serif uppercase tracking-widest text-gold-500 opacity-80 cursor-not-allowed">
            {profile.role || "Patron"}
          </div>
          <p className="text-xs text-leather-700 italic">Roles are declared upon registration.</p>
        </div>

        <FormField label="Guild Affiliation" htmlFor="guild_id" className="flex flex-col gap-2 w-full md:w-1/2">
          <div className="rounded-sm border border-gold-600/60 bg-leather-800 px-4 py-3 text-sm text-parchment-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
            <span className="block text-[11px] uppercase tracking-[0.25em] text-gold-400">Current Banner</span>
            <span className="mt-1 block font-serif text-lg">
              {profile.guildName || "Unaffiliated (Lone Wanderer)"}
            </span>
          </div>
          <select
            id="guild_id"
            name="guild_id"
            defaultValue={profile.guildId || ""}
            data-field-name="guild_id"
            aria-invalid={Boolean(state.fieldErrors?.guild_id)}
            aria-describedby={state.fieldErrors?.guild_id ? "guild-id-error" : undefined}
            className="field-input field-select font-serif"
          >
            <option value="">Unaffiliated (Lone Wanderer)</option>
            {guildOptions.map((guild) => (
              <option key={guild.id} value={guild.id}>{guild.name}</option>
            ))}
          </select>
          <FieldError id="guild-id-error" message={state.fieldErrors?.guild_id} />
          <div className="flex items-center justify-between gap-3 text-xs text-leather-700 italic">
            <span>Join a guild to bear their colors in the Tavern.</span>
            <Link href="/guilds" className="not-italic text-leather-900 underline decoration-gold-600 underline-offset-2 hover:text-gold-600">
              Browse all guilds
            </Link>
          </div>
        </FormField>
        </div>
      </section>

      <section className="rounded-[1.2rem] border border-leather-800/30 bg-parchment-100/50 p-6">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-leather-700">Lore</p>
        <FormField label="Biography & Lore" htmlFor="bio" className="flex flex-col gap-2">
        <textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio || ""}
          rows={5}
          data-field-name="bio"
          aria-invalid={Boolean(state.fieldErrors?.bio)}
          aria-describedby={state.fieldErrors?.bio ? "bio-error" : undefined}
          placeholder="Tell the realm of your deeds and specialties..."
          className="field-input min-h-40 resize-y font-serif"
        />
        <FieldError id="bio-error" message={state.fieldErrors?.bio} />
      </FormField>
      </section>

      <div className="mt-8 flex justify-end">
        <PendingButton
          pending={isPending}
          idleLabel="Impress into Wax"
          pendingLabel="Sealing..."
          icon={<Save className="w-5 h-5" />}
          className="flex min-h-12 items-center gap-2 rounded-[1rem] border border-gold-600 bg-leather-800 px-8 py-3 font-serif text-lg tracking-[0.16em] text-parchment-200 shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-70"
        />
      </div>
    </form>
  );
}
