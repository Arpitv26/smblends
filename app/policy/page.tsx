import Link from "next/link";

const POLICY_SECTIONS = [
  {
    title: "Late Arrivals",
    items: [
      "20 minutes late: $5 fee.",
      "30 minutes late: appointment is marked as no-show."
    ]
  },
  {
    title: "Cancellations And No-Shows",
    items: [
      "Same-day cancellation: $10 fee on the next cut.",
      "No-show: $10 fee on the next cut.",
      "Use the private cancellation link in your confirmation text if you need to cancel.",
      "Need to reschedule? Message @smblends._ or text 778-681-7694."
    ]
  },
  {
    title: "Rescheduling",
    items: [
      "Rescheduling is allowed.",
      "Message @smblends._ or text 778-681-7694 if your appointment needs to move."
    ]
  },
  {
    title: "Guests",
    items: ["Maximum 2 extra people allowed per client."]
  },
  {
    title: "Payment",
    items: [
      "Pay cash or e-transfer.",
      "Payment is expected before or after the haircut.",
      "E-transfer: sanchitmehta51@gmail.com."
    ]
  },
  {
    title: "After-Hours",
    items: [
      "After-hours appointments are available from 9:00 PM to 12:00 AM.",
      "After-hours appointments include a +$10 surcharge."
    ]
  },
  {
    title: "Appointment Address",
    items: [
      "Text Sanchit at 778-681-7694 for the appointment address.",
      "Message before heading over so he can send the correct access details."
    ]
  }
] as const;

export default function PolicyPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#050505_0%,#0a0a0b_52%,#050505_100%)] px-4 py-8 text-white sm:px-6 sm:py-12">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="w-fit text-sm font-medium text-zinc-400 transition hover:text-white"
            href="/"
          >
            Back Home
          </Link>
          <Link
            className="inline-flex h-11 w-fit items-center justify-center rounded-full bg-white px-5 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-zinc-200"
            href="/book"
          >
            Book Now
          </Link>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <p className="text-xs uppercase tracking-[0.36em] text-zinc-500">
            SMBLENDS
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Policies
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Review the main booking rules before locking in your cut.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {POLICY_SECTIONS.map((section) => (
            <section
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6"
              key={section.title}
            >
              <h2 className="text-lg font-semibold text-white">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
                {section.items.map((item) => (
                  <li className="border-t border-white/10 pt-3" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
