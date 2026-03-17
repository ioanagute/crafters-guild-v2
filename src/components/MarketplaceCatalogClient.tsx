'use client';

import Link from "next/link";
import { Package, Search, SlidersHorizontal, UserCircle2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import RemoteImage from "@/components/RemoteImage";
import StatePanel from "@/components/StatePanel";
import StatPill from "@/components/StatPill";
import ThemedLinkButton from "@/components/ThemedLinkButton";
import { buildSearchParams, sanitizeMarketplaceFilters } from "@/lib/filters";
import {
  MARKETPLACE_CATEGORIES,
  type MarketplaceCatalogPage,
} from "@/features/marketplace/types";

type MarketplaceFilters = {
  query: string;
  category: string;
  sort: "newest" | "price-asc" | "price-desc";
  page: number;
};

const categories = ["All", ...MARKETPLACE_CATEGORIES];

export default function MarketplaceCatalogClient({
  catalog,
  isArtisan,
}: {
  catalog: MarketplaceCatalogPage;
  isArtisan: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function commitFilters(nextFilters: MarketplaceFilters) {
    const normalized = sanitizeMarketplaceFilters({
      query: nextFilters.query,
      category: nextFilters.category,
      sort: nextFilters.sort,
      page: nextFilters.page,
      validCategories: categories,
    });
    const next = buildSearchParams({
      query: normalized.query || null,
      category: normalized.category !== "All" ? normalized.category : null,
      sort: normalized.sort !== "newest" ? normalized.sort : null,
      page: normalized.page > 1 ? normalized.page : null,
    });
    const nextUrl = next.toString() ? `${pathname}?${next.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }

  const hasActiveFilters =
    catalog.query.trim().length > 0 || catalog.category !== "All" || catalog.sort !== "newest";
  const totalPages = Math.max(1, Math.ceil(catalog.totalCount / catalog.pageSize));

  return (
    <div className="page-shell">
      <div className="page-stack">
      <PageHeader
        eyebrow="The Grand Bazaar"
        title="Trade in Crafted Wonders"
        description="Peruse relics wrought by sworn artisans of the realm, then sort the shelves by craft, price, or freshness of the forge."
        actions={
          <>
            {isArtisan ? (
              <>
                <ThemedLinkButton href="/marketplace/new">Forge New Item</ThemedLinkButton>
                <ThemedLinkButton href="/marketplace/my-listings" variant="secondary">
                  My Listings
                </ThemedLinkButton>
              </>
            ) : null}
            <StatPill label="Available Wares" value={catalog.totalCount} />
          </>
        }
      />

        <div className="section-panel grid grid-cols-1 gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto] lg:items-center lg:px-6">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-parchment-400" />
          <input
            aria-label="Search marketplace listings"
            type="text"
            key={catalog.query}
            defaultValue={catalog.query}
            onBlur={(event) =>
              commitFilters({
                query: event.target.value,
                category: catalog.category,
                sort: catalog.sort,
                page: 1,
              })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitFilters({
                  query: event.currentTarget.value,
                  category: catalog.category,
                  sort: catalog.sort,
                  page: 1,
                });
              }
            }}
            placeholder="Search wares or categories..."
            className="min-h-12 w-full rounded-[1rem] border border-iron-700 bg-iron-900 px-11 py-3 font-serif text-parchment-100 outline-none placeholder:text-iron-500 focus:border-gold-500"
          />
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-[1rem] border border-iron-700 bg-iron-900 px-4 py-3 font-serif text-parchment-100">
          <SlidersHorizontal className="h-4 w-4 text-gold-500" />
          <select
            value={catalog.category}
            onChange={(event) => {
              commitFilters({
                query: catalog.query,
                category: event.target.value,
                sort: catalog.sort,
                page: 1,
              });
            }}
            className="field-select w-full bg-transparent outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="bg-iron-900">
                {category === "All" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-[1rem] border border-iron-700 bg-iron-900 px-4 py-3 font-serif text-parchment-100">
          <Package className="h-4 w-4 text-gold-500" />
          <select
            value={catalog.sort}
            onChange={(event) => {
              commitFilters({
                query: catalog.query,
                category: catalog.category,
                sort: event.target.value as MarketplaceFilters["sort"],
                page: 1,
              });
            }}
            className="field-select w-full bg-transparent outline-none"
          >
            <option value="newest" className="bg-iron-900">Newest First</option>
            <option value="price-asc" className="bg-iron-900">Lowest Price</option>
            <option value="price-desc" className="bg-iron-900">Highest Price</option>
          </select>
        </label>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <div className="text-xs uppercase tracking-[0.25em] text-parchment-400">
              {hasActiveFilters ? "Filtered Results" : "All Bazaar Wares"}
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => {
                  commitFilters({
                    query: "",
                    category: "All",
                    sort: "newest",
                    page: 1,
                  });
                }}
                className="min-h-11 rounded-full border border-iron-700 bg-iron-800 px-4 py-2 font-serif text-sm tracking-[0.16em] text-parchment-200 transition hover:border-gold-600 hover:bg-iron-700"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        </div>

        {catalog.totalCount === 0 ? (
        <StatePanel
          tone="empty"
          title="No wares have been entered"
          description="The bazaar is ready, but no artisan has yet published a listing into the ledger."
          icon={<Package className="h-10 w-10 text-gold-500" />}
          actions={isArtisan ? <ThemedLinkButton href="/marketplace/new">Forge the First Item</ThemedLinkButton> : undefined}
        />
        ) : catalog.products.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No wares match your search"
          description="Broaden your search terms or change the category and sorting controls to inspect more of the bazaar."
          icon={<Search className="h-10 w-10 text-gold-500" />}
        />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {catalog.products.map((product) => (
                <ParchmentCard key={product.id} variant="elevated" className="flex flex-col p-6">
                  <div className="mb-5 flex h-56 items-center justify-center overflow-hidden rounded-[1rem] border-2 border-leather-800 bg-iron-900/10">
                  {product.imageUrl ? (
                    <RemoteImage
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-16 w-16 text-leather-700 opacity-50" />
                  )}
                </div>

                  <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-leather-700">
                    {product.category}
                  </span>
                    <span className="rounded-full border border-gold-600/70 bg-gold-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-leather-900">
                    Stock {product.stock}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-ink-900">{product.title}</h2>
                <div className="mt-2 flex items-center gap-2 text-sm italic text-leather-800">
                  <UserCircle2 className="h-4 w-4 text-gold-600" />
                  Crafted by {product.crafterName}
                </div>

                <p className="mt-4 flex-1 border-t border-dashed border-leather-700/50 pt-4 text-sm leading-relaxed text-ink-900">
                  {product.description}
                </p>

                  <div className="mt-6 flex items-center justify-between border-t-2 border-leather-800 pt-4">
                  <span className="font-serif text-xl font-bold text-ink-900">
                    {product.price} {product.currency}
                  </span>
                  {product.isOwner ? (
                    <Link
                      href={`/marketplace/${product.id}/edit`}
                      className="inline-flex min-h-11 items-center rounded-full border border-gold-600 bg-leather-800 px-4 py-2 font-serif text-sm tracking-[0.16em] text-parchment-200 transition hover:bg-leather-700"
                    >
                      Manage Listing
                    </Link>
                  ) : (
                    <Link
                      href={`/marketplace/${product.id}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-iron-700 bg-iron-800 px-4 py-2 font-serif text-sm tracking-[0.16em] text-parchment-200 transition hover:border-gold-600 hover:bg-iron-700"
                    >
                      Open Listing
                    </Link>
                  )}
                </div>
              </ParchmentCard>
            ))}
          </div>

            <div className="section-panel mt-2 flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-parchment-300">
              Page {catalog.page} of {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={catalog.page <= 1}
                onClick={() =>
                  commitFilters({
                    query: catalog.query,
                    category: catalog.category,
                    sort: catalog.sort,
                    page: catalog.page - 1,
                  })
                }
                className="min-h-11 rounded-full border border-leather-800 bg-parchment-100 px-4 py-2 font-serif text-sm tracking-[0.16em] text-leather-900 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!catalog.hasNextPage}
                onClick={() =>
                  commitFilters({
                    query: catalog.query,
                    category: catalog.category,
                    sort: catalog.sort,
                    page: catalog.page + 1,
                  })
                }
                className="min-h-11 rounded-full border border-gold-600 bg-leather-800 px-4 py-2 font-serif text-sm tracking-[0.16em] text-parchment-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
