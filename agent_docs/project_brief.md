# Project Brief (Persistent)

## Product Vision
Smblends Booking Website is a mobile-first booking web app that replaces Instagram DM scheduling with a clean public booking flow and a simple admin dashboard for the barber.

## User Profile
- **User level:** Level C — learning while building
- **Preferred workflow:** AI does most of the coding, but setup steps for the user must be very simple
- **Main need:** clear, safe progress without getting lost in full-stack setup

## Fixed Project Decisions
- This is a **web app**, not a mobile app
- Hosting should be **Cloudflare Pages**
- Backend should be **Supabase**
- Notifications should be **email first with Resend**
- Online payments are **not** part of MVP
- Payment is in person by cash or e-transfer
- SMS is **not** part of MVP
- The design should feel **dark, sleek, premium, minimal, modern**
- The site must be **mobile-first**
- User-facing scheduling must use **America/Vancouver**

## Client Information Source
- The barber's current business details live in `agent_docs/clientInformation.md`.
- Treat that file as the source of truth for hours, services, pricing, policies, contact info, location, and homepage copy.
- If code or docs conflict with `clientInformation.md`, pause and update the plan before coding.

## Barber Business Rules
- Business name: SMBLENDS
- Owner/barber: Sanchit
- Instagram: @smblends._
- Notification/payment email: sanchitmehta51@gmail.com
- Phone: +1 778-681-7694
- Address: 6686 Imperial St, Burnaby, BC V5E 1M8
- Standard hours: Monday-Friday 4:00 PM-9:00 PM, Saturday 9:00 AM-9:00 PM, Sunday 3:00 PM-9:00 PM
- Appointment slot length: 60 minutes
- After-hours: every day from 9:00 PM-12:00 AM with a +$10 surcharge
- Services: Haircut $20, Haircut & Beard $30
- Add-ons: Beard Fade / Line-up +$10, Design +$5
- Same-day booking is enabled with no cutoff except real slot availability
- Required booking fields: full name, phone number, date, time, service
- Optional booking fields: email, notes

## Persistent Workflow Rules
1. Stay within MVP.
2. Build one small piece at a time.
3. Test immediately after each meaningful change.
4. Give beginner-friendly explanations.
5. For manual setup, switch into short step-by-step instructions.
6. Update this file and `AGENTS.md` at the end of each work session.

## Quality Gates
- TypeScript throughout
- Zod validation at API boundaries
- Explicit error handling
- No double-booking
- Mobile-first layout
- Real booking flow tested
- Admin panel usable without code edits

## Key Commands
```bash
npm run dev
npm run build
npm run lint
npm test
```

## Current Status
### Done
- Research brief completed
- PRD completed
- Technical design completed
- Agent instruction files generated
- Next.js 14 app bootstrapped in the existing repo
- Tailwind CSS and ESLint base setup added
- shadcn/ui base files added (`components.json`, `lib/utils.ts`, `components/ui/button.tsx`)
- Interrupted shadcn theme setup repaired so the app builds again
- Supabase project created manually
- `.env.local` saved with project URL, publishable key, and service role key
- Minimal `lib/supabase/*` helpers added for browser-safe and server-only access
- Live Supabase API check succeeded with HTTP 200
- First local SQL migration added for `availability`, `blocked_dates`, and `bookings`
- Initial schema applied successfully in Supabase
- Placeholder weekly availability rows added for all 7 days
- `lib/slots/get-available-slots.ts` now reads availability, blocked dates, and confirmed bookings
- `GET /api/availability?date=YYYY-MM-DD` now returns generated slot data
- First `/book` page slice added with a mobile-first date picker and live slot rendering
- `/book` now supports slot selection and a validated booking-details draft form
- `/book` has been updated from fixed `Haircut` to the real two-service menu
- Current app passes lint, production build, and localhost dev smoke check
- New barber configuration was captured in `agent_docs/clientInformation.md`
- `/book` now supports the real service menu, add-ons, optional email, payment copy, policy copy, and estimated pricing

### Completed this session
- Confirmed appointments should be 60 minutes
- Added shared Smblends booking config for services, add-ons, slot length, after-hours threshold, and pricing
- Updated booking validation for `Haircut`, `Haircut & Beard`, optional email, and selected add-ons
- Updated slot logic so 9 PM and later is after-hours and overnight windows can end at midnight
- Updated `/book` with service selection, add-on checkboxes, estimated total, payment copy, and policy copy
- Updated homepage and booking page copy to use the real SMBLENDS content
- Added `supabase/migrations/20260430090000_real_smblends_booking_rules.sql` for optional email, add-on storage, midnight availability, and real 60-minute availability rows
- Verified with `npm run lint`, `npm run build`, and local smoke checks

### Currently working
- Home page renders correctly
- Supabase connection works from the app
- `availability`, `blocked_dates`, and `bookings` tables exist
- Placeholder weekly availability is present in Supabase
- `/api/availability` returns slots for valid dates; it will reflect the real schedule after the latest Supabase migration is applied
- Invalid availability requests return a clear `400` response
- `/book` loads the selected date and shows live slots from the API
- `/book` now unlocks the booking-details form after slot selection
- `/book` lets clients choose `Haircut` or `Haircut & Beard`
- `/book` lets clients select optional add-ons
- `/book` previews the estimated total from local shared pricing config

### Unfinished work
- Apply the new Supabase migration manually in the dashboard
- Add booking submission API
- Handle double-booking responses in the API
- Build confirmation page
- Build admin auth and dashboard
- Configure Resend
- Configure Cloudflare Pages
- Add a real test suite beyond lint/build

### Blockers or risks
- No hard blocker right now
- Live Supabase availability remains placeholder until the new migration is applied
- `npm test` is not set up yet
- Supabase free-tier inactivity pause is still a later risk during development

### Manual setup still needed
- Apply `supabase/migrations/20260430090000_real_smblends_booking_rules.sql` in Supabase
- Add real blocked dates in Supabase later
- Set up Resend API key and sender configuration
- Set up Cloudflare Pages project and production env vars
- Provide final logo and haircut portfolio photos for the public site
- Create the barber’s admin auth user in Supabase when admin work starts

## Likely First Build Order
1. Bootstrap Next.js app
2. Add shadcn/ui and core packages
3. Create Supabase project
4. Add database schema + RLS
5. Build booking page
6. Add booking API
7. Add email notifications
8. Build admin panel
9. Deploy and test

## Manual Setup Reminder
Whenever the user must leave the code editor and do something in a dashboard:
- explain like a beginner
- one small step at a time
- say what success looks like
- do not assume they know where settings are

## Update Cadence
Update this file:
- at the end of every session
- after any major architecture decision
- after any new recurring problem or rule
- before handing work to a new Codex session

## Session Handoff Block
**Last Updated:** 2026-04-30
**Last Finished:** Updated the current build for 60-minute appointments, real services/add-ons, optional email, 9 PM after-hours handling, estimated pricing, payment/policy copy, and added the Supabase migration for matching database changes.
**In Progress:** Phase 1 public booking flow foundation before booking submission.
**Needs User Action Next:** Apply the new Supabase SQL migration, then later provide the final logo and haircut portfolio photos.
**Recommended Next Prompt:** Read `AGENTS.md`, `agent_docs/project_brief.md`, and `agent_docs/clientInformation.md`, confirm the Supabase migration has been applied, then build `POST /api/bookings` with server-side validation, server-side price calculation, optional email support, add-on storage, and friendly duplicate-slot handling.
