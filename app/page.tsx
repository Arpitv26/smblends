import { Button } from "@/components/ui/button";

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
        <Button className="mt-6 w-full" size="lg" type="button">
          Start booking flow next
        </Button>
      </section>
    </main>
  );
}
