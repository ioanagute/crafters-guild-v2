type ProductFormValues = {
  title?: string | null;
  category?: string | null;
  price?: number | string | null;
  description?: string | null;
  image_url?: string | null;
  stock?: number | null;
};

const categories = [
  "Apparel",
  "Weaponry",
  "Armor",
  "Consumable",
  "Magic",
  "Tool",
  "Other",
];

export default function ProductForm({
  submitLabel,
  values,
}: {
  submitLabel: string;
  values?: ProductFormValues;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="font-serif text-xs font-bold uppercase tracking-widest text-ink-900">
          Title of the Relic
        </label>
        <input
          name="title"
          required
          defaultValue={values?.title || ""}
          placeholder="e.g., Elven Silk Cloak"
          className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none placeholder:text-leather-700/50 focus:border-gold-600 focus:bg-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="font-serif text-xs font-bold uppercase tracking-widest text-ink-900">
            Category
          </label>
          <select
            name="category"
            defaultValue={values?.category || "Other"}
            className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none focus:border-gold-600 focus:bg-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-serif text-xs font-bold uppercase tracking-widest text-ink-900">
            Value (Gold)
          </label>
          <input
            name="price"
            type="number"
            min="1"
            step="0.01"
            required
            defaultValue={values?.price ?? ""}
            placeholder="100"
            className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none placeholder:text-leather-700/50 focus:border-gold-600 focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-serif text-xs font-bold uppercase tracking-widest text-ink-900">
            Stock on Hand
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={values?.stock ?? 1}
            className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none focus:border-gold-600 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-serif text-xs font-bold uppercase tracking-widest text-ink-900">
          Relic Illustration (Image URL)
        </label>
        <input
          name="image_url"
          defaultValue={values?.image_url || ""}
          placeholder="https://example.com/relic.png"
          className="border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none placeholder:text-leather-700/50 focus:border-gold-600 focus:bg-white"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-serif text-xs font-bold uppercase tracking-widest text-ink-900">
          Description & Lore
        </label>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={values?.description || ""}
          placeholder="Tell the tale of its forging..."
          className="resize-none border-2 border-leather-800 bg-parchment-100 px-4 py-3 font-serif text-ink-900 outline-none placeholder:text-leather-700/50 focus:border-gold-600 focus:bg-white"
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full border-2 border-gold-600 bg-leather-800 py-4 font-serif text-xl tracking-wider text-parchment-200 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all hover:bg-leather-700 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
      >
        {submitLabel}
      </button>
    </div>
  );
}
