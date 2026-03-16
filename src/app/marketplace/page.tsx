import { getCurrentSessionProfile } from '@/lib/auth';
import MarketplaceCatalogClient from '@/components/MarketplaceCatalogClient';
import { sanitizeMarketplaceFilters } from '@/lib/filters';
import { listMarketplaceProducts } from '@/features/marketplace/server/marketplace';
import { MARKETPLACE_CATEGORIES } from '@/features/marketplace/types';

export default async function Marketplace({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getCurrentSessionProfile();
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = sanitizeMarketplaceFilters({
    query: typeof resolvedSearchParams.query === "string" ? resolvedSearchParams.query : null,
    category: typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : null,
    sort: typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : null,
    page: typeof resolvedSearchParams.page === "string" ? resolvedSearchParams.page : null,
    validCategories: ["All", ...MARKETPLACE_CATEGORIES],
  });
  const catalog = await listMarketplaceProducts({
    viewerId: session.user?.id,
    query: filters.query,
    category: filters.category,
    sort: filters.sort,
    page: filters.page,
    pageSize: 24,
  });
  const isArtisan = session.profile?.role === 'artisan';

  return (
    <MarketplaceCatalogClient
      catalog={{
        ...catalog,
        query: filters.query,
        category: filters.category,
        sort: filters.sort,
      }}
      isArtisan={Boolean(isArtisan)}
    />
  );
}
