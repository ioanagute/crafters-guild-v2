import Link from 'next/link';
import { Package, Search, Filter, Plus } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

type ProductRow = {
  id: string;
  title: string;
  description: string | null;
  price: number | string;
  currency: string;
  category: string;
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

type DisplayItem = {
  id: string;
  title: string;
  crafterName: string;
  price: string;
  currency: string;
  category: string;
  description: string;
};

const mockItems = [
  { id: '1', title: "Elven Silk Cloak", crafterName: "Lysanthir", price: "250", currency: "Gold", category: "Apparel", description: "Woven under the light of a pale moon." },
  { id: '2', title: "Ironheart Greatsword", crafterName: "Grom", price: "400", currency: "Gold", category: "Weaponry", description: "Forged in the deep mountain of Khaz." },
  { id: '3', title: "Potion of Clarity", crafterName: "Alchemist Anya", price: "50", currency: "Gold", category: "Consumable", description: "Reveals hidden thoughts and paths." },
  { id: '4', title: "Dragon Scale Pauldrons", crafterName: "Valerius", price: "1500", currency: "Gold", category: "Armor", description: "Impervious to fire and weak to cold." },
  { id: '5', title: "Engraved Runestone", crafterName: "Elder Futhark", price: "120", currency: "Gold", category: "Magic", description: "Grants +1 to Insight when held." },
  { id: '6', title: "Wanderer's Map", crafterName: "Scout Elara", price: "30", currency: "Gold", category: "Tool", description: "Highly detailed map of the Northern reaches." },
];

export default async function Marketplace() {
  const supabase = await createClient();
  
  // Fetch products and their crafter details from Supabase
  const { data: realProducts } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      price,
      currency,
      category,
      profiles:crafter_id ( username, full_name )
    `)
    .order('created_at', { ascending: false });

  // Map the real data to match our UI, or fall back to mock data if empty
  let displayItems: DisplayItem[] = mockItems;
  
  if (realProducts && realProducts.length > 0) {
    displayItems = (realProducts as ProductRow[]).map((p) => {
      const crafter = getCrafterProfile(p.profiles);

      return {
      id: p.id,
      title: p.title,
      crafterName: crafter?.username || crafter?.full_name || 'Unknown Artisan',
      price: String(p.price),
      currency: p.currency,
      category: p.category,
      description: p.description || 'No lore has been recorded for this item.'
      };
    });
  }

  // Check if current user is an artisan to show the "Add Product" button
  const { data: { user } } = await supabase.auth.getUser();
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-gold-600 pb-4 mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif text-gold-accent tracking-widest mb-2">The Grand Bazaar</h1>
          <p className="text-parchment-300 italic">Peruse the finest crafts from realms near and far.</p>
        </div>
        
        <div className="flex gap-4">
          {isArtisan && (
            <Link href="/marketplace/new" className="flex items-center gap-2 px-4 py-2 bg-leather-800 border-2 border-gold-600 text-gold-400 font-serif hover:bg-leather-700 hover:text-gold-300 transition shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              <Plus className="w-4 h-4" /> Forge New Item
            </Link>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-iron-800 border-2 border-iron-700 text-parchment-300 font-serif hover:bg-iron-700 transition">
            <Filter className="w-4 h-4" /> Attributes
          </button>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-parchment-400" />
            <input 
              type="text" 
              placeholder="Search wares..." 
              className="pl-10 pr-4 py-2 bg-iron-900 border-2 border-iron-700 text-parchment-200 outline-none focus:border-gold-500 font-serif placeholder:text-iron-700" 
            />
          </div>
        </div>
      </div>

      {!realProducts?.length && (
        <div className="mb-8 p-4 bg-iron-800/50 border border-iron-700 text-parchment-300 text-sm italic text-center rounded-sm">
          No true wares have been forged yet. Displaying ancient relics (mock data) until an Artisan adds to the stock.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayItems.map((item) => (
          <div key={item.id} className="bg-parchment p-6 relative border-4 border-iron-800 flex flex-col items-center text-center group transition transform hover:-translate-y-1">
            <div className="w-full h-48 bg-iron-800/10 mb-4 border-2 border-leather-800 flex items-center justify-center">
              <Package className="w-16 h-16 text-leather-700 opacity-50 shadow-inner" />
            </div>
            <span className="text-xs uppercase tracking-widest text-leather-700 mb-2 font-bold">{item.category}</span>
            <h3 className="font-serif text-2xl font-bold text-ink-900 mb-1">{item.title}</h3>
            <p className="text-sm text-leather-800 italic mb-4">Crafted by <Link href="#" className="underline decoration-gold-600 text-leather-900 font-bold">{item.crafterName}</Link></p>
            
            <p className="text-ink-900 flex-1 mb-6 text-sm leading-relaxed border-t border-dashed border-leather-700/50 pt-4">
              &ldquo;{item.description}&rdquo;
            </p>

            <div className="w-full mt-auto flex items-center justify-between border-t-2 border-leather-800 pt-4">
              <span className="font-serif font-bold text-xl text-ink-900">{item.price} {item.currency}</span>
              <button className="px-5 py-2 bg-leather-800 text-parchment-200 font-serif hover:bg-leather-700 transition shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border border-leather-900">
                Acquire
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
