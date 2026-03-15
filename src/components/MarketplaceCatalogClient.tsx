'use client';

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Search, SlidersHorizontal, UserCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import StatePanel from "@/components/StatePanel";
import StatPill from "@/components/StatPill";
import ThemedLinkButton from "@/components/ThemedLinkButton";

export type MarketplaceProductCard = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image_url: string | null;
  stock: number;
  crafterName: string;
  isOwner: boolean;
  created_at: string;
};

type MarketplaceFilters = {
  query: string;
  category: string;
  sort: "newest" | "price-asc" | "price-desc";
};

const categories = ["All", "Apparel", "Weaponry", "Armor", "Consumable", "Magic", "Tool", "Other"];

function sortProducts(products: MarketplaceProductCard[], sort: MarketplaceFilters["sort"]) {
  const copy = [...products];
  if (sort === "price-asc") return copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return copy.sort((a, b) => b.price - a.price);
  return copy.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export default function MarketplaceCatalogClient({
  products,
  isArtisan,
}: {
  products: MarketplaceProductCard[];
  isArtisan: boolean;
}) {
  const [filters, setFilters] = useState<MarketplaceFilters>({
    query: "",
    category: "All",
    sort: "newest",
  });

  const filteredProducts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const matching = products.filter((product) => {
      const matchesCategory =
        filters.category === "All" || product.category === filters.category;
      const haystack = [product.title, product.category, product.description, product.crafterName]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || haystack.includes(query));
    });

    return sortProducts(matching, filters.sort);
  }, [filters, products]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
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
            <StatPill label="Available Wares" value={products.length} />
          </>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-parchment-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({ ...current, query: event.target.value }))
            }
            placeholder="Search wares, crafters, or categories..."
            className="w-full border-2 border-iron-700 bg-iron-900 px-11 py-3 font-serif text-parchment-200 outline-none placeholder:text-iron-700 focus:border-gold-500"
          />
        </label>

        <label className="flex items-center gap-3 border-2 border-iron-700 bg-iron-900 px-4 py-3 font-serif text-parchment-200">
          <SlidersHorizontal className="h-4 w-4 text-gold-500" />
          <select
            value={filters.category}
            onChange={(event) =>
              setFilters((current) => ({ ...current, category: event.target.value }))
            }
            className="w-full bg-transparent outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="bg-iron-900">
                {category === "All" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 border-2 border-iron-700 bg-iron-900 px-4 py-3 font-serif text-parchment-200">
          <Package className="h-4 w-4 text-gold-500" />
          <select
            value={filters.sort}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                sort: event.target.value as MarketplaceFilters["sort"],
              }))
            }
            className="w-full bg-transparent outline-none"
          >
            <option value="newest" className="bg-iron-900">Newest First</option>
            <option value="price-asc" className="bg-iron-900">Lowest Price</option>
            <option value="price-desc" className="bg-iron-900">Highest Price</option>
          </select>
        </label>
      </div>

      {products.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No wares have been entered"
          description="The bazaar is ready, but no artisan has yet published a listing into the ledger."
          icon={<Package className="h-10 w-10 text-gold-500" />}
          actions={isArtisan ? <ThemedLinkButton href="/marketplace/new">Forge the First Item</ThemedLinkButton> : undefined}
        />
      ) : filteredProducts.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No wares match your search"
          description="Broaden your search terms or change the category and sorting controls to inspect more of the bazaar."
          icon={<Search className="h-10 w-10 text-gold-500" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ParchmentCard key={product.id} className="flex flex-col p-6">
              <div className="mb-4 flex h-56 items-center justify-center overflow-hidden border-2 border-leather-800 bg-iron-900/10">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    width={480}
                    height={320}
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
                <span className="border border-gold-600/70 bg-gold-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-leather-900">
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
                    className="border border-gold-600 bg-leather-800 px-4 py-2 font-serif text-sm tracking-wider text-parchment-200 transition hover:bg-leather-700"
                  >
                    Manage Listing
                  </Link>
                ) : (
                  <span className="text-xs uppercase tracking-[0.2em] text-leather-700">
                    Open Listing
                  </span>
                )}
              </div>
            </ParchmentCard>
          ))}
        </div>
      )}
    </div>
  );
}
