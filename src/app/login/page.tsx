import { Crown, ScrollText, Shield, Sparkles } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import ParchmentCard from '@/components/ParchmentCard'
import LoginFormClient from '@/components/LoginFormClient'
import { authAction } from './actions'

export default function LoginPage() {
  return (
    <div className="page-shell">
      <div className="page-stack">
        <div className="grid min-h-[80vh] grid-cols-1 gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="section-panel px-6 py-8 md:px-8">
            <PageHeader
              eyebrow="Entrance"
              title="Declare Your Identity"
              description="Sign the register to enter the Guild, browse the bazaar, swear to a guild banner, and take part in tavern dispatches."
              compact
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="surface-dark rounded-[1.2rem] p-5">
                <Crown className="mb-3 h-6 w-6 text-gold-500" />
                <h2 className="font-serif text-xl text-parchment-200">Choose a Banner</h2>
                <p className="mt-2 text-sm text-parchment-300">Browse the Great Houses and set your allegiance in Heraldry.</p>
              </div>
              <div className="surface-dark rounded-[1.2rem] p-5">
                <ScrollText className="mb-3 h-6 w-6 text-gold-500" />
                <h2 className="font-serif text-xl text-parchment-200">Trade Your Craft</h2>
                <p className="mt-2 text-sm text-parchment-300">Approved artisans may publish wares directly into the bazaar once admitted.</p>
              </div>
              <div className="surface-dark rounded-[1.2rem] p-5">
                <Sparkles className="mb-3 h-6 w-6 text-gold-500" />
                <h2 className="font-serif text-xl text-parchment-200">Hear the Realm</h2>
                <p className="mt-2 text-sm text-parchment-300">Read notices, share updates, and speak briefly by the local hearth.</p>
              </div>
            </div>
          </div>

          <ParchmentCard variant="elevated" className="relative w-full max-w-xl p-8 sm:p-10 lg:justify-self-end">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-iron-900 -mt-[4px] -ml-[4px]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-iron-900 -mt-[4px] -mr-[4px]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-iron-900 -mb-[4px] -ml-[4px]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-iron-900 -mb-[4px] -mr-[4px]" />

            <div className="mb-8 flex flex-col items-center text-center">
              <Shield className="mb-4 h-12 w-12 text-leather-800" />
              <h1 className="text-3xl font-serif font-bold tracking-[0.14em] text-ink-900">Enter the Register</h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-leather-700">Sign in to continue your journey, or register new heraldry to browse, pledge, and participate across the guild halls.</p>
            </div>

            <LoginFormClient action={authAction} />
          </ParchmentCard>
        </div>
      </div>
    </div>
  )
}
