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
- Supabase migration `20260430090000_real_smblends_booking_rules.sql` was applied manually in Supabase
- `POST /api/bookings` now saves real bookings with server-side validation, server-side pricing, availability recheck, optional email support, add-on storage, and friendly unavailable/duplicate slot responses
- `/book` now submits to the booking API and shows loading, success, and error states
- `/book/confirmed` now shows a clean animated confirmation summary after successful booking submission
- Resend notification code is wired after booking creation, with barber notification and optional client confirmation
- Local Resend test email was received successfully at the Resend account email

### Completed this session
- Installed `resend`
- Added `lib/notifications/send-booking-notifications.ts`
- Booking API now sends a barber notification after each saved booking
- Booking API now sends a client confirmation only when client email is provided
- Email failures are logged but do not block booking creation
- Improved Resend failure logging to show the exact setup issue
- Verified with `npm run lint`, `npm run build`, and a temporary local booking smoke test that was cleaned up afterward
- Smoke test confirmed bookings still return `201` even when Resend rejects the email
- User temporarily set `BARBER_NOTIFICATION_EMAIL` to the Resend account email and confirmed the "New SMBLENDS booking" email was received

### Currently working
- Home page renders correctly
- Supabase connection works from the app
- `availability`, `blocked_dates`, and `bookings` tables exist
- Real 60-minute weekly availability and 9 PM-midnight after-hours rows are applied in Supabase
- `/api/availability` returns slots for valid dates from the real schedule
- Invalid availability requests return a clear `400` response
- `/book` loads the selected date and shows live slots from the API
- `/book` now unlocks the booking-details form after slot selection
- `/book` lets clients choose `Haircut` or `Haircut & Beard`
- `/book` lets clients select optional add-ons
- `/book` previews the estimated total from local shared pricing config
- `/book` saves valid bookings to Supabase
- Successful `/book` submissions redirect to `/book/confirmed`
- `/book/confirmed` displays the just-created booking summary from session storage
- Server stores `price_charged` from trusted server-side pricing logic
- Server returns a friendly error when a selected slot is unavailable
- Notification code runs after successful booking creation
- Booking creation still succeeds if notification sending fails
- Resend local testing works when the recipient is the Resend account email

### Unfinished work
- Finish Resend domain verification so production emails can send to the barber email from a real sender
- Build admin auth and dashboard
- Configure Cloudflare Pages
- Final landing page polish with logo and haircut portfolio photos
- Add a real test suite beyond lint/build

### Blockers or risks
- Resend currently only sends from `onboarding@resend.dev` to the Resend account email; sending to `sanchitmehta51@gmail.com` requires domain verification and a real sender address
- `npm test` is not set up yet
- Supabase free-tier inactivity pause is still a later risk during development
- Logo and haircut portfolio images are intentionally deferred until the landing page polish pass near the end

### Manual setup still needed
- Add real blocked dates in Supabase later
- Verify a sending domain in Resend before production emails are sent to the barber email
- Set up Cloudflare Pages project and production env vars
- Provide final logo and haircut portfolio photos for the landing page polish pass
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
**Last Updated:** 2026-05-01
**Last Finished:** Installed and wired Resend notifications after booking creation. Booking saves remain successful if email fails. Local Resend test email was received successfully at the Resend account email; production delivery to the barber email still requires domain verification.
**In Progress:** Phase 1 public booking flow is functionally complete for public MVP foundation, with production Resend domain verification deferred until deployment/domain setup.
**Needs User Action Next:** Create the barber admin auth user in Supabase when admin work starts. Later, verify a sending domain in Resend, configure Cloudflare Pages, and provide the final logo/haircut portfolio photos for landing page polish.
**Recommended Next Prompt:** Read `AGENTS.md`, `agent_docs/project_brief.md`, and `agent_docs/clientInformation.md`. The public booking flow now saves real Supabase bookings, redirects to `/book/confirmed`, and sends Resend notification emails in local testing to the Resend account email. Start Phase 2 admin MVP foundation: guide me through creating the barber admin auth user in Supabase, then build admin login protection and the first upcoming-bookings dashboard view. Stop before blocked-date editing, Cloudflare deployment, or landing page logo/photos.
