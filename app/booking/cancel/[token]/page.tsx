import Link from "next/link";

import { CancelBookingPanel } from "@/components/booking/CancelBookingPanel";
import { getBookingCancellationPreview } from "@/lib/bookings/cancel-booking";

type CancelBookingPageProps = {
  params: {
    token: string;
  };
};

export default async function CancelBookingPage({
  params
}: CancelBookingPageProps): Promise<JSX.Element> {
  const preview = await getBookingCancellationPreview(params.token);

  return (
    <main className="min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          className="w-fit text-sm font-medium text-zinc-400 transition hover:text-white"
          href="/"
        >
          Back home
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <p className="text-xs uppercase tracking-[0.36em] text-zinc-500">
            SMBLENDS
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Cancel your appointment.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300">
            Review the details below before cancelling. This private link only
            works for this appointment.
          </p>
        </div>

        {preview.ok ? (
          <CancelBookingPanel
            booking={preview.booking}
            canCancel={preview.canCancel}
            cancelToken={params.token}
            unavailableMessage={preview.message}
          />
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-6 shadow-xl shadow-black/20">
            <h2 className="text-2xl font-semibold text-white">
              Cancellation link unavailable.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {preview.message}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              If you need help, message @smblends._ or text 778-681-7694.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
