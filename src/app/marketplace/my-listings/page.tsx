import { Edit3, Package, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import StatePanel from "@/components/StatePanel";
import StatPill from "@/components/StatPill";
import ThemedLinkButton from "@/components/ThemedLinkButton";
import { requireSessionProfile } from "@/lib/auth";
import { deleteProductFormAction } from "@/features/marketplace/actions";
import { listCurrentArtisanListings } from "@/features/marketplace/server/marketplace";
import Link from "next/link";

export default async function MyListingsPage() {
  const { user, profile } = await requireSessionProfile("/login");

  if (profile.role !== "artisan") {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <StatePanel
          tone="error"
          title="Only artisans may manage listings"
          description="Your heraldry does not presently grant permission to maintain bazaar stock. Ask the Guildmaster to elevate your role if needed."
          icon={<Package className="h-10 w-10 text-blood-600" />}
          actions={<ThemedLinkButton href="/marketplace">Return to Bazaar</ThemedLinkButton>}
        />
      </div>
    );
  }
  const ownedListings = await listCurrentArtisanListings(user.id);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <PageHeader
        eyebrow="Artisan Ledger"
        title="Your Bazaar Listings"
        description="Inspect every relic you have published, then amend stock, wording, or price before the next patron arrives."
        actions={
          <>
            <ThemedLinkButton href="/marketplace/new">Forge New Item</ThemedLinkButton>
            <StatPill label="My Listings" value={ownedListings.length} />
          </>
        }
      />

      {ownedListings.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No wares in your ledger"
          description="You have the rank of artisan, but you have not yet entered any crafted works into the bazaar."
          icon={<Package className="h-10 w-10 text-gold-500" />}
          actions={<ThemedLinkButton href="/marketplace/new">Forge Your First Listing</ThemedLinkButton>}
        />
      ) : (
        <div className="space-y-6">
          {ownedListings.map((listing) => (
            <ParchmentCard key={listing.id} className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-leather-700">{listing.category}</p>
                  <h2 className="mt-2 font-serif text-3xl text-ink-900">{listing.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-leather-800">
                    <span>{listing.price} {listing.currency}</span>
                    <span>Stock {listing.stock ?? 0}</span>
                    <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/marketplace/${listing.id}/edit`}
                    className="inline-flex items-center gap-2 border-2 border-gold-600 bg-leather-800 px-5 py-3 font-serif tracking-wider text-gold-400 transition hover:bg-leather-700 hover:text-gold-300"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Listing
                  </Link>
                  <form action={deleteProductFormAction}>
                    <input type="hidden" name="id" value={listing.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 border border-blood-600 bg-blood-600/10 px-5 py-3 font-serif tracking-wider text-blood-600 transition hover:bg-blood-600 hover:text-parchment-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            </ParchmentCard>
          ))}
        </div>
      )}
    </div>
  );
}
