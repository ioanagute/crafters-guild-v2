import { createClient } from '@/utils/supabase/server';
import MarketplaceCatalogClient, { type MarketplaceProductCard } from '@/components/MarketplaceCatalogClient';

type ProductRow = {
  id: string;
  crafter_id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  category: string;
  image_url: string | null;
  stock: number | null;
  created_at: string;
  profiles:
  | {
      username: string | null;
      full_name: string | null;
    }
  | {
      username: string | null;
      full_name: string | null;
    }[]
  | null;
};

function getCrafterProfile(profile: ProductRow['profiles']) {
  if (!profile) return null;
  return Array.isArray(profile) ? profile[0] || null : profile;
}

export default async function Marketplace() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: realProducts } = await supabase
    .from('products')
    .select(`
      id,
      crafter_id,
      title,
      description,
      price,
      currency,
      category,
      image_url,
      stock,
      created_at,
      profiles:crafter_id ( username, full_name )
    `)
    .order('created_at', { ascending: false });

  const displayItems: MarketplaceProductCard[] = ((realProducts as ProductRow[] | null) || []).map((p) => {
    const crafter = getCrafterProfile(p.profiles);

    return {
      id: p.id,
      created_at: p.created_at,
      title: p.title,
      crafterName: crafter?.username || crafter?.full_name || 'Unknown Artisan',
      price: Number(p.price),
      currency: p.currency,
      category: p.category,
      description: p.description || 'No lore has been recorded for this item.',
      image_url: p.image_url,
      stock: p.stock ?? 0,
      isOwner: user?.id === p.crafter_id,
    };
  });

  let isArtisan = false;
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile && profile.role === 'artisan') {
      isArtisan = true;
    }
  }

  return <MarketplaceCatalogClient products={displayItems} isArtisan={isArtisan} />;
}
