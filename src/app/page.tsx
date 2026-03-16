import { Sparkles, ShieldCheck, Gem, Crown, ScrollText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import StatPill from "@/components/StatPill";
import ThemedLinkButton from "@/components/ThemedLinkButton";
import { getHomePageData } from "@/features/home/server/home";

export default async function Home() {
  const { user, profile, latestProducts, latestPosts, guildCount } = await getHomePageData();

  return (
    <div className="page-shell">
      <div className="page-stack">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_21rem] lg:items-start">
          <div className="section-panel overflow-hidden px-6 py-8 md:px-8 md:py-10">
            <PageHeader
              eyebrow="Realm Overview"
              title="Welcome to the Guild"
              description="The central gathering for master crafters, artisans, and their patrons. Discover enchanted artifacts, sworn guilds, and fresh dispatches from every corner of the realm."
              compact
            />
            <div className="flex flex-wrap gap-3">
              {user ? (
                profile?.role === "artisan" ? (
                  <>
                    <ThemedLinkButton href="/marketplace/my-listings" size="lg" icon={<ScrollText className="h-4 w-4" />}>Manage Listings</ThemedLinkButton>
                    <ThemedLinkButton href="/marketplace/new" size="lg" variant="secondary" icon={<Gem className="h-4 w-4" />}>Forge New Work</ThemedLinkButton>
                  </>
                ) : (
                  <>
                    <ThemedLinkButton href="/tavern" size="lg" icon={<Sparkles className="h-4 w-4" />}>Visit The Tavern</ThemedLinkButton>
                    <ThemedLinkButton href="/guilds" size="lg" variant="secondary" icon={<Crown className="h-4 w-4" />}>Explore Guilds</ThemedLinkButton>
                  </>
                )
              ) : (
                <>
                  <ThemedLinkButton href="/login" size="lg" icon={<ShieldCheck className="h-4 w-4" />}>Enter the Guild</ThemedLinkButton>
                  <ThemedLinkButton href="/marketplace" size="lg" variant="secondary" icon={<Gem className="h-4 w-4" />}>Browse Bazaar</ThemedLinkButton>
                  <ThemedLinkButton href="/guilds" size="lg" variant="secondary" icon={<Crown className="h-4 w-4" />}>Explore Guilds</ThemedLinkButton>
                </>
              )}
            </div>
            <div className="panel-divider mt-8 pt-6">
              <p className="eyebrow mb-3">Guild Standard</p>
              <p className="max-w-2xl text-sm leading-relaxed text-parchment-300">
                Browse real listings, inspect guild allegiances, and move between persistent notices and live tavern exchange without losing the realm&apos;s atmosphere.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatPill label="Guild Banners" value={guildCount} />
            <StatPill label="Fresh Wares" value={latestProducts.length} />
            <StatPill label="Recent Notices" value={latestPosts.length} />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ParchmentCard variant="elevated" className="p-8">
            <div className="mb-6 flex items-center gap-3 border-b-2 border-dashed border-leather-800/50 pb-4">
              <Gem className="h-6 w-6 text-gold-600" />
              <h2 className="font-serif text-3xl text-ink-900">Fresh From the Bazaar</h2>
            </div>
            <div className="space-y-5">
              {latestProducts.length === 0 ? (
                <p className="text-sm italic text-leather-800">No relics have yet been entered into the marketplace.</p>
              ) : latestProducts.map((product) => (
                <div key={product.id} className="rounded-[1rem] border border-leather-800/15 bg-parchment-100/50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-leather-700">{product.category}</p>
                      <h3 className="mt-2 font-serif text-2xl text-ink-900">{product.title}</h3>
                    </div>
                    <p className="rounded-full border border-gold-600/40 bg-gold-500/10 px-3 py-1 text-sm text-leather-900">{product.price} Gold</p>
                  </div>
                </div>
              ))}
            </div>
          </ParchmentCard>

          <ParchmentCard variant="elevated" className="p-8">
            <div className="mb-6 flex items-center gap-3 border-b-2 border-dashed border-leather-800/50 pb-4">
              <Sparkles className="h-6 w-6 text-gold-600" />
              <h2 className="font-serif text-3xl text-ink-900">The Realm Speaks</h2>
            </div>
            <div className="space-y-5">
              {latestPosts.length === 0 ? (
                <p className="text-sm italic text-leather-800">No notices have yet been posted upon the board.</p>
              ) : latestPosts.map((post) => (
                <div key={post.id} className="rounded-[1rem] border border-leather-800/15 bg-parchment-100/50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                  {post.tier_required !== "Public" ? (
                    <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold-700">{post.tier_required} Tier</p>
                  ) : null}
                  <p className="text-sm leading-relaxed text-leather-900">
                    {post.content.length > 120 ? `${post.content.slice(0, 120)}...` : post.content}
                  </p>
                </div>
              ))}
            </div>
          </ParchmentCard>
        </div>

        <section className="section-panel px-6 py-8 md:px-8">
          <div className="mb-6">
            <p className="eyebrow mb-3">Guild Advantages</p>
            <h2 className="font-serif text-3xl text-gold-accent">A polished hall for trade, allegiance, and dispatches</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 text-left">
            <Feature
              title="Master Crafts"
              description="Browse real marketplace listings, then sort the bazaar by category, value, and freshness."
              icon={<Gem className="text-gold-500 w-8 h-8" />}
            />
            <Feature
              title="Guild Allegiance"
              description="Inspect the great houses, weigh their banners, and choose your colors through heraldry."
              icon={<Crown className="text-gold-500 w-8 h-8" />}
            />
            <Feature
              title="Tavern Dispatches"
              description="Read persistent notices, pin your own dispatches, and trade quick words in the Local Hearth."
              icon={<Sparkles className="text-gold-500 w-8 h-8" />}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function Feature({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="surface-dark surface-interactive rounded-[1.2rem] p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 font-serif text-2xl text-gold-400">{title}</h3>
      <p className="text-sm leading-relaxed text-parchment-300">{description}</p>
    </div>
  );
}
