import { Sparkles, ShieldCheck, Gem, Crown, ScrollText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import StatPill from "@/components/StatPill";
import ThemedLinkButton from "@/components/ThemedLinkButton";
import { getHomePageData } from "@/features/home/server/home";

export const revalidate = 60;

export const metadata = {
  title: "Welcome to the Crafters' Realm",
  description:
    "The central gathering for master crafters, artisans, and their patrons in the Artisans' Guild.",
};

export default async function Home() {
  const { user, profile, latestProducts, latestPosts, guildCount } =
    await getHomePageData();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      <section className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
        <div>
          <PageHeader
            eyebrow="Realm Overview"
            title="Welcome to the Guild"
            description="The central gathering for master crafters, artisans, and their patrons. Discover enchanted artifacts, sworn guilds, and fresh dispatches from every corner of the realm."
          />
          <div className="flex flex-wrap gap-4">
            {user ? (
              profile?.role === "artisan" ? (
                <>
                  <ThemedLinkButton
                    href="/marketplace/my-listings"
                    icon={<ScrollText className="h-4 w-4" />}
                  >
                    Manage Listings
                  </ThemedLinkButton>
                  <ThemedLinkButton
                    href="/marketplace/new"
                    variant="secondary"
                    icon={<Gem className="h-4 w-4" />}
                  >
                    Forge New Work
                  </ThemedLinkButton>
                </>
              ) : (
                <>
                  <ThemedLinkButton
                    href="/tavern"
                    icon={<Sparkles className="h-4 w-4" />}
                  >
                    Visit The Tavern
                  </ThemedLinkButton>
                  <ThemedLinkButton
                    href="/guilds"
                    variant="secondary"
                    icon={<Crown className="h-4 w-4" />}
                  >
                    Explore Guilds
                  </ThemedLinkButton>
                </>
              )
            ) : (
              <>
                <ThemedLinkButton
                  href="/login"
                  icon={<ShieldCheck className="h-4 w-4" />}
                >
                  Enter the Guild
                </ThemedLinkButton>
                <ThemedLinkButton
                  href="/marketplace"
                  variant="secondary"
                  icon={<Gem className="h-4 w-4" />}
                >
                  Browse Bazaar
                </ThemedLinkButton>
                <ThemedLinkButton
                  href="/guilds"
                  variant="secondary"
                  icon={<Crown className="h-4 w-4" />}
                >
                  Explore Guilds
                </ThemedLinkButton>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <StatPill label="Guild Banners" value={guildCount} />
          <StatPill label="Fresh Wares" value={latestProducts.length} />
          <StatPill label="Recent Notices" value={latestPosts.length} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ParchmentCard className="p-8">
          <div className="border-leather-800 mb-6 flex items-center gap-3 border-b-2 border-dashed pb-4">
            <Gem className="text-gold-600 h-6 w-6" />
            <h2 className="text-ink-900 font-serif text-3xl">
              Fresh From the Bazaar
            </h2>
          </div>
          <div className="space-y-5">
            {latestProducts.length === 0 ? (
              <p className="text-leather-800 text-sm italic">
                No relics have yet been entered into the marketplace.
              </p>
            ) : (
              latestProducts.map((product) => (
                <div
                  key={product.id}
                  className="border-leather-800/50 border-b border-dashed pb-4 last:border-b-0 last:pb-0"
                >
                  <p className="text-leather-700 text-xs tracking-[0.25em] uppercase">
                    {product.category}
                  </p>
                  <h3 className="text-ink-900 mt-2 font-serif text-2xl">
                    {product.title}
                  </h3>
                  <p className="text-leather-800 mt-1 text-sm">
                    {product.price} Gold
                  </p>
                </div>
              ))
            )}
          </div>
        </ParchmentCard>

        <ParchmentCard className="p-8">
          <div className="border-leather-800 mb-6 flex items-center gap-3 border-b-2 border-dashed pb-4">
            <Sparkles className="text-gold-600 h-6 w-6" />
            <h2 className="text-ink-900 font-serif text-3xl">
              The Realm Speaks
            </h2>
          </div>
          <div className="space-y-5">
            {latestPosts.length === 0 ? (
              <p className="text-leather-800 text-sm italic">
                No notices have yet been posted upon the board.
              </p>
            ) : (
              latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="border-leather-800/50 border-b border-dashed pb-4 last:border-b-0 last:pb-0"
                >
                  {post.tier_required !== "Public" ? (
                    <p className="text-gold-700 mb-2 text-xs tracking-[0.25em] uppercase">
                      {post.tier_required} Tier
                    </p>
                  ) : null}
                  <p className="text-leather-900 text-sm leading-relaxed">
                    {post.content.length > 120
                      ? `${post.content.slice(0, 120)}...`
                      : post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </ParchmentCard>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
        <Feature
          title="Master Crafts"
          description="Browse real marketplace listings, then sort the bazaar by category, value, and freshness."
          icon={<Gem className="text-gold-500 h-8 w-8" />}
        />
        <Feature
          title="Guild Allegiance"
          description="Inspect the great houses, weigh their banners, and choose your colors through heraldry."
          icon={<Crown className="text-gold-500 h-8 w-8" />}
        />
        <Feature
          title="Tavern Dispatches"
          description="Read persistent notices, pin your own dispatches, and trade quick words in the Local Hearth."
          icon={<Sparkles className="text-gold-500 h-8 w-8" />}
        />
      </div>
    </div>
  );
}

function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-iron-800/50 border-gold-600 rounded-r-md border-l-4 p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-gold-400 mb-2 font-serif text-2xl">{title}</h3>
      <p className="text-parchment-400">{description}</p>
    </div>
  );
}
