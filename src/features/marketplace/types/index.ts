import type { ActionResult } from "@/lib/action-result";
import type { FormActionState } from "@/lib/form-action-state";
import type { MarketplaceSort } from "@/lib/filters";

export const MARKETPLACE_CATEGORIES = [
  "Apparel",
  "Weaponry",
  "Armor",
  "Consumable",
  "Magic",
  "Tool",
  "Other",
] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];

export type MarketplaceProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: MarketplaceCategory;
  imageUrl: string | null;
  stock: number;
  crafterId: string;
  crafterName: string;
  isOwner: boolean;
  createdAt: string;
};

export type ManagedListing = {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: MarketplaceCategory;
  stock: number;
  createdAt: string;
};

export type EditableProduct = {
  id: string;
  title: string;
  category: MarketplaceCategory;
  price: number;
  description: string;
  imageUrl: string | null;
  stock: number;
};

export type CreateProductInput = {
  title: string;
  description: string;
  price: number;
  category: MarketplaceCategory;
  imageUrl: string | null;
  stock: number;
};

export type UpdateProductInput = CreateProductInput;

export type MarketplaceCatalogPage = {
  products: MarketplaceProduct[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  sort: MarketplaceSort;
  query: string;
  category: string;
};

export type ProductMutationResult = ActionResult<{ id: string }>;
export type MarketplaceField =
  | "title"
  | "description"
  | "category"
  | "price"
  | "stock"
  | "image_url";
export type MarketplaceFormState = FormActionState<MarketplaceField>;
