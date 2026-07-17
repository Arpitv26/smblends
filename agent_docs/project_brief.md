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
- Client booking/cancellation notifications use **Twilio SMS**
- Barber booking/cancellation notifications remain **Resend email**
- Production barber notifications should use `BARBER_NOTIFICATION_EMAIL=sanchitmehta51@gmail.com`
- Resend production delivery to the barber email requires a verified sending domain
- Online payments are **not** part of MVP
- Payment is in person by cash or e-transfer
- Automated appointment reminders are not part of MVP
- The design should feel **dark, sleek, premium, minimal, modern**
- The brand palette should stay **black-and-white / neutral zinc**; Sanchit does not want gold/amber accents
- The site must be **mobile-first**
- User-facing scheduling must use **America/Vancouver**
- Past bookings should be retained in Supabase for history/debugging; do not auto-delete them in MVP
- No-show bookings should remain stored with `status = no_show` and visible in `/admin/no-shows`
- Cancelled bookings should remain stored with `status = cancelled` and should not block public slots
- Public launch domain is `https://smblends.ca`

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
- Appointment address: do not display publicly; clients should text Sanchit at 778-681-7694 for the address
- Standard hours: Monday-Saturday 9:00 AM-9:00 PM, Sunday 3:00 PM-9:00 PM
- Appointment slot length: 60 minutes
- After-hours: every day from 9:00 PM-12:00 AM with a +$10 surcharge
- Services: Haircut $20, Haircut & Beard $30
- Active add-ons: Beard Fade +$5 and Beard Line-up +$5
- Disabled future add-on: Design +$5
- Same-day booking is enabled with no cutoff except real slot availability
- Required booking fields: full name, phone number, date, time, service
- Optional booking fields: email, notes
- Optional booking fields: notes

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
- `/book` now supports the real service menu, add-ons, required email, payment copy, policy copy, and estimated pricing
- Supabase migration `20260430090000_real_smblends_booking_rules.sql` was applied manually in Supabase
- `POST /api/bookings` now saves real bookings with server-side validation, server-side pricing, availability recheck, required email support, add-on storage, and friendly unavailable/duplicate slot responses
- `/book` now submits to the booking API and shows loading, success, and error states
- `/book/confirmed` now shows a clean animated confirmation summary after successful booking submission
- Resend notification code is wired after booking creation, with barber notification and optional client confirmation
- Local Resend test email was received successfully at the Resend account email
- App-wide gold/amber accents were replaced with a premium black-and-white neutral palette across public booking, confirmation, and admin screens
- Public landing page was rebuilt with the provided SMBLENDS logo, real haircut photos, hero slogan, booking CTAs, hamburger admin menu, contact panel, and infinite image marquee
- Professional GitHub README added with setup, architecture, deployment, status notes, author credit, and All Rights Reserved redistribution terms

### Completed this session
- Split the combined Beard Fade / Line-up add-on into independently selectable Beard Fade +$5 and Beard Line-up +$5 options.
- Added and applied migration `20260717070000_split_beard_add_ons.sql`; the legacy combined value remains readable for historical bookings.
- Verified lint/build, live UI labels/prices, new add-on API validation, and rejection of the old combined value for new bookings.
- Cancelled the temporary validation booking immediately so its slot reopened.
- Deployed the add-on split to Cloudflare Worker version `4678f9f9-7800-4a6d-a712-c57550c04785`.
- Replaced client booking and cancellation emails with Twilio SMS while keeping Sanchit's barber alerts on Resend email.
- Made client email optional and kept phone required.
- Added server-side phone normalization, Twilio REST delivery, short Trial-safe SMS copy, SMS consent/STOP copy, and private cancellation links in texts.
- Upgraded Twilio from Trial, retained Canadian sender `+1 236-242-1617`, and left auto-recharge disabled.
- Added `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` to the Cloudflare Worker secrets.
- Verified booking-detail, cancellation-link, and cancellation texts delivered to a real Canadian phone.
- Verified `npm run lint`, `npm run build`, live `/` and `/book` responses, optional-email UI copy, and friendly invalid booking API validation.
- Deployed to Cloudflare Worker version `2356e900-d117-4638-a730-007eaa9abc77`.
- Confirmed admin-initiated cancellations previously changed the booking status without emailing the client.
- Added `sendClientCancellationNotification` using the existing client cancellation email template.
- Updated the protected admin cancellation route to email the client after a successful cancellation.
- Kept cancellation durable when Resend fails: the error is logged, but the API still returns success because the booking is already cancelled.
- Updated README, product requirements, and testing documentation for admin cancellation emails.
- Verified the change with `npm run lint` and `npm run build`.
- Deployed the change to Cloudflare Worker version `987cfd98-86e8-485b-8b62-ea2601bda842`.
- Confirmed the deployed server bundle contains the new client cancellation email call.
- Confirmed the live admin cancellation endpoint still rejects logged-out requests with `401`.
- Added migration `20260622090000_expand_weekly_availability.sql` to expand regular hours to 9:00 AM-9:00 PM Monday-Saturday while keeping Sunday at 3:00 PM-9:00 PM.
- Kept the existing daily 9:00 PM-midnight after-hours windows and +$10 surcharge unchanged.
- The migration updates existing standard rows without changing their `is_active` values, so current dashboard on/off choices are preserved.
- Updated the README and project business-rule documentation with the new schedule.
- Verified the local change with `npm run lint` and `npm run build`.
- The user applied the new migration manually in Supabase.
- Verified the live API on `2026-06-27`, `2026-06-28`, `2026-06-29`, `2026-07-04`, `2026-07-05`, and `2026-07-06`.
- Saturday and Monday returned standard slots beginning at 9:00 AM; Sunday returned standard slots beginning at 3:00 PM.
- All checked dates returned 9:00 PM, 10:00 PM, and 11:00 PM as after-hours slots ending at midnight.
- Added a one-time public policy popup inspired by the Setmore example.
- The popup appears on public pages, skips `/admin/*`, and stores dismissal in `localStorage`.
- Popup copy summarizes the key SMBLENDS rules: text Sanchit at 778-681-7694 for the address, pay by cash or e-transfer, 20-minute late fee, 30-minute no-show rule, and no-show/same-day cancellation fee.
- Added a `/policy` link and a clear `I Understand` dismissal button inside the popup.
- Mounted the popup in `app/layout.tsx` through `components/shared/PolicyNoticeModal.tsx`.
- Verified with `npm run lint` and `npm run build`.
- Verified local public/admin behavior with `curl` against `/` and `/admin/login`.
- Verified mobile visual behavior with a headless Chrome screenshot of `/` at 390x844; the compact popup fits and wraps policy text correctly.
- Verified `/admin/login` with a headless Chrome screenshot; the policy popup does not appear on admin.
- Deployed the policy popup to Cloudflare Worker version `0e3e286c-47f2-4bb6-9d48-1fc988d758cc`.
- Confirmed live `https://smblends.ca/` returns `200`.
- Confirmed live `https://smblends.ca/admin/login` returns `200`.
- Confirmed the live layout bundle contains the policy popup code and copy.
- Verified the live policy popup with a fresh mobile headless Chrome screenshot of `https://smblends.ca/`.
- Removed public appointment-address display from the landing contact panel, `/book/confirmed`, `/policy`, and client confirmation email text/HTML.
- Replaced public address/access instructions with copy telling clients to text Sanchit at 778-681-7694 for the appointment address before heading over.
- Updated business docs so future sessions know not to display the address, parking, or access instructions publicly.
- Deployed the address privacy copy to Cloudflare Worker version `f1e9adbc-a3e3-4c0c-bb50-9a1e52432def`.
- Added Supabase migration `20260519090000_booking_cancel_tokens.sql` for private per-booking cancellation tokens.
- Added client self-cancellation through `/booking/cancel/[token]` and `POST /api/bookings/cancel`.
- Updated booking creation to generate/store cancellation tokens and return them to the confirmation page.
- Updated client confirmation emails with a private cancellation link and button.
- Added cancellation emails for both the client and Sanchit after a successful self-cancel.
- Reused the existing `cancelled` status behavior so client-cancelled bookings stay stored and reopen the public slot.
- Updated policy and confirmation copy so cancellation uses the private link while rescheduling still points to @smblends._ / text.
- Documented the cancellation-token migration and client cancellation test coverage in README and agent docs.
- Verified the change with `npm run lint` and `npm run build`.
- Added Supabase migration `20260513090000_special_availability.sql` for one-off special availability windows
- Added `special_availability` slot override logic so date-specific rows replace recurring weekly availability for that date
- Added protected admin APIs for creating, toggling, and deleting special availability rows
- Added `/admin/special-dates` with a form for one-off date windows and controls to toggle/remove existing windows
- Added Special dates to the admin navigation
- Documented special availability behavior in `README.md`, `agent_docs/tech_stack.md`, and `agent_docs/testing.md`
- Verified the change with `npm run lint` and `npm run build`
- User applied the `special_availability` migration in Supabase
- Verified special-date override behavior with a controlled Supabase-backed test: inserted a temporary `2026-07-15` special window from 9 AM to 12 PM, confirmed `/api/availability` returned only `09:00:00`, `10:00:00`, and `11:00:00`, then deleted the temporary row
- Deployed the special-date availability update to Cloudflare Worker version `6a45ae3a-b049-4924-8da4-33292e38d2dc`
- Confirmed live `/book` returns `200`
- Confirmed live `/admin/special-dates` redirects logged-out users to `/admin/login`
- Confirmed live special-date override behavior with a controlled temporary row and deleted it after the test
- Connected the custom domain `https://smblends.ca` to the Cloudflare Worker
- User confirmed production barber and client confirmation emails work
- Made the public booking email field required in the shared Zod schema and booking form UI
- Removed the `Optional` label from the booking email field
- Added confirmation-page copy saying a confirmation email was sent
- Added `clientEmail` to the stored confirmation summary so the confirmation page can show the destination address
- Verified the required-email change with `npm run lint`
- Verified the required-email change with `npm run build`
- Deployed the required-email final polish to Cloudflare Worker version `b8788e9c-edd9-4ee0-9e71-ec7c146ad0b9`
- Confirmed `https://smblends.ca/`, `/book`, and `/admin/login` return `200`
- Confirmed live `/api/availability?date=2026-05-11` still returns Supabase-backed slots
- Confirmed live `POST /api/bookings` rejects an empty email with `400`
- User bought `smblends.ca`
- User added Resend DNS records in Cloudflare for `send.smblends.ca`
- Resend verified `send.smblends.ca`
- Re-enabled client confirmation emails in `lib/notifications/send-booking-notifications.ts`
- Booking notifications now send the barber notification and, when the optional client email field is filled, a client confirmation email with appointment details, payment instructions, location, and policy reminder
- Verified the email-code change with `npm run lint`
- Verified the email-code change with `npm run build`
- Added local `RESEND_FROM_EMAIL=SMBLENDS Bookings <bookings@send.smblends.ca>`
- User added `RESEND_FROM_EMAIL` as a Cloudflare Worker secret
- Deployed the client confirmation email update to Cloudflare Worker version `1cf543d1-ef38-44d8-9c8f-42d0b4abe4ea`
- Confirmed live `/`, `/book`, and `/admin/login` return `200`
- Confirmed live `/api/availability?date=2026-05-11` still returns Supabase-backed slots
- Re-read `AGENTS.md`, this project brief, `clientInformation.md`, all remaining `agent_docs`, the README, key public/admin pages, booking and admin components, slot logic, booking creation, validators, Supabase helpers, notification logic, database migrations, and Cloudflare/OpenNext config to refresh project context
- Confirmed the worktree was clean before the status audit
- Verified `npm run lint` passes
- Verified `npm run build` passes
- Confirmed live `/`, `/book`, `/admin/login`, and `/policy` return `200` from `https://booking.smblends.workers.dev`
- Confirmed live `/admin/dashboard` redirects logged-out users to `/admin/login`
- Confirmed live `/api/availability?date=2026-05-11` returns real Supabase-backed slots
- Confirmed live `/api/availability?date=2026-99-99` returns the expected friendly invalid-date error
- Removed the redundant "Times are shown in Vancouver time..." helper paragraph from the public booking preview
- Removed the locked-form helper sentence that said the form unlocks after choosing a time slot
- Kept the shorter selected-slot helper copy that appears only after a slot is selected
- Verified the UI copy change with `npm run lint` and `npm run build`
- Deployed the UI copy change to Cloudflare Worker version `2f0d8b7d-d5a6-4a44-bcda-ba5c8e93b8f3`
- Confirmed live `/book` returns `200` and the rendered HTML no longer includes the removed booking preview paragraph
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
- `/book` shows Beard Fade and Beard Line-up as separate +$5 add-ons; Design remains disabled until Sanchit offers it
- `/api/bookings` rejects Design add-on submissions while Design is disabled
- `/book` previews the estimated total from local shared pricing config
- `/book` saves valid bookings to Supabase
- Successful `/book` submissions redirect to `/book/confirmed`
- `/book/confirmed` displays the just-created booking summary from session storage
- `/book/confirmed` now includes a private cancellation link for the just-created appointment
- `/book/confirmed`, `/policy`, the landing contact panel, and client confirmation emails do not display the appointment address; they tell clients to text Sanchit for it
- Client confirmation emails include a private cancellation link
- `/booking/cancel/[token]` lets clients cancel confirmed future appointments without an account
- `POST /api/bookings/cancel` validates private cancellation tokens and only cancels confirmed future appointments
- Successful client cancellations notify the client and Sanchit by email
- Server stores `price_charged` from trusted server-side pricing logic
- Server returns a friendly error when a selected slot is unavailable
- Notification code runs after successful booking creation
- Booking creation still succeeds if notification sending fails
- Notification code sends client booking/cancellation texts through Twilio and barber alerts through Resend
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
- Admin navigation links between Upcoming, No-shows, Availability, Special dates, and Blocked dates
- `/admin/availability` shows standard and after-hours rows for each weekday
- Admin can toggle existing availability rows active/off
- Public `/book` availability already reads the active availability rows
- `/admin/special-dates` lets the barber add, toggle, and remove one-off date-specific availability windows
- Public `/book` uses active special-date windows instead of the weekly schedule when a date has special availability rows
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
- A one-time public policy popup is deployed on production and verified with a fresh mobile screenshot
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
- Add a real test suite beyond lint/build

### Blockers or risks
- `send.smblends.ca` is verified in Resend and the user confirmed barber and client emails work in production
- Sanchit barber notifications can work if Sanchit owns the Resend account and the app uses his API key
- The site has been handed off. On free Cloudflare/Supabase/Resend accounts, unusual traffic or bot spam is expected to cause service limits, warnings, or failed notifications rather than surprise billing.
- Fake bookings are the main post-launch abuse risk because they can fill real slots until Sanchit cancels them in admin.
- No bot protection is currently installed. If spam appears, add Cloudflare Turnstile to the booking form and verify the token in the booking API before custom anti-spam logic.
- Admin sessions currently use the Supabase access token lifetime, so the barber may need to log in again after the token expires
- `npm test` is not set up yet
- Supabase free-tier inactivity pause is still a later risk during development
- Browsers may still show saved login suggestions despite app-level autocomplete settings, but the app no longer injects the admin email value

### Manual setup still needed
- None for the SMS research step

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
**Last Updated:** 2026-07-17
**Last Finished:** Split Beard Fade / Line-up into separate +$5 Beard Fade and +$5 Beard Line-up options, retained the legacy value for historical records, applied the database migration, verified production behavior, and deployed Worker version `4678f9f9-7800-4a6d-a712-c57550c04785`.
**In Progress:** Nothing; the add-on split is live.
**Needs User Action Next:** Visually confirm both +$5 add-ons on `https://smblends.ca/book`.
**Recommended Next Prompt:** Continue with the next requested SMBLENDS change.
