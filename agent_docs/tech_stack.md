# Tech Stack & Tools

## Project Summary
This project is a **mobile-first web app** for Smblends. It is being built for a fast 14-day MVP with near-zero monthly cost, commercial-safe hosting, and a workflow where Codex does most of the coding while the user follows simple setup steps.

## Core Stack
- **Frontend framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI components:** shadcn/ui
- **Backend/data/auth:** Supabase
- **Database:** PostgreSQL via Supabase
- **Validation:** Zod
- **Email notifications:** Resend
- **Deployment:** Cloudflare Workers with OpenNext
- **Repository host:** GitHub
- **Timezone:** `America/Vancouver`

## Why This Stack
- Fast enough for a 10–14 day MVP
- Cheap enough to stay near free
- Familiar to AI tools
- Easier than building a custom backend
- Supports both the client booking flow and the barber admin panel
- Good fit for a beginner-plus builder who wants AI assistance

## Cost Targets
- **Hosting/infrastructure:** $0/month target
- **Third-party services:** $0–5 CAD/month target for MVP
- **Total ongoing target:** near zero, excluding domain
- **Domain:** separate yearly cost, optional at first

## Deployment Notes
- Use **Cloudflare Workers with OpenNext** because the site has full-stack Next.js route handlers.
- Use the free `*.workers.dev` URL first if the client is not ready to buy a domain.
- Add a custom domain later when ready.

## Folder Layout
```text
smblends/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── book/
│   │   │   ├── page.tsx
│   │   │   └── confirmed/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── availability/page.tsx
│   │   └── blocked-dates/page.tsx
│   └── api/
│       ├── bookings/route.ts
│       ├── availability/route.ts
│       └── blocked-dates/route.ts
├── components/
│   ├── ui/
│   ├── booking/
│   ├── admin/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── validators/
│   ├── slots/
│   ├── notifications/
│   └── utils/
├── types/
├── public/
├── styles/
├── .env.local
├── README.md
└── package.json
```

## Recommended Packages
Install only when needed.

### Core packages
```bash
npm install @supabase/supabase-js zod resend date-fns date-fns-tz
```

### UI and utility packages
```bash
npx shadcn@latest init
```

### Optional but likely useful later
```bash
npm install @hookform/resolvers react-hook-form
```

## Initial Project Bootstrap
### Step 1 — create the app
```bash
npx create-next-app@latest smblends --typescript --tailwind --app
```

### Step 2 — enter the project
```bash
cd smblends
```

### Step 3 — initialize shadcn/ui
```bash
npx shadcn@latest init
```

### Step 4 — install core backend packages
```bash
npm install @supabase/supabase-js zod resend date-fns date-fns-tz
```

## Environment Variables
Keep secrets out of the client when possible.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
BARBER_NOTIFICATION_EMAIL=
```

If Supabase shows the older key name instead, `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also acceptable as a fallback.

Known production values from `agent_docs/clientInformation.md`:
- `BARBER_NOTIFICATION_EMAIL=sanchitmehta51@gmail.com`
- E-transfer display email: `sanchitmehta51@gmail.com`

## Manual Setup Rule for This Project
Whenever setup leaves the terminal and goes into a dashboard or website:
- tell the user exactly where to click
- use plain language
- keep steps short
- say what value to copy
- say where to paste it
- say what success looks like
- do not move on until the user confirms

## Database Schema Summary
### `availability`
- `id`
- `day_of_week`
- `start_time`
- `end_time`
- `slot_minutes`
- `is_active`
- `created_at`
- Real Smblends rows should use 60-minute slots.
- After-hours rows should run from `21:00:00` to `00:00:00`.

### `blocked_dates`
- `id`
- `date`
- `reason`
- `created_at`

### `bookings`
- `id`
- `booking_date`
- `time_slot`
- `client_name`
- `client_phone`
- `client_email` (should be nullable/optional for the public MVP)
- `service_type`
- `add_ons` or equivalent structured add-on storage
- `is_after_hours`
- `price_charged`
- `status`
- `notes`
- `created_at`
- partial unique index on `(booking_date, time_slot)` where `status = 'confirmed'`

Current schema note: migration `20260430090000_real_smblends_booking_rules.sql` makes `client_email` optional, adds `add_ons`, applies the real SMBLENDS service menu, and replaces placeholder availability with 60-minute rows. Migration `20260501170000_confirmed_booking_unique_slots.sql` changes double-booking protection to only block active `confirmed` bookings so cancelled/no-show history does not keep a slot closed.

## Suggested Supabase Modules
- `lib/supabase/client.ts` — browser-safe client
- `lib/supabase/server.ts` — server-side client
- `lib/validators/booking.ts` — booking schema
- `lib/slots/get-available-slots.ts` — slot logic
- `lib/notifications/send-booking-emails.ts` — Resend logic

## Example: Slot utility shape
```ts
export type AvailableSlot = {
  value: string;           // e.g. "20:00:00"
  label: string;           // e.g. "9:00 PM"
  isAfterHours: boolean;   // true if 9 PM or later
};

export async function getAvailableSlots(date: string): Promise<AvailableSlot[]> {
  // 1. Read weekly availability for this weekday
  // 2. Stop if the date is blocked
  // 3. Read confirmed bookings for that date
  // 4. Generate 60-minute slots
  // 5. Remove already-booked slots
  // 6. Mark 9 PM+ as after-hours
  return [];
}
```

## Example: Route handler shape
```ts
import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validators/booking";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bookingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking details." },
      { status: 400 }
    );
  }

  // Do database insert here.
  // Catch duplicate slot errors and return a friendly message.

  return NextResponse.json({ ok: true });
}
```

## Deployment Outline
### Cloudflare Workers
This app uses full-stack Next.js route handlers, so deploy it to Cloudflare Workers with OpenNext instead of a static Pages-only build.

1. Push code to GitHub.
2. Create or log into a Cloudflare account.
3. Add production environment variables with Wrangler secrets or the Cloudflare dashboard.
4. Run `npm run deploy` to build with OpenNext and deploy to Workers, or run `npx opennextjs-cloudflare build` then `npx wrangler deploy` if the OpenNext deploy wrapper cannot open its local callback listener.
5. Use the free `*.workers.dev` URL first: `https://booking.smblends.workers.dev`.
6. Add the custom domain later if needed.

Cloudflare deployment packages:
- `@opennextjs/cloudflare@1.15.0`
- `wrangler@4.59.2`

The adapter is pinned because the latest `@opennextjs/cloudflare` release requires a newer Next.js than this project currently uses.

Required production env vars:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
BARBER_NOTIFICATION_EMAIL=sanchitmehta51@gmail.com
```

Useful deployment commands:
```bash
npm run preview
npm run deploy
npm run upload
```

## Tooling Behavior for Codex
- Read `AGENTS.md` first.
- Use this file for commands and package decisions.
- Do not invent extra architecture when the current stack already supports the feature.
