import { login, signup } from './actions'
import { Crown, ScrollText, Shield, Sparkles } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import ParchmentCard from '@/components/ParchmentCard'

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-[80vh] w-full max-w-6xl grid-cols-1 gap-8 px-4 py-12 lg:grid-cols-[0.95fr_1.1fr] lg:items-start">
      <div className="pt-4">
        <PageHeader
          eyebrow="Entrance"
          title="Declare Your Identity"
          description="Sign the register to enter the Guild, browse the bazaar, swear to a guild banner, and take part in tavern dispatches."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="border border-iron-700 bg-iron-800/70 p-5">
            <Crown className="mb-3 h-6 w-6 text-gold-500" />
            <h2 className="font-serif text-xl text-parchment-200">Choose a Banner</h2>
            <p className="mt-2 text-sm text-parchment-300">Browse the Great Houses and set your allegiance in Heraldry.</p>
          </div>
          <div className="border border-iron-700 bg-iron-800/70 p-5">
            <ScrollText className="mb-3 h-6 w-6 text-gold-500" />
            <h2 className="font-serif text-xl text-parchment-200">Trade Your Craft</h2>
            <p className="mt-2 text-sm text-parchment-300">Artisans may publish wares directly into the bazaar once admitted.</p>
          </div>
          <div className="border border-iron-700 bg-iron-800/70 p-5">
            <Sparkles className="mb-3 h-6 w-6 text-gold-500" />
            <h2 className="font-serif text-xl text-parchment-200">Hear the Realm</h2>
            <p className="mt-2 text-sm text-parchment-300">Read notices, share updates, and speak briefly by the local hearth.</p>
          </div>
        </div>
      </div>

      <ParchmentCard className="relative max-w-md w-full p-8 sm:p-12 lg:justify-self-end">
        {/* Decorative corner accents matching theme */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-iron-900 -mt-[4px] -ml-[4px]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-iron-900 -mt-[4px] -mr-[4px]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-iron-900 -mb-[4px] -ml-[4px]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-iron-900 -mb-[4px] -mr-[4px]" />

        <div className="flex flex-col items-center mb-8">
          <Shield className="w-12 h-12 text-leather-800 mb-4" />
          <h1 className="text-3xl font-serif text-ink-900 tracking-wider font-bold">Declare Your Identity</h1>
          <p className="text-leather-700 italic mt-2 text-center text-sm">Sign the register to enter the Guild, view the market, and converse in the Tavern.</p>
        </div>

        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Scroll Reference (Email)</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 focus:bg-white placeholder:text-leather-700/50 transition-all font-serif"
              placeholder="artisan@realm.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Secret Word (Password)</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 focus:bg-white placeholder:text-leather-700/50 transition-all font-serif"
            />
          </div>

          <div className="flex flex-col gap-2 border-t-2 border-dashed border-leather-700/50 pt-5 mt-2">
            <label htmlFor="role" className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Path of Registration (New Users Only)</label>
            <select 
              id="role" 
              name="role" 
              className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 focus:bg-white font-serif"
            >
              <option value="patron">Patron (Wanderer & Supporter)</option>
              <option value="artisan">Artisan (Master Crafter & Seller)</option>
            </select>
            <p className="text-xs text-leather-700 italic">Veterans simply &apos;Enter the Guild&apos; below. This choice binds only to new heraldry and determines which paths appear in your member home.</p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button 
              formAction={login} 
              className="w-full py-3 bg-iron-900 hover:bg-iron-800 text-parchment-200 font-serif border-2 border-iron-800 hover:border-gold-500 transition-all tracking-wider shadow-lg flex items-center justify-center gap-2"
            >
              Enter the Guild
            </button>
            <button 
              formAction={signup} 
              className="w-full py-3 bg-transparent hover:bg-leather-800/10 text-ink-900 font-serif border-2 border-leather-800 transition-all tracking-wider flex items-center justify-center gap-2"
            >
              Register New Heraldry
            </button>
          </div>
        </form>
      </ParchmentCard>
    </div>
  )
}
