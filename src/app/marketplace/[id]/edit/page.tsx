import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { PencilLine } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import ProductForm from "@/components/ProductForm";
import StatePanel from "@/components/StatePanel";
import ThemedLinkButton from "@/components/ThemedLinkButton";
import { createClient } from "@/utils/supabase/server";

type EditableProduct = {
  id: string;
  crafter_id: string;
  title: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
  stock: number | null;
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "artisan") {
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

  const { data: product } = await supabase
    .from("products")
    .select("id, crafter_id, title, category, price, description, image_url, stock")
    .eq("id", id)
    .eq("crafter_id", user.id)
    .maybeSingle();

  const editableProduct = product as EditableProduct | null;

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

  async function updateProduct(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const payload = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      image_url: (formData.get("image_url") as string) || null,
      stock: Number(formData.get("stock")),
    };

    const { error, data } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .eq("crafter_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Failed to update marketplace listing:", error);
      notFound();
    }

    if (!data) {
      return;
    }

    revalidatePath("/marketplace");
    revalidatePath("/marketplace/my-listings");
    revalidatePath(`/marketplace/${id}/edit`);
    redirect("/marketplace/my-listings");
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
        <form action={updateProduct}>
          <ProductForm submitLabel="Seal Amendments into the Ledger" values={editableProduct} />
        </form>
      </ParchmentCard>
    </div>
  );
}
