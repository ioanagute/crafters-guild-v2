'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Edit3, Megaphone, Save, Send, ShieldAlert, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FieldError from "@/components/form/FieldError";
import FormStatusBanner from "@/components/form/FormStatusBanner";
import PendingButton from "@/components/form/PendingButton";
import StatePanel from "@/components/StatePanel";
import { useAutoFocusFirstError } from "@/lib/client/useAutoFocusFirstError";
import { buildSearchParams, sanitizeTavernFilter, type TavernFilter } from "@/lib/filters";
import { idleFormState } from "@/lib/form-action-state";
import type { TavernPost } from "@/features/tavern/types";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function TavernBoardClient({
  posts,
  isAuthenticated,
  createPostAction,
  updatePostAction,
  deletePostAction,
}: {
  posts: TavernPost[];
  isAuthenticated: boolean;
  createPostAction: (state: import("@/features/tavern/types").TavernFormState, formData: FormData) => Promise<import("@/features/tavern/types").TavernFormState>;
  updatePostAction: (state: import("@/features/tavern/types").TavernFormState, formData: FormData) => Promise<import("@/features/tavern/types").TavernFormState>;
  deletePostAction: (state: import("@/lib/form-action-state").FormActionState, formData: FormData) => Promise<import("@/lib/form-action-state").FormActionState>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialFilter = useMemo(
    () => sanitizeTavernFilter(searchParams.get("filter"), isAuthenticated),
    [isAuthenticated, searchParams],
  );
  const [filter, setFilter] = useState<TavernFilter>(initialFilter);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createState, createFormAction, isCreatePending] = useActionState(createPostAction, idleFormState());
  const createFormRef = useRef<HTMLFormElement>(null);

  useAutoFocusFirstError(createState.fieldErrors, createState.status, createFormRef);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    const next = buildSearchParams({ filter: filter !== "all" ? filter : null });
    const nextUrl = next.toString() ? `${pathname}?${next.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [filter, pathname, router]);

  useEffect(() => {
    if (createState.status === "success") {
      createFormRef.current?.reset();
    }
  }, [createState.status]);

  const filteredPosts = useMemo(() => {
    if (filter === "public") return posts.filter((post) => post.tierRequired === "Public");
    if (filter === "exclusive") return posts.filter((post) => post.tierRequired !== "Public");
    if (filter === "mine") return posts.filter((post) => post.isOwner);
    return posts;
  }, [filter, posts]);

  return (
    <div className="bg-parchment flex-1 rounded-sm border-4 border-iron-800 p-8 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)]">
      {isAuthenticated ? (
        <div className="mb-8 border-b-4 border-double border-leather-800 pb-8">
          <form ref={createFormRef} action={createFormAction} className="flex flex-col gap-3">
            <FormStatusBanner status="error" message={createState.status === "error" ? createState.message : undefined} />
            <FormStatusBanner status="success" message={createState.status === "success" ? createState.message : undefined} />
            <textarea
              id="notice-content"
              name="content"
              required
              data-field-name="content"
              aria-invalid={Boolean(createState.fieldErrors?.content)}
              aria-describedby={createState.fieldErrors?.content ? "notice-content-error" : undefined}
              placeholder="Nail a notice to the board..."
              className="w-full resize-none border-2 border-leather-700 bg-parchment-100 p-4 font-serif text-ink-900 outline-none focus:border-gold-600"
              rows={3}
            />
            <FieldError id="notice-content-error" message={createState.fieldErrors?.content} />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <select
                id="tier_required"
                name="tier_required"
                data-field-name="tier_required"
                aria-invalid={Boolean(createState.fieldErrors?.tier_required)}
                aria-describedby={createState.fieldErrors?.tier_required ? "tier-required-error" : undefined}
                className="border-2 border-leather-700 bg-parchment-100 px-3 py-2 font-serif text-xs uppercase tracking-widest text-ink-900 outline-none"
              >
                <option value="Public">Public Notice</option>
                <option value="Copper">Copper Tier+</option>
                <option value="Iron">Iron Tier+</option>
                <option value="Gold">Gold Tier Exclusive</option>
              </select>
              <FieldError id="tier-required-error" message={createState.fieldErrors?.tier_required} />
              <PendingButton
                pending={isCreatePending}
                idleLabel="Post Notice"
                pendingLabel="Posting..."
                icon={<Send className="h-4 w-4" />}
                className="inline-flex items-center justify-center gap-2 border border-gold-600 bg-leather-800 px-6 py-2 font-serif text-parchment-200 transition hover:bg-leather-700 disabled:opacity-70"
              />
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-8 border-b-4 border-double border-leather-800 pb-8">
          <StatePanel
            tone="info"
            title="Read freely, post only once entered"
            description="Anonymous travelers may inspect the notices, but only registered members may pin fresh dispatches to the board."
            icon={<ShieldAlert className="h-10 w-10 text-gold-500" />}
          />
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-3 border-b-2 border-dashed border-leather-800 pb-6">
        {[
          ["all", "All Notices"],
          ["public", "Public Only"],
          ["exclusive", "Exclusive"],
          ["mine", "My Notices"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value as TavernFilter)}
            disabled={value === "mine" && !isAuthenticated}
            aria-pressed={filter === value}
            className={`border px-4 py-2 font-serif text-sm tracking-wider transition ${
              filter === value
                ? "border-gold-600 bg-leather-800 text-gold-300"
                : "border-leather-800 bg-parchment-100 text-leather-900"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {filteredPosts.length === 0 ? (
          <StatePanel
            tone="empty"
            title="No notices for this view"
            description="Try another filter, or be the first to pin a dispatch if your credentials allow it."
            icon={<Megaphone className="h-10 w-10 text-gold-500" />}
          />
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              id={`notice-${post.id}`}
              tabIndex={-1}
              className="border-b-2 border-dashed border-leather-800 pb-6 last:border-b-0"
            >
              <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-serif text-xl font-bold text-ink-900">
                      {post.authorName}
                    </span>
                    <span className="text-sm italic capitalize text-leather-700">
                      {post.authorRole}
                      {post.guildName ? ` of ${post.guildName}` : ""}
                    </span>
                  </div>
                  {post.tierRequired !== "Public" ? (
                    <div className="mt-3 inline-block border border-gold-600 bg-gold-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-leather-900">
                      {post.tierRequired} Tier Exclusive
                    </div>
                  ) : null}
                </div>
                <span className="text-sm font-serif text-leather-800/70">{timeAgo(post.createdAt)}</span>
              </div>

              {editingId === post.id ? (
                <EditablePostForm
                  post={post}
                  action={updatePostAction}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-ink-900">
                    {post.content}
                  </p>
                  {post.isOwner ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingId(post.id)}
                        className="inline-flex items-center gap-2 border border-gold-600 bg-parchment-100 px-4 py-2 font-serif text-sm tracking-wider text-leather-900"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      <DeleteNoticeForm id={post.id} action={deletePostAction} />
                    </div>
                  ) : null}
                </>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function EditablePostForm({
  post,
  action,
  onCancel,
}: {
  post: TavernPost;
  action: (
    state: import("@/features/tavern/types").TavernFormState,
    formData: FormData,
  ) => Promise<import("@/features/tavern/types").TavernFormState>;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(action, idleFormState());
  const formRef = useRef<HTMLFormElement>(null);

  useAutoFocusFirstError(state.fieldErrors, state.status, formRef);

  useEffect(() => {
    if (state.status === "success") {
      onCancel();
      requestAnimationFrame(() => {
        document.getElementById(`notice-${post.id}`)?.focus();
      });
    }
  }, [onCancel, post.id, state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={post.id} />
      <FormStatusBanner status="error" message={state.status === "error" ? state.message : undefined} />
      <FormStatusBanner status="success" message={state.status === "success" ? state.message : undefined} />
      <textarea
        name="content"
        defaultValue={post.content}
        rows={4}
        data-field-name="content"
        aria-invalid={Boolean(state.fieldErrors?.content)}
        aria-describedby={state.fieldErrors?.content ? `edit-${post.id}-content-error` : undefined}
        className="w-full resize-none border-2 border-leather-700 bg-parchment-100 p-4 font-serif text-ink-900 outline-none focus:border-gold-600"
      />
      <FieldError id={`edit-${post.id}-content-error`} message={state.fieldErrors?.content} />
      <div className="flex flex-wrap gap-3">
        <select
          name="tier_required"
          defaultValue={post.tierRequired}
          data-field-name="tier_required"
          aria-invalid={Boolean(state.fieldErrors?.tier_required)}
          aria-describedby={state.fieldErrors?.tier_required ? `edit-${post.id}-tier-error` : undefined}
          className="border-2 border-leather-700 bg-parchment-100 px-3 py-2 font-serif text-xs uppercase tracking-widest text-ink-900 outline-none"
        >
          <option value="Public">Public Notice</option>
          <option value="Copper">Copper Tier+</option>
          <option value="Iron">Iron Tier+</option>
          <option value="Gold">Gold Tier Exclusive</option>
        </select>
        <FieldError id={`edit-${post.id}-tier-error`} message={state.fieldErrors?.tier_required} />
        <PendingButton
          pending={isPending}
          idleLabel="Save Notice"
          pendingLabel="Saving..."
          icon={<Save className="h-4 w-4" />}
          className="inline-flex items-center gap-2 border border-gold-600 bg-leather-800 px-5 py-2 font-serif tracking-wider text-parchment-200 transition hover:bg-leather-700 disabled:opacity-70"
        />
        <button
          type="button"
          onClick={onCancel}
          className="border border-leather-800 bg-parchment-100 px-5 py-2 font-serif tracking-wider text-leather-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function DeleteNoticeForm({
  id,
  action,
}: {
  id: string;
  action: (
    state: import("@/lib/form-action-state").FormActionState,
    formData: FormData,
  ) => Promise<import("@/lib/form-action-state").FormActionState>;
}) {
  const [state, formAction, isPending] = useActionState(action, idleFormState());

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      {state.status === "error" && state.message ? (
        <div className="mb-3">
          <FormStatusBanner status="error" message={state.message} />
        </div>
      ) : null}
      <PendingButton
        pending={isPending}
        idleLabel="Remove"
        pendingLabel="Removing..."
        icon={<Trash2 className="h-4 w-4" />}
        className="inline-flex items-center gap-2 border border-blood-600 bg-blood-600/10 px-4 py-2 font-serif text-sm tracking-wider text-blood-600 transition hover:bg-blood-600 hover:text-parchment-200 disabled:opacity-70"
      />
    </form>
  );
}
