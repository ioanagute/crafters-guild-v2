export default async function ErrorPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;
  const message = params.message || "An error occurred while attempting to verify your identity. The guards do not recognize your credentials.";
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-serif text-blood-600 tracking-wider mb-4 font-bold">
        The Gates are Barred
      </h1>
      <p className="text-xl text-parchment-300 font-serif max-w-lg mb-8">
        {message}
      </p>
      <a 
        href="/login" 
        className="px-6 py-3 bg-leather-800 hover:bg-leather-700 text-parchment-200 border-2 border-leather-700 font-serif transition-colors"
      >
        Return to the Register
      </a>
    </div>
  )
}