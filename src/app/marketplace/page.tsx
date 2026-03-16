import { getCurrentSessionProfile } from '@/lib/auth';
import MarketplaceCatalogClient from '@/components/MarketplaceCatalogClient';
import { listMarketplaceProducts } from '@/features/marketplace/server/marketplace';

export default async function Marketplace() {
  const session = await getCurrentSessionProfile();
  const products = await listMarketplaceProducts(session.user?.id);
  const isArtisan = session.profile?.role === 'artisan';

  return <MarketplaceCatalogClient products={products} isArtisan={Boolean(isArtisan)} />;
}
