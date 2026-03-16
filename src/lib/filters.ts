export type MarketplaceSort = "newest" | "price-asc" | "price-desc";
export type TavernFilter = "all" | "public" | "exclusive" | "mine";

export function sanitizeMarketplaceFilters(input: {
  query?: string | null;
  category?: string | null;
  sort?: string | null;
  validCategories: readonly string[];
  page?: string | number | null;
}): { query: string; category: string; sort: MarketplaceSort; page: number } {
  const query = input.query?.trim() ?? "";
  const category =
    input.category && input.validCategories.includes(input.category)
      ? input.category
      : "All";
  const sort: MarketplaceSort =
    input.sort === "price-asc" || input.sort === "price-desc" || input.sort === "newest"
      ? input.sort
      : "newest";
  const rawPage = typeof input.page === "number" ? input.page : Number(input.page ?? 1);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  return { query, category, sort, page };
}

export function sanitizeGuildQuery(query?: string | null) {
  return query?.trim() ?? "";
}

export function sanitizeTavernFilter(filter?: string | null, isAuthenticated = false): TavernFilter {
  if (filter === "public" || filter === "exclusive" || filter === "all") return filter;
  if (filter === "mine" && isAuthenticated) return "mine";
  return "all";
}

export function buildSearchParams(
  entries: Record<string, string | number | null | undefined>,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(entries)) {
    if (value === null || value === undefined) continue;
    const normalized = String(value).trim();
    if (!normalized) continue;
    params.set(key, normalized);
  }

  return params;
}
