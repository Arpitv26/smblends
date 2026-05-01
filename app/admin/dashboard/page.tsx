import { AdminBookingCard } from "@/components/admin/AdminBookingCard";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { CancelBookingButton } from "@/components/admin/CancelBookingButton";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { MarkNoShowButton } from "@/components/admin/MarkNoShowButton";
import { requireAdminSession } from "@/lib/admin/auth";
import { getUpcomingBookings } from "@/lib/admin/get-upcoming-bookings";

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
              Signed in as {adminSession.email}. This view shows confirmed
              bookings from today forward. Cancel future appointments or mark
              missed appointments as no-show.
            </p>
          </div>

          <LogoutButton />
        </div>

        <AdminNavigation activePage="upcoming" />

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
                <AdminBookingCard
                  action={
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <CancelBookingButton
                        bookingId={booking.id}
                        clientName={booking.clientName}
                      />
                      <MarkNoShowButton
                        bookingId={booking.id}
                        clientName={booking.clientName}
                      />
                    </div>
                  }
                  booking={booking}
                  key={booking.id}
                />
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
