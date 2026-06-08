# SMBLENDS Booking Website

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3fcf8e?style=for-the-badge&logo=supabase&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?style=for-the-badge&logo=cloudflare&logoColor=white)

SMBLENDS Booking Website is a mobile-first booking app for SMBLENDS, a barber business in Burnaby, BC. It replaces Instagram DM scheduling with a self-serve booking flow for clients and a simple admin dashboard for the barber.

Live site: [https://smblends.ca](https://smblends.ca)

## What It Does

- Lets clients choose a date, service, add-ons, and available time slot.
- Generates real availability from Supabase weekly schedule rows.
- Supports standard and after-hours appointments.
- Calculates prices on the server, including add-ons and after-hours surcharge.
- Prevents double-booking with both server-side slot checks and a database unique index.
- Saves bookings in Supabase with status history.
- Sends barber and client confirmation emails through Resend.
- Gives clients a private cancellation link in their confirmation email.
- Gives the barber an authenticated admin dashboard for upcoming bookings, no-shows, availability, and blocked dates.
- Supports one-off special-date hours that override the normal weekly schedule for a single date.
- Keeps cancelled and no-show bookings stored for history while reopening cancelled slots.

## Core Booking Rules

- Timezone: `America/Vancouver`
- Slot length: 60 minutes
- Monday-Friday: 4:00 PM-9:00 PM
- Saturday: 9:00 AM-9:00 PM
- Sunday: 3:00 PM-9:00 PM
- After-hours: 9:00 PM-12:00 AM daily
- After-hours surcharge: `$10`
- Services:
  - Haircut: `$20`
  - Haircut & Beard: `$30`
- Active add-on:
  - Beard Fade / Line-up: `$10`
- Disabled launch add-on:
  - Design: hidden in the UI and rejected by the API until the barber offers it
- Payment: in person by cash or e-transfer

## Tech Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui conventions plus local components
- **Database/Auth:** Supabase
- **Validation:** Zod
- **Email:** Resend
- **Deployment:** Cloudflare Workers with OpenNext

## App Structure

```text
app/
  api/
    availability/                 Public slot lookup
    bookings/                     Public booking creation
    bookings/cancel               Public private-link cancellation
    admin/                        Protected admin write routes
  admin/
    login/                        Barber login
    dashboard/                    Upcoming bookings
    no-shows/                     No-show history
    availability/                 Weekly availability editor
    special-dates/                One-off date-specific availability
    blocked-dates/                Full-day blocked dates manager
  book/                           Public booking flow
  book/confirmed/                 Booking confirmation page
  booking/cancel/[token]/         Private client cancellation page
  policy/                         Public policies page
components/
  admin/                          Admin dashboard components
  booking/                        Public booking components
  home/                           Landing page
  ui/                             Shared UI primitives
lib/
  admin/                          Admin data/actions
  bookings/                       Booking creation and pricing
  notifications/                  Resend email logic
  slots/                          Availability and slot generation
  supabase/                       Supabase clients and env helpers
  validators/                     Zod/date/time validation
supabase/
  migrations/                     Database schema and booking rules
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase project
- Resend account
- Cloudflare account for deployment

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
BARBER_NOTIFICATION_EMAIL=
RESEND_FROM_EMAIL=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be used instead of `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` if your Supabase project uses the older key name.
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only.
- `RESEND_FROM_EMAIL` is optional locally. Without a verified sending domain, Resend can use `SMBLENDS Bookings <onboarding@resend.dev>` for limited testing.
- Production barber notifications are intended to use `BARBER_NOTIFICATION_EMAIL=sanchitmehta51@gmail.com`.

### Database Setup

Apply the SQL migrations in `supabase/migrations` in chronological order:

```text
20260403063000_initial_schema.sql
20260430090000_real_smblends_booking_rules.sql
20260501170000_confirmed_booking_unique_slots.sql
20260513090000_special_availability.sql
20260519090000_booking_cancel_tokens.sql
```

The confirmed booking unique-slot migration creates a partial unique index for confirmed bookings only, so cancelled bookings do not keep slots blocked.
The special availability migration adds one-off date-specific schedule windows. When a date has special availability rows, those rows override the normal weekly schedule for that date.
The booking cancel token migration adds private per-booking cancellation tokens used by client cancellation links.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Scripts

```bash
npm run dev        # Start local Next.js development server
npm run lint       # Run Next.js ESLint checks
npm run build      # Build the Next.js app
npm run preview    # Build and preview with OpenNext Cloudflare
npm run deploy     # Build and deploy to Cloudflare Workers
npm run upload     # Build and upload a Cloudflare Worker version
```

`npm test` is not configured yet. Current verification is done with lint, production build, manual booking checks, and live smoke tests.

## Deployment

This project uses Cloudflare Workers with OpenNext because it depends on full-stack Next.js route handlers.

Deployment config lives in:

- `wrangler.jsonc`
- `open-next.config.ts`
- `public/_headers`

Production deploy:

```bash
npm run deploy
```

Required Cloudflare Worker secrets:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
BARBER_NOTIFICATION_EMAIL
RESEND_FROM_EMAIL
```

## Current Status

The Phase 1 public booking flow and Phase 2 admin MVP are functionally complete. The live app supports booking creation, live availability, blocked dates, special-date availability, admin login, upcoming bookings, admin cancellations, no-shows, weekly availability edits, policy display, a one-time public policy popup, client self-cancellation, barber notification emails, and required client confirmation emails. `send.smblends.ca` is verified in Resend.

Remaining launch hardening:

- Add a real automated test suite beyond lint/build/manual smoke checks.

## Project Notes

- Keep the site mobile-first.
- Keep the visual direction black, white, and neutral zinc. Do not add gold or amber brand accents.
- Do not add payments, SMS, client accounts, or multi-staff scheduling in the MVP.
- Keep booking rules out of React components; shared logic belongs in `lib/slots`, `lib/bookings`, and `lib/validators`.
- Do not commit `.env.local` or any production secrets.

## Author

Made by Arpit.

## License

All rights reserved.

This project was built for SMBLENDS and is not licensed for public redistribution, resale, or reuse without written permission from the author. You may view the source code for reference, but copying, modifying, publishing, or distributing this project as your own work is not permitted.
