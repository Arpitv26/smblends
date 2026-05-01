import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { BlockedDateForm } from "@/components/admin/BlockedDateForm";
import { DeleteBlockedDateButton } from "@/components/admin/DeleteBlockedDateButton";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdminSession } from "@/lib/admin/auth";
import {
  getBlockedDates,
  type BlockedDate
} from "@/lib/admin/get-blocked-dates";

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

function formatBlockedDate(date: string): string {
  const baseDate = new Date(`${date}T12:00:00.000Z`);

  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "long",
    timeZone: "America/Vancouver",
    weekday: "long",
    year: "numeric"
  }).format(baseDate);
}

function BlockedDateRow({
  blockedDate
}: {
  blockedDate: BlockedDate;
}): JSX.Element {
  const dateLabel = formatBlockedDate(blockedDate.date);

  return (
    <li className="rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">{dateLabel}</p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            {blockedDate.reason ?? "No reason added."}
          </p>
          {blockedDate.confirmedBookingCount > 0 ? (
            <p className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
              {blockedDate.confirmedBookingCount} confirmed booking
              {blockedDate.confirmedBookingCount === 1 ? "" : "s"} already on
              this date.
            </p>
          ) : null}
        </div>

        <DeleteBlockedDateButton
          blockedDateId={blockedDate.id}
          dateLabel={dateLabel}
        />
      </div>
    </li>
  );
}

export default async function AdminBlockedDatesPage(): Promise<JSX.Element> {
  const adminSession = await requireAdminSession();
  const blockedDates = await getBlockedDates();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-amber-300/70">
              Admin Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Blocked dates
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
              Signed in as {adminSession.email}. Block vacation days, exam
              days, or any date Sanchit cannot take bookings.
            </p>
          </div>

          <LogoutButton />
        </div>

        <AdminNavigation activePage="blocked-dates" />

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Full-day blocks
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Add a blocked date
              </h2>
            </div>
            <p className="text-sm text-zinc-400">
              A blocked date has no public slots.
            </p>
          </div>

          <div className="mt-5">
            <BlockedDateForm initialDate={getTodayInVancouver()} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Current blocks
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {blockedDates.length} blocked date
                {blockedDates.length === 1 ? "" : "s"}
              </h2>
            </div>
            <p className="text-sm text-zinc-400">Times use Vancouver time.</p>
          </div>

          {blockedDates.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {blockedDates.map((blockedDate) => (
                <BlockedDateRow
                  blockedDate={blockedDate}
                  key={blockedDate.id}
                />
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-[1.25rem] border border-dashed border-white/10 bg-zinc-950/60 px-4 py-8 text-center">
              <p className="text-base font-medium text-zinc-100">
                No blocked dates yet.
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Add a date above when Sanchit is unavailable for the full day.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
