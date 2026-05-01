import { AdminBookingCard } from "@/components/admin/AdminBookingCard";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdminSession } from "@/lib/admin/auth";
import { getNoShowBookings } from "@/lib/admin/get-no-show-bookings";

export default async function AdminNoShowsPage(): Promise<JSX.Element> {
  const adminSession = await requireAdminSession();
  const bookings = await getNoShowBookings();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Admin Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              No-show tracking
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
              Signed in as {adminSession.email}. These bookings were marked as
              no-show and stay here for follow-up.
            </p>
          </div>

          <LogoutButton />
        </div>

        <AdminNavigation activePage="no-shows" />

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Follow-up list
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {bookings.length} no-show booking
                {bookings.length === 1 ? "" : "s"}
              </h2>
            </div>
            <p className="text-sm text-zinc-400">
              Policy: $10 fee on the next cut.
            </p>
          </div>

          {bookings.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {bookings.map((booking) => (
                <AdminBookingCard
                  booking={booking}
                  key={booking.id}
                  statusLabel="No-show"
                />
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-[1.25rem] border border-dashed border-white/10 bg-zinc-950/60 px-4 py-8 text-center">
              <p className="text-base font-medium text-zinc-100">
                No no-shows recorded yet.
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Bookings marked no-show from the upcoming page will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
