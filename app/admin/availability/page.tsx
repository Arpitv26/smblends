import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { AvailabilityToggle } from "@/components/admin/AvailabilityToggle";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdminSession } from "@/lib/admin/auth";
import {
  getWeeklyAvailability,
  type WeeklyAvailabilityWindow
} from "@/lib/admin/get-weekly-availability";

const WEEKDAY_LABELS: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};

function formatAvailabilityTime(time: string): string {
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

function getWindowLabel(window: WeeklyAvailabilityWindow): string {
  return window.isAfterHours ? "After-hours" : "Standard";
}

function groupAvailabilityByDay(
  windows: WeeklyAvailabilityWindow[]
): Array<{
  dayOfWeek: number;
  windows: WeeklyAvailabilityWindow[];
}> {
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    windows: windows.filter((window) => window.dayOfWeek === dayOfWeek)
  }));
}

export default async function AdminAvailabilityPage(): Promise<JSX.Element> {
  const adminSession = await requireAdminSession();
  const availability = await getWeeklyAvailability();
  const availabilityByDay = groupAvailabilityByDay(availability);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Admin Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Weekly availability
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
              Signed in as {adminSession.email}. Turn regular schedule blocks
              on or off. Public booking slots update from these rows.
            </p>
          </div>

          <LogoutButton />
        </div>

        <AdminNavigation activePage="availability" />

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Regular schedule
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Standard and after-hours blocks
              </h2>
            </div>
            <p className="text-sm text-zinc-400">Times use Vancouver time.</p>
          </div>

          <div className="mt-5 space-y-4">
            {availabilityByDay.map(({ dayOfWeek, windows }) => (
              <section
                className="rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4"
                key={dayOfWeek}
              >
                <h3 className="text-lg font-semibold text-white">
                  {WEEKDAY_LABELS[dayOfWeek]}
                </h3>

                {windows.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {windows.map((window) => (
                      <li
                        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
                        key={window.id}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-medium text-zinc-100">
                              {formatAvailabilityTime(window.startTime)}-
                              {formatAvailabilityTime(window.endTime)}
                            </p>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                                window.isAfterHours
                                  ? "border-white/10 bg-white/[0.04] text-zinc-300"
                                  : "border-white/10 bg-white/[0.04] text-zinc-300"
                              }`}
                            >
                              {getWindowLabel(window)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-zinc-400">
                            {window.slotMinutes}-minute appointment slots
                          </p>
                        </div>

                        <AvailabilityToggle
                          availabilityId={window.id}
                          initialIsActive={window.isActive}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-zinc-400">
                    No schedule blocks set for this day.
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
