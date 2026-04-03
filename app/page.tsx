export default function HomePage(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.35em] text-accent">
          Smblends
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Booking website bootstrap is live.
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-300">
          This is the initial Next.js foundation for the booking MVP. Public
          booking flow, admin tools, and backend integrations will be added in
          small verified steps.
        </p>
      </section>
    </main>
  );
}
