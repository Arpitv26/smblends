import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { DeleteSpecialAvailabilityButton } from "@/components/admin/DeleteSpecialAvailabilityButton";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { SpecialAvailabilityForm } from "@/components/admin/SpecialAvailabilityForm";
import { SpecialAvailabilityToggle } from "@/components/admin/SpecialAvailabilityToggle";
import { requireAdminSession } from "@/lib/admin/auth";
import {
  getSpecialAvailability,
  type SpecialAvailabilityWindow
} from "@/lib/admin/get-special-availability";

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

function formatSpecialDate(date: string): string {
  const baseDate = new Date(`${date}T12:00:00.000Z`);

  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "long",
    timeZone: "America/Vancouver",
    weekday: "long",
    year: "numeric"
  }).format(baseDate);
}

function formatTime(time: string): string {
  const [hourValue = "0", minuteValue = "0"] = time.split(":");
  const hours = Number(hourValue);
  const minutes = Number(minuteValue);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return time;
  }

  const meridiem = hours >= 12 ? "p.m." : "a.m.";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

function groupSpecialAvailabilityByDate(
  windows: SpecialAvailabilityWindow[]
): Array<{
  date: string;
  windows: SpecialAvailabilityWindow[];
}> {
  const dateMap = new Map<string, SpecialAvailabilityWindow[]>();

  for (const window of windows) {
    const existingWindows = dateMap.get(window.date) ?? [];

    dateMap.set(window.date, [...existingWindows, window]);
  }

  return Array.from(dateMap, ([date, groupedWindows]) => ({
    date,
    windows: groupedWindows
  }));
}

function SpecialAvailabilityRow({
  window
}: {
  window: SpecialAvailabilityWindow;
}): JSX.Element {
  const timeLabel = `${formatTime(window.startTime)}-${formatTime(window.endTime)}`;

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base font-medium text-zinc-100">{timeLabel}</p>
          <span
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${
              window.isActive
                ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
                : "border-white/10 bg-white/[0.04] text-zinc-300"
            }`}
          >
            {window.isActive ? "Active" : "Off"}
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          {window.slotMinutes}-minute appointment slots
          {window.label ? ` - ${window.label}` : ""}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <SpecialAvailabilityToggle
          initialIsActive={window.isActive}
          specialAvailabilityId={window.id}
        />
        <DeleteSpecialAvailabilityButton
          specialAvailabilityId={window.id}
          timeLabel={timeLabel}
        />
      </div>
    </li>
  );
}

export default async function AdminSpecialDatesPage(): Promise<JSX.Element> {
  const adminSession = await requireAdminSession();
  const specialAvailability = await getSpecialAvailability();
  const groupedAvailability =
    groupSpecialAvailabilityByDate(specialAvailability);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Admin Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Special dates
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
              Signed in as {adminSession.email}. Add one-off hours for school
              breaks, long weekends, or days with a different schedule.
            </p>
          </div>

          <LogoutButton />
        </div>

        <AdminNavigation activePage="special-dates" />

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                One-off schedule
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Add special hours
              </h2>
            </div>
            <p className="text-sm text-zinc-400">Times use Vancouver time.</p>
          </div>

          <p className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-300">
            If a date has special hours, public booking uses these windows
            instead of the normal weekly schedule. To close a whole day, use
            Blocked dates.
          </p>

          <div className="mt-5">
            <SpecialAvailabilityForm initialDate={getTodayInVancouver()} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Overrides
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {specialAvailability.length} special time window
                {specialAvailability.length === 1 ? "" : "s"}
              </h2>
            </div>
            <p className="text-sm text-zinc-400">
              Add multiple windows to split a day.
            </p>
          </div>

          {groupedAvailability.length > 0 ? (
            <div className="mt-5 space-y-4">
              {groupedAvailability.map(({ date, windows }) => (
                <section
                  className="rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4"
                  key={date}
                >
                  <h3 className="text-lg font-semibold text-white">
                    {formatSpecialDate(date)}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {windows.map((window) => (
                      <SpecialAvailabilityRow
                        key={window.id}
                        window={window}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.25rem] border border-dashed border-white/10 bg-zinc-950/60 px-4 py-8 text-center">
              <p className="text-base font-medium text-zinc-100">
                No special dates yet.
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Normal weekly availability is used until a special date is
                added here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
