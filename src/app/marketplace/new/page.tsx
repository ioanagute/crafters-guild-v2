import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import PageHeader from '@/components/PageHeader';
import ParchmentCard from '@/components/ParchmentCard';
import ProductForm from '@/components/ProductForm';

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
    const image_url = (formData.get('image_url') as string) || null;
    const stock = Number(formData.get('stock'));

    const { error } = await supabase.from('products').insert({
      crafter_id: user.id,
      title,
      description,
      price,
      category,
      currency: 'Gold',
      image_url,
      stock,
    });

    if (!error) {
      revalidatePath('/marketplace');
      revalidatePath('/marketplace/my-listings');
      redirect('/marketplace');
    } else {
      console.error(error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader
        eyebrow="Artisan Forge"
        title="Forge a New Work"
        description="Enter the full details of your creation so the bazaar can display image, stock, and lore with equal clarity."
      />

      <ParchmentCard className="p-8 sm:p-12">
        <form action={createProduct} className="flex flex-col gap-6">
          <div className="mb-2 flex items-center gap-3 border-b-2 border-dashed border-leather-800 pb-5">
            <Sparkles className="text-gold-500" />
            <p className="font-serif text-lg text-ink-900">
              Every field below feeds directly into the bazaar listing.
            </p>
          </div>
          <ProductForm submitLabel="Publish to Bazaar" />
        </form>
      </ParchmentCard>
    </div>
  );
}
