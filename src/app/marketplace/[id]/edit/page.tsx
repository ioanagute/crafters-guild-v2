import { PencilLine } from "lucide-react";
import MarketplaceProductFormClient from "@/components/MarketplaceProductFormClient";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import StatePanel from "@/components/StatePanel";
import ThemedLinkButton from "@/components/ThemedLinkButton";
import { requireSessionProfile } from "@/lib/auth";
import {
  getEditableListingForOwner,
} from "@/features/marketplace/server/marketplace";
import { updateProductAction } from "@/features/marketplace/actions";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await requireSessionProfile("/login");

  if (profile.role !== "artisan") {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <StatePanel
          tone="error"
          title="Only artisans may amend wares"
          description="Your current heraldry does not allow listing management."
          actions={<ThemedLinkButton href="/marketplace">Return to Bazaar</ThemedLinkButton>}
        />
      </div>
    );
  }

  const editableProduct = await getEditableListingForOwner(id, user.id);

  if (!editableProduct) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <StatePanel
          tone="error"
          title="This listing belongs to another artisan"
          description="You may only alter wares that bear your own seal."
          actions={<ThemedLinkButton href="/marketplace/my-listings">Return to My Listings</ThemedLinkButton>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <PageHeader
        eyebrow="Listing Management"
        title="Refine a Bazaar Entry"
        description="Adjust the description, stock, or price of your work before the next patron inspects it."
      />

      <ParchmentCard className="p-8 sm:p-12">
        <div className="mb-6 flex items-center gap-3 border-b-2 border-dashed border-leather-800 pb-5">
          <PencilLine className="h-6 w-6 text-gold-600" />
          <p className="font-serif text-lg text-ink-900">
            Editing {editableProduct.title}
          </p>
        </div>
        <MarketplaceProductFormClient
          action={updateProductAction.bind(null, id)}
          submitLabel="Seal Amendments into the Ledger"
          values={editableProduct}
        />
      </ParchmentCard>
    </div>
  );
}
