import { MARKETPLACE_CATEGORIES } from "@/features/marketplace/types";
import FieldError from "@/components/form/FieldError";
import FormField from "@/components/form/FormField";
import PendingButton from "@/components/form/PendingButton";
import type { MarketplaceField } from "@/features/marketplace/types";

type ProductFormValues = {
  title?: string | null;
  category?: string | null;
  price?: number | string | null;
  description?: string | null;
  imageUrl?: string | null;
  stock?: number | null;
};

export default function ProductForm({
  submitLabel,
  values,
  fieldErrors,
  isPending,
}: {
  submitLabel: string;
  values?: ProductFormValues;
  fieldErrors?: Partial<Record<MarketplaceField, string>>;
  isPending?: boolean;
}) {
  return (
    <div className="space-y-6">
      <FormField label="Title of the Relic" htmlFor="title">
        <input
          id="title"
          name="title"
          required
          defaultValue={values?.title || ""}
          data-field-name="title"
          aria-invalid={Boolean(fieldErrors?.title)}
          aria-describedby={fieldErrors?.title ? "title-error" : undefined}
          placeholder="e.g., Elven Silk Cloak"
          className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none placeholder:text-leather-700/50 focus:border-gold-600 focus:bg-white"
        />
        <FieldError id="title-error" message={fieldErrors?.title} />
      </FormField>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FormField label="Category" htmlFor="category">
          <select
            id="category"
            name="category"
            defaultValue={values?.category || "Other"}
            data-field-name="category"
            aria-invalid={Boolean(fieldErrors?.category)}
            aria-describedby={fieldErrors?.category ? "category-error" : undefined}
            className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none focus:border-gold-600 focus:bg-white"
          >
            {MARKETPLACE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <FieldError id="category-error" message={fieldErrors?.category} />
        </FormField>

        <FormField label="Value (Gold)" htmlFor="price">
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            step="0.01"
            required
            defaultValue={values?.price ?? ""}
            data-field-name="price"
            inputMode="decimal"
            aria-invalid={Boolean(fieldErrors?.price)}
            aria-describedby={fieldErrors?.price ? "price-error" : undefined}
            placeholder="100"
            className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none placeholder:text-leather-700/50 focus:border-gold-600 focus:bg-white"
          />
          <FieldError id="price-error" message={fieldErrors?.price} />
        </FormField>

        <FormField label="Stock on Hand" htmlFor="stock">
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={values?.stock ?? 1}
            data-field-name="stock"
            inputMode="numeric"
            aria-invalid={Boolean(fieldErrors?.stock)}
            aria-describedby={fieldErrors?.stock ? "stock-error" : undefined}
            className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none focus:border-gold-600 focus:bg-white"
          />
          <FieldError id="stock-error" message={fieldErrors?.stock} />
        </FormField>
      </div>

      <FormField label="Relic Illustration (Image URL)" htmlFor="image_url">
        <input
          id="image_url"
          name="image_url"
          defaultValue={values?.imageUrl || ""}
          data-field-name="image_url"
          aria-invalid={Boolean(fieldErrors?.image_url)}
          aria-describedby={fieldErrors?.image_url ? "image-url-error" : undefined}
          placeholder="https://example.com/relic.png"
          className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none placeholder:text-leather-700/50 focus:border-gold-600 focus:bg-white"
        />
        <FieldError id="image-url-error" message={fieldErrors?.image_url} />
      </FormField>

      <FormField label="Description & Lore" htmlFor="description">
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={values?.description || ""}
          data-field-name="description"
          aria-invalid={Boolean(fieldErrors?.description)}
          aria-describedby={fieldErrors?.description ? "description-error" : undefined}
          placeholder="Tell the tale of its forging..."
          className="resize-none border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none placeholder:text-leather-700/50 focus:border-gold-600 focus:bg-white"
        />
        <FieldError id="description-error" message={fieldErrors?.description} />
      </FormField>

      <PendingButton
        pending={isPending}
        idleLabel={submitLabel}
        pendingLabel="Sealing..."
        className="mt-6 w-full border-2 border-gold-600 bg-leather-800 py-4 font-serif text-xl tracking-wider text-parchment-200 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all hover:bg-leather-700 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-70"
      />
    </div>
  );
}
