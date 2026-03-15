import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Shield, Sparkles } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function NewItemPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Ensure they are an artisan
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'artisan') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-serif text-blood-600 tracking-wider mb-4 font-bold">Only Artisans May Forge</h1>
        <p className="text-xl text-parchment-300 font-serif max-w-lg mb-8">
          You lack the credentials of a Master Crafter. Request an elevation in rank from the Guildmaster (change your role in Supabase) to list wares.
        </p>
      </div>
    );
  }

  async function createProduct(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;

    const { error } = await supabase.from('products').insert({
      crafter_id: user.id,
      title,
      description,
      price,
      category,
      currency: 'Gold'
    });

    if (!error) {
      revalidatePath('/marketplace');
      redirect('/marketplace');
    } else {
      console.error(error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="border-b-2 border-gold-600 pb-4 mb-8">
        <h1 className="text-4xl font-serif text-gold-accent tracking-widest mb-2 flex items-center gap-3">
          <Sparkles className="text-gold-500" />
          Forge a New Work
        </h1>
        <p className="text-parchment-300 italic">Enter the details of your creation into the ledger.</p>
      </div>

      <div className="bg-parchment p-8 sm:p-12 border-4 border-iron-800 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <form action={createProduct} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Title of the Relic</label>
            <input 
              name="title" 
              required 
              placeholder="e.g., Elven Silk Cloak"
              className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 focus:bg-white placeholder:text-leather-700/50 font-serif"
            />
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Category</label>
              <select 
                name="category"
                className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 focus:bg-white font-serif"
              >
                <option value="Apparel">Apparel</option>
                <option value="Weaponry">Weaponry</option>
                <option value="Armor">Armor</option>
                <option value="Consumable">Consumable</option>
                <option value="Magic">Magic</option>
                <option value="Tool">Tool</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2 w-1/2">
              <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Value (in Gold)</label>
              <input 
                name="price"
                type="number"
                min="1"
                required 
                placeholder="100"
                className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 focus:bg-white placeholder:text-leather-700/50 font-serif"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Description & Lore</label>
            <textarea 
              name="description" 
              required 
              rows={4}
              placeholder="Tell the tale of its forging..."
              className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 focus:bg-white placeholder:text-leather-700/50 font-serif resize-none"
            />
          </div>

          <button 
            type="submit"
            className="mt-6 w-full py-4 bg-leather-800 hover:bg-leather-700 text-parchment-200 font-serif border-2 border-gold-600 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all tracking-wider text-xl"
          >
            Publish to Bazaar
          </button>
        </form>
      </div>
    </div>
  );
}