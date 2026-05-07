# Project Brief (Persistent)

## Product Vision
Smblends Booking Website is a mobile-first booking web app that replaces Instagram DM scheduling with a clean public booking flow and a simple admin dashboard for the barber.

## User Profile
- **User level:** Level C — learning while building
- **Preferred workflow:** AI does most of the coding, but setup steps for the user must be very simple
- **Main need:** clear, safe progress without getting lost in full-stack setup

## Fixed Project Decisions
- This is a **web app**, not a mobile app
- Hosting should be **Cloudflare Workers with OpenNext** because the app uses full-stack Next.js route handlers
- A free `*.workers.dev` URL is acceptable for first testing before buying a custom domain
- Backend should be **Supabase**
- Notifications should be **email first with Resend**
- Production barber notifications should use `BARBER_NOTIFICATION_EMAIL=sanchitmehta51@gmail.com`
- Resend production delivery to the barber email requires a verified sending domain
- Online payments are **not** part of MVP
- Payment is in person by cash or e-transfer
- SMS is **not** part of MVP
- The design should feel **dark, sleek, premium, minimal, modern**
- The brand palette should stay **black-and-white / neutral zinc**; Sanchit does not want gold/amber accents
- The site must be **mobile-first**
- User-facing scheduling must use **America/Vancouver**
- Past bookings should be retained in Supabase for history/debugging; do not auto-delete them in MVP
- No-show bookings should remain stored with `status = no_show` and visible in `/admin/no-shows`
- Cancelled bookings should remain stored with `status = cancelled` and should not block public slots

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
- Active add-ons: Beard Fade / Line-up +$10
- Disabled future add-on: Design +$5
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
npm run preview
npm run deploy
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
- App-wide gold/amber accents were replaced with a premium black-and-white neutral palette across public booking, confirmation, and admin screens
- Public landing page was rebuilt with the provided SMBLENDS logo, real haircut photos, hero slogan, booking CTAs, hamburger admin menu, contact panel, and infinite image marquee
- Professional GitHub README added with setup, architecture, deployment, status notes, author credit, and All Rights Reserved redistribution terms

### Completed this session
- Added Author and License sections to the root `README.md`
- Credited Arpit as the author and marked the project as All Rights Reserved
- Added README redistribution language stating the project is not licensed for public redistribution, resale, reuse, copying, modification, publishing, or distribution without written permission
- Verified the docs-only change with `npm run lint`
- Re-read `AGENTS.md`, `agent_docs/project_brief.md`, `agent_docs/clientInformation.md`, stack docs, testing notes, code patterns, key app routes, booking logic, slot logic, notification logic, and Supabase migrations before writing new docs
- Added a professional root `README.md` for the GitHub repo
- Documented the live site, product purpose, feature set, SMBLENDS booking rules, tech stack, app structure, local setup, environment variables, Supabase migration order, scripts, Cloudflare Workers/OpenNext deployment notes, current launch status, and MVP guardrails
- Verified the docs-only change with `npm run lint`
- Documented post-handoff abuse/quota expectations for future sessions: free accounts should fail by service limits/restrictions rather than surprise billing, fake bookings are the main practical risk, and Cloudflare Turnstile is the recommended first anti-spam hardening step
- Added future testing notes for Turnstile and simple booking throttling if those protections are implemented later
- Re-read the repo docs and verified the current launch state without code changes
- Confirmed the worktree was clean before verification
- Confirmed Cloudflare/OpenNext config still targets worker `booking`
- Verified `npm run lint` passes
- Verified `npm run build` passes
- Verified `npx opennextjs-cloudflare build` generates `.open-next/worker.js`
- Verified live `/`, `/book`, and `/admin/login` return `200` from `https://booking.smblends.workers.dev`
- Verified live `/api/availability?date=2026-05-04` returns real Monday slots from Supabase
- Verified live `/api/availability?date=2026-05-01` returns an empty past-date slot list
- Verified live `/admin/dashboard` redirects logged-out users to `/admin/login`
- Verified an empty live booking POST returns the expected friendly `400` without creating a booking
- Debugged missing live Resend emails after the user created a booking that did not appear in Resend
- Confirmed Cloudflare logs showed Resend rejecting the send because the live `BARBER_NOTIFICATION_EMAIL` secret value was not Sanchit's address, even though the secret name existed
- Updated the Cloudflare Worker secret `BARBER_NOTIFICATION_EMAIL` to `sanchitmehta51@gmail.com`
- Verified a controlled live booking returned `201` with no Resend error in Worker logs after the secret fix
- Cancelled both controlled debug bookings in Supabase so the `2026-05-18 16:00:00` test slot reopened
- Added cancellation/rescheduling contact copy to the booking form policy block and confirmation page policy reminder
- Verified the copy change with `npm run lint` and `npm run build`
- Deployed the copy change to Cloudflare Worker version `51644d0c-b247-4ea8-b9ac-aefd5142795a`
- Confirmed the deployed `/book` and `/book/confirmed` JavaScript bundles contain the new cancellation/reschedule copy
- Added dedicated `/policy` page with late arrival, cancellation, no-show, rescheduling, guests, payment, after-hours, and location policies
- Updated landing burger menu to show Book Now and Policy at the top, with Admin Login pinned near the bottom
- Verified the policy page and menu change with `npm run lint` and `npm run build`
- Deployed the policy/menu change to Cloudflare Worker version `75a89aaf-727a-4f86-adc8-24c25d495edf`
- Confirmed live `/policy` returns `200`

### Previous session
- Added `lib/validators/time.ts` for strict `HH:MM:SS` booking slot validation
- Reused strict time validation in booking submissions and slot generation
- Rejected past booking dates with a friendly booking API `400`
- Updated public availability so past dates return no slots and same-day slots that have already started no longer appear
- Kept the optional booking email field but removed copy that promises client confirmation emails
- Temporarily disabled client confirmation email sending so free-launch Resend uses only the barber notification
- Disabled the Design add-on at the shared booking config level so it is hidden from the UI and rejected by the API, while the database remains flexible for a future re-enable
- Fixed mobile iPhone date input overflow by wrapping the native date input in a clipped full-width control
- Verified with `npm run lint`, `npm run build`, invalid booking time `400`, past booking date `400`, and past availability date returning an empty slot list
- Verified direct Design add-on submission returns `400`
- User reported applying the Supabase partial unique index query for cancelled-slot rebooking
- User confirmed Sanchit receives barber notification emails with Sanchit's Resend API key and `BARBER_NOTIFICATION_EMAIL=sanchitmehta51@gmail.com`

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
- `/book` currently shows only Beard Fade / Line-up as an active add-on; Design is intentionally disabled until Sanchit offers it
- `/api/bookings` rejects Design add-on submissions while Design is disabled
- `/book` previews the estimated total from local shared pricing config
- `/book` saves valid bookings to Supabase
- Successful `/book` submissions redirect to `/book/confirmed`
- `/book/confirmed` displays the just-created booking summary from session storage
- Server stores `price_charged` from trusted server-side pricing logic
- Server returns a friendly error when a selected slot is unavailable
- Notification code runs after successful booking creation
- Booking creation still succeeds if notification sending fails
- Notification code currently sends only the barber email for free launch without a verified domain
- Live Cloudflare `BARBER_NOTIFICATION_EMAIL` now points to `sanchitmehta51@gmail.com`
- Resend local testing works when the recipient is the Resend account email
- Resend local testing now works for Sanchit's barber notification email using Sanchit's Resend account
- `/admin/login` renders and posts to the admin login API
- `/admin/dashboard` is protected from logged-out visitors
- `/admin/dashboard` shows confirmed bookings from today forward after admin login
- Admin dashboard can cancel confirmed bookings while keeping the record
- Admin logout clears the app's admin cookies
- Admin dashboard can mark confirmed bookings as no-show
- No-showed bookings disappear from the confirmed upcoming-bookings list after refresh
- `/admin/no-shows` shows bookings marked `no_show`
- Admin navigation links between Upcoming, No-shows, and Availability
- `/admin/availability` shows standard and after-hours rows for each weekday
- Admin can toggle existing availability rows active/off
- Public `/book` availability already reads the active availability rows
- `/admin/blocked-dates` can add and remove full-day blocks
- `/admin/blocked-dates` shows confirmed-booking warnings for blocked dates
- Public `/book` already returns no slots for dates in `blocked_dates`
- Malformed booking API payloads return a friendly validation message
- Invalid calendar dates such as `2026-99-99` are rejected before slot lookup or booking creation
- Invalid time slots such as `99:99:99` are rejected before availability lookup or booking creation
- Past booking dates are rejected with a friendly validation message
- Public availability no longer returns slots for past dates or already-started same-day times
- Admin login no longer pre-fills Sanchit's email from app state
- Admin login email is trimmed/lowercased before Supabase auth
- Cancelled bookings are retained with `status = cancelled` and no longer block the public slot
- Public booking, confirmation, and admin screens now follow the black-and-white neutral visual direction
- `/` now shows the new SMBLENDS landing page with logo hero, booking CTA, animated haircut-photo strip, hamburger menu, and contact panel
- `/policy` is live and linked from the landing burger menu
- Cloudflare Workers/OpenNext deployment config is added with `wrangler.jsonc`, `open-next.config.ts`, static asset cache headers, and deploy scripts
- `npx opennextjs-cloudflare build` generates the Cloudflare worker bundle successfully
- Cloudflare Workers deployment is live at `https://booking.smblends.workers.dev`
- Live homepage returns `200`
- Live availability API returns slots from Supabase for valid future dates
- Production admin time display now formats raw slot strings directly, so after-hours bookings display as the selected Vancouver wall-clock time instead of shifting by the Cloudflare runtime timezone
- Production admin availability display now also formats raw time strings directly, so weekly availability rows no longer shift by the Cloudflare runtime timezone

### Unfinished work
- Buy and verify a sending domain later before enabling client confirmation emails
- Run final live smoke test: create one booking, confirm Sanchit receives the email, confirm live admin login works, then cancel the test booking
- Add a real test suite beyond lint/build

### Blockers or risks
- Without a purchased domain, Resend can only send from `onboarding@resend.dev` to the email address that owns the Resend account
- Sanchit barber notifications can work for free if Sanchit owns the Resend account and the app uses his API key
- Client confirmation emails are disabled until a verified sending domain exists
- The site has been handed off. On free Cloudflare/Supabase/Resend accounts, unusual traffic or bot spam is expected to cause service limits, warnings, or failed notifications rather than surprise billing.
- Fake bookings are the main post-launch abuse risk because they can fill real slots until Sanchit cancels them in admin.
- No bot protection is currently installed. If spam appears, add Cloudflare Turnstile to the booking form and verify the token in the booking API before custom anti-spam logic.
- Admin sessions currently use the Supabase access token lifetime, so the barber may need to log in again after the token expires
- `npm test` is not set up yet
- Supabase free-tier inactivity pause is still a later risk during development
- Browsers may still show saved login suggestions despite app-level autocomplete settings, but the app no longer injects the admin email value

### Manual setup still needed
- Run the live smoke test on `https://booking.smblends.workers.dev`
- Verify a sending domain in Resend later before client confirmation emails are re-enabled
- Set production `RESEND_FROM_EMAIL` to a sender address on the verified Resend domain later

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
**Last Updated:** 2026-05-02
**Last Finished:** Re-read the repo docs and verified the current launch state without code changes. Confirmed `npm run lint`, `npm run build`, and `npx opennextjs-cloudflare build` pass. Live checks confirmed `https://booking.smblends.workers.dev`, `/book`, and `/admin/login` return `200`; live availability returns real future slots from Supabase; past availability returns no slots; logged-out admin dashboard redirects to login; and an empty booking POST returns the expected friendly `400`. Then fixed the production email issue by updating Cloudflare `BARBER_NOTIFICATION_EMAIL` to `sanchitmehta51@gmail.com`; a controlled live booking no longer logged a Resend error, and both debug bookings were cancelled. Added cancellation/rescheduling contact copy to the booking form policy block and confirmation page policy reminder, verified with lint/build, deployed to Cloudflare, and confirmed the deployed bundles contain the new copy. Added and deployed `/policy`, linked it from the landing burger menu, and pinned Admin Login near the bottom of the menu. User handed off the site; documented post-launch free-plan abuse/quota expectations and future anti-spam steps.
**In Progress:** Phase 2 admin MVP is functionally complete and visual checks are considered complete. Current work is final live smoke testing and handoff.
**Needs User Action Next:** Create one live test booking, verify Sanchit receives the email, verify live admin login, cancel the test booking, then hand off the public/admin links.
**Recommended Next Prompt:** Read `AGENTS.md`, `agent_docs/project_brief.md`, and `agent_docs/clientInformation.md` first. Phase 2 admin MVP is functionally complete and visual checks are considered complete. The app now has stricter date/time validation, rejects past booking dates, hides past same-day slots, disables the Design add-on until Sanchit offers it, fixes the mobile date input overflow, and `/admin/login` no longer pre-fills Sanchit's email. User reported applying the Supabase partial unique index query so cancelled bookings with `status = cancelled` should reopen their slot; no-shows stay with `status = no_show` and appear in `/admin/no-shows`. For free launch without a domain, client confirmation emails are disabled and the app sends only barber notifications via Sanchit's Resend account; user confirmed Sanchit receives the booking email locally. Cloudflare Workers/OpenNext deployment is live at `https://booking.smblends.workers.dev`, and live homepage/availability checks return `200`. Next focus: run a final live smoke test, cancel the test booking, then hand off the public/admin links to Sanchit.
