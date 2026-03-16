import { Sparkles } from 'lucide-react';
import MarketplaceProductFormClient from '@/components/MarketplaceProductFormClient';
import PageHeader from '@/components/PageHeader';
import ParchmentCard from '@/components/ParchmentCard';
import { requireSessionProfile } from '@/lib/auth';
import { createProductAction } from '@/features/marketplace/actions';

export default async function NewItemPage() {
  const { profile } = await requireSessionProfile('/login');

  if (profile.role !== 'artisan') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-serif text-blood-600 tracking-wider mb-4 font-bold">Only Artisans May Forge</h1>
        <p className="text-xl text-parchment-300 font-serif max-w-lg mb-8">
          You lack the credentials of a Master Crafter. Request an elevation in rank from the Guildmaster (change your role in Supabase) to list wares.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader
        eyebrow="Artisan Forge"
        title="Forge a New Work"
        description="Enter the full details of your creation so the bazaar can display image, stock, and lore with equal clarity."
      />

      <ParchmentCard className="p-8 sm:p-12">
        <div className="mb-2 flex items-center gap-3 border-b-2 border-dashed border-leather-800 pb-5">
          <Sparkles className="text-gold-500" />
          <p className="font-serif text-lg text-ink-900">
            Every field below feeds directly into the bazaar listing.
          </p>
        </div>
        <MarketplaceProductFormClient
          action={createProductAction}
          submitLabel="Publish to Bazaar"
        />
      </ParchmentCard>
    </div>
  );
}
