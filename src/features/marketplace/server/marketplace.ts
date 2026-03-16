import { fail, ok } from "@/lib/action-result";
import type { Database } from "@/lib/database.types";
import { readNumber, readOptionalString, readString } from "@/lib/forms";
import { createClient } from "@/utils/supabase/server";
import { requireArtisanProfile } from "@/lib/auth";
import {
  MARKETPLACE_CATEGORIES,
  type CreateProductInput,
  type EditableProduct,
  type ManagedListing,
  type MarketplaceCategory,
  type MarketplaceProduct,
  type ProductMutationResult,
  type UpdateProductInput,
} from "@/features/marketplace/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"] & {
  profiles:
    | { username: string | null; full_name: string | null }
    | { username: string | null; full_name: string | null }[]
    | null;
};

type EditableProductRow = Database["public"]["Tables"]["products"]["Row"];

function getCrafterProfile(profile: ProductRow["profiles"]) {
  if (!profile) return null;
  return Array.isArray(profile) ? profile[0] ?? null : profile;
}

function isMarketplaceCategory(value: string): value is MarketplaceCategory {
  return MARKETPLACE_CATEGORIES.includes(value as MarketplaceCategory);
}

export function validateProductInput(formData: FormData) {
  const title = readString(formData, "title").trim();
  const description = readString(formData, "description").trim();
  const rawCategory = readString(formData, "category");
  const price = readNumber(formData, "price");
  const stock = readNumber(formData, "stock");
  const imageUrl = readOptionalString(formData, "image_url");

  const fieldErrors: Record<string, string> = {};

  if (!title) fieldErrors.title = "Title is required.";
  if (!description) fieldErrors.description = "Description is required.";
  if (!isMarketplaceCategory(rawCategory)) fieldErrors.category = "Select a valid category.";
  if (!Number.isFinite(price) || price <= 0) fieldErrors.price = "Price must be greater than zero.";
  if (!Number.isInteger(stock) || stock < 0) fieldErrors.stock = "Stock must be zero or greater.";

  if (Object.keys(fieldErrors).length > 0) {
    return fail<CreateProductInput>("Invalid marketplace input.", fieldErrors);
  }

  return ok<CreateProductInput>({
    title,
    description,
    category: rawCategory as MarketplaceCategory,
    price,
    imageUrl,
    stock,
  });
}

export async function listMarketplaceProducts(viewerId?: string | null) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
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
    .order("created_at", { ascending: false });

  return ((data as ProductRow[] | null) ?? []).map<MarketplaceProduct>((row) => {
    const crafter = getCrafterProfile(row.profiles);

    return {
      id: row.id,
      title: row.title,
      description: row.description ?? "No lore has been recorded for this item.",
      price: Number(row.price),
      currency: row.currency,
      category: row.category,
      imageUrl: row.image_url,
      stock: row.stock ?? 0,
      crafterId: row.crafter_id,
      crafterName: crafter?.username ?? crafter?.full_name ?? "Unknown Artisan",
      isOwner: viewerId === row.crafter_id,
      createdAt: row.created_at,
    };
  });
}

export async function listCurrentArtisanListings(crafterId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, title, price, currency, category, stock, created_at")
    .eq("crafter_id", crafterId)
    .order("created_at", { ascending: false });

  return ((data as EditableProductRow[] | null) ?? []).map<ManagedListing>((row) => ({
    id: row.id,
    title: row.title,
    price: Number(row.price),
    currency: "Gold",
    category: row.category,
    stock: row.stock ?? 0,
    createdAt: row.created_at ?? "",
  }));
}

export async function getEditableListingForOwner(id: string, crafterId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, crafter_id, title, category, price, description, image_url, stock")
    .eq("id", id)
    .eq("crafter_id", crafterId)
    .maybeSingle();

  const row = data as EditableProductRow | null;

  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    price: Number(row.price),
    description: row.description ?? "",
    imageUrl: row.image_url,
    stock: row.stock ?? 0,
  } satisfies EditableProduct;
}

export async function createProduct(input: CreateProductInput): Promise<ProductMutationResult> {
  const { user, supabase } = await requireArtisanProfile("/marketplace/new");

  const { data, error } = await supabase
    .from("products")
    .insert({
      crafter_id: user.id,
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      currency: "Gold",
      image_url: input.imageUrl,
      stock: input.stock,
    })
    .select("id")
    .single();

  if (error || !data) {
    return fail("Unable to create marketplace listing.");
  }

  return ok({ id: data.id as string });
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<ProductMutationResult> {
  const { user, supabase } = await requireArtisanProfile(`/marketplace/${id}/edit`);

  const { data, error } = await supabase
    .from("products")
    .update({
      title: input.title,
      category: input.category,
      price: input.price,
      description: input.description,
      image_url: input.imageUrl,
      stock: input.stock,
    })
    .eq("id", id)
    .eq("crafter_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return fail("Unable to update marketplace listing.");
  }

  if (!data) {
    return fail("Listing not found or not owned by the current artisan.");
  }

  return ok({ id: data.id as string });
}

export async function deleteProduct(id: string): Promise<ProductMutationResult> {
  const { user, supabase } = await requireArtisanProfile("/marketplace/my-listings");

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("crafter_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return fail("Unable to remove marketplace listing.");
  }

  if (!data) {
    return fail("Listing not found or not owned by the current artisan.");
  }

  return ok({ id: data.id as string });
}
