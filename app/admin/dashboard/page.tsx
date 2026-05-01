import { LogoutButton } from "@/components/admin/LogoutButton";
import { formatPrice } from "@/lib/bookings/config";
import { requireAdminSession } from "@/lib/admin/auth";
import {
  getUpcomingBookings,
  type UpcomingBooking
} from "@/lib/admin/get-upcoming-bookings";

function formatBookingDate(date: string): string {
  const baseDate = new Date(`${date}T12:00:00.000Z`);

  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "short",
    timeZone: "America/Vancouver",
    weekday: "short"
  }).format(baseDate);
}

function formatBookingTime(timeSlot: string): string {
  const [hourValue = "0", minuteValue = "0"] = timeSlot.split(":");
  const baseDate = new Date();

  baseDate.setHours(Number(hourValue), Number(minuteValue), 0, 0);

  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Vancouver"
  }).format(baseDate);
}

function BookingRow({ booking }: { booking: UpcomingBooking }): JSX.Element {
  const addOnText =
    booking.addOns.length > 0 ? booking.addOns.join(", ") : "No add-ons";

  return (
    <li className="rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            {booking.clientName}
          </p>
          <p className="mt-1 text-sm text-zinc-400">{booking.clientPhone}</p>
          {booking.clientEmail ? (
            <p className="mt-1 break-all text-sm text-zinc-400">
              {booking.clientEmail}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-zinc-100">
            {formatBookingDate(booking.bookingDate)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-zinc-100">
            {formatBookingTime(booking.timeSlot)}
          </span>
          {booking.isAfterHours ? (
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-200">
              After-hours
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Service
          </p>
          <p className="mt-1 text-sm text-zinc-100">{booking.serviceType}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Add-ons
          </p>
          <p className="mt-1 text-sm text-zinc-100">{addOnText}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Total
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-100">
            {formatPrice(booking.priceCharged)}
          </p>
        </div>
      </div>

      {booking.notes ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-300">
          {booking.notes}
        </div>
      ) : null}
    </li>
  );
}

export default async function AdminDashboardPage(): Promise<JSX.Element> {
  const adminSession = await requireAdminSession();
  const bookings = await getUpcomingBookings();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-amber-300/70">
              Admin Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Upcoming bookings
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
              Signed in as {adminSession.email}. This first admin view is
              read-only and shows confirmed bookings from today forward.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Schedule
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {bookings.length} upcoming booking
                {bookings.length === 1 ? "" : "s"}
              </h2>
            </div>
            <p className="text-sm text-zinc-400">Times use Vancouver time.</p>
          </div>

          {bookings.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {bookings.map((booking) => (
                <BookingRow booking={booking} key={booking.id} />
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-[1.25rem] border border-dashed border-white/10 bg-zinc-950/60 px-4 py-8 text-center">
              <p className="text-base font-medium text-zinc-100">
                No upcoming bookings yet.
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Confirmed bookings from today forward will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
