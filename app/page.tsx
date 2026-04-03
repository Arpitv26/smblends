import Link from "next/link";

export default function HomePage(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(200,169,107,0.18),transparent_35%),linear-gradient(180deg,#111114_0%,#09090b_100%)] px-6 py-16">
      <section className="w-full max-w-md rounded-3xl border border-border/70 bg-card/70 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">
          Smblends
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-foreground">
          Base UI setup is ready for the booking MVP.
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-300">
          The app now has the first shadcn/ui component installed and themed.
          The next step is building the actual booking page in small verified
          slices.
        </p>
        <Link
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          href="/book"
        >
          View booking availability
        </Link>
      </section>
    </main>
  );
}
