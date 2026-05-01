import Link from "next/link";

type AdminNavigationProps = {
  activePage: "no-shows" | "upcoming";
};

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Upcoming",
    value: "upcoming"
  },
  {
    href: "/admin/no-shows",
    label: "No-shows",
    value: "no-shows"
  }
] as const;

export function AdminNavigation({
  activePage
}: AdminNavigationProps): JSX.Element {
  return (
    <nav
      aria-label="Admin sections"
      className="flex flex-wrap gap-2 rounded-[1.25rem] border border-white/10 bg-black/30 p-2"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.value === activePage;

        return (
          <Link
            className={`inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium transition ${
              isActive
                ? "bg-white text-zinc-950"
                : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
            }`}
            href={item.href}
            key={item.value}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
