export function MatchamatchApp({ mode }: { mode: "full" | "embed" }) {
  return (
    <main
      className={
        mode === "embed"
          ? "mx-auto flex min-h-screen w-full max-w-md items-center justify-center p-6"
          : "mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-8"
      }
    >
      <section className="w-full rounded-[32px] border border-[#3A432E]/10 bg-white/70 p-8 shadow-[0_24px_80px_rgba(58,67,46,0.12)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#7A986E]">
          Matchamatch
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#2E3625]">
          Web shell ready
        </h1>
        <p className="mt-4 text-base leading-7 text-[#546149]">
          App Router scaffold in place. Sort mode and scanner UI land in next
          tasks.
        </p>
        <div className="mt-6 inline-flex rounded-full bg-[#E2ECD5] px-4 py-2 text-sm font-medium text-[#3A432E]">
          {mode === "embed" ? "Embed mode shell" : "Full mode shell"}
        </div>
      </section>
    </main>
  );
}
