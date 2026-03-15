import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Gem } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-20 px-4 text-center">
      <div className="max-w-4xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-serif text-gold-accent tracking-wider mb-6">
          Welcome to the Guild
        </h1>
        <p className="text-xl md:text-2xl text-parchment-300 font-serif leading-relaxed">
          The central gathering for master crafters, artisans, and their patrons.
          Discover enchanted artifacts, bespoke armor, and hand-woven fineries.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          <Link href="/marketplace" className="w-full sm:w-auto px-8 py-4 bg-leather-800 border-2 border-gold-500 text-gold-400 font-serif text-xl tracking-wider rounded-sm hover:bg-leather-700 hover:text-gold-300 transition-all flex items-center justify-center gap-3 animate-pulse-slow">
            <Gem className="w-6 h-6" />
            Enter Marketplace
          </Link>
          <Link href="/tavern" className="w-full sm:w-auto px-8 py-4 bg-iron-800 border-2 border-iron-700 text-parchment-200 font-serif text-xl tracking-wider rounded-sm hover:bg-iron-700 transition-all flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6" />
            Visit The Tavern
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <Feature 
            title="Master Crafts"
            description="Buy and sell physical or digital goods in a deeply thematic storefront."
            icon={<Gem className="text-gold-500 w-8 h-8" />}
          />
          <Feature 
            title="Patronage"
            description="Support creators with monthly tithes and unlock exclusive works."
            icon={<ShieldCheck className="text-gold-500 w-8 h-8" />}
          />
          <Feature 
            title="Tavern Chat"
            description="Network in real-time. Share techniques or seek brave adventurers."
            icon={<Sparkles className="text-gold-500 w-8 h-8" />}
          />
        </div>
      </div>
    </div>
  );
}

function Feature({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="bg-iron-800/50 p-6 border-l-4 border-gold-600 rounded-r-md">
      <div className="mb-4">{icon}</div>
      <h3 className="font-serif text-2xl text-gold-400 mb-2">{title}</h3>
      <p className="text-parchment-400">{description}</p>
    </div>
  );
}