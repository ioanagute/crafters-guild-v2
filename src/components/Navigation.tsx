import Link from 'next/link';
import { Shield, Swords, Scroll, Users, UserCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function Navigation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="bg-iron-900 border-b-4 border-iron-800 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between font-serif">
        <Link href="/" className="flex items-center gap-3 group">
          <Shield className="w-8 h-8 text-gold-500 group-hover:animate-flicker" />
          <span className="text-2xl tracking-wider text-gold-accent font-bold">The Artisans' Guild</span>
        </Link>
        <div className="hidden md:flex gap-8 text-parchment-200 uppercase tracking-widest text-sm">
          <NavLink href="/marketplace" icon={<Scroll className="w-4 h-4" />} label="Marketplace" />
          <NavLink href="/tavern" icon={<Swords className="w-4 h-4" />} label="The Tavern" />
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link href="/profile" className="px-6 py-2 bg-leather-800 hover:bg-leather-700 text-parchment-200 border-2 border-gold-600 rounded-sm font-medieval transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center gap-2">
              <UserCircle className="w-4 h-4" /> My Heraldry
            </Link>
          ) : (
            <Link href="/login" className="px-6 py-2 bg-leather-800 hover:bg-leather-700 text-parchment-200 border-2 border-gold-600 rounded-sm font-medieval transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              Enter
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 hover:text-gold-400 transition-colors">
      {icon}
      <span>{label}</span>
    </Link>
  );
}