import Link from "next/link";
import { AlertTriangle, Shield, Undo2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import StatePanel from "@/components/StatePanel";
import ThemedLinkButton from "@/components/ThemedLinkButton";

export default async function ErrorPage({ searchParams }: { searchParams: Promise<{ message?: string; returnTo?: string }> }) {
  const params = await searchParams;
  const message = params.message || "An error occurred while attempting to verify your identity. The guards do not recognize your credentials.";
  const returnTo = params.returnTo || "/";
  
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col justify-center px-4 py-12">
      <PageHeader
        eyebrow="The Pit"
        title="The Gates are Barred"
        description="A branded fallback hall for broken paths, failed credentials, and any other trouble that interrupts a journey through the realm."
      />
      <ParchmentCard className="p-8 text-center sm:p-12">
        <StatePanel
          tone="error"
          title="The guards refuse passage"
          description={message}
          icon={<AlertTriangle className="h-12 w-12 text-blood-600" />}
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ThemedLinkButton href="/login" icon={<Shield className="h-4 w-4" />}>
            Return to the Register
          </ThemedLinkButton>
          <ThemedLinkButton href={returnTo} variant="secondary" icon={<Undo2 className="h-4 w-4" />}>
            Resume Journey
          </ThemedLinkButton>
          <Link href="/" className="inline-flex items-center gap-2 border-2 border-iron-700 bg-iron-800 px-5 py-3 font-serif tracking-wider text-parchment-200 transition hover:border-gold-600 hover:bg-iron-700">
            Back Home
          </Link>
        </div>
      </ParchmentCard>
    </div>
  )
}
