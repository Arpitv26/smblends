import { BookingAvailability } from "@/components/booking/BookingAvailability";

function getTodayInVancouver(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Vancouver",
    year: "numeric"
  }).formatToParts(new Date());

  const getPart = (type: "day" | "month" | "year"): string => {
    const value = parts.find((part) => part.type === type)?.value;

    if (!value) {
      throw new Error(`Missing ${type} while formatting Vancouver date.`);
    }

    return value;
  };

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
}

export default function BookingPage(): JSX.Element {
  const initialDate = getTodayInVancouver();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6 shadow-2xl shadow-black/25 backdrop-blur sm:p-8">
          <p className="text-xs uppercase tracking-[0.38em] text-zinc-400">
            Smblends Booking
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Choose a date, lock in a slot, and prepare the booking details.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            This slice keeps the same live availability flow, then adds the
            first booking details form without submitting anything yet.
          </p>
        </div>

        <BookingAvailability initialDate={initialDate} />
      </section>
    </main>
  );
}
