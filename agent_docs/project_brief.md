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
- A free `*.pages.dev` URL is acceptable for first testing before buying a custom domain
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
- App-wide gold/amber accents were replaced with a premium black-and-white neutral palette across public booking, confirmation, and admin screens
- Public landing page was rebuilt with the provided SMBLENDS logo, real haircut photos, hero slogan, booking CTAs, hamburger admin menu, contact panel, and infinite image marquee

### Completed this session
- Replaced gold/amber styling with neutral black-and-white accents across public and admin UI
- Updated selected states, focus rings, after-hours badges, total cards, and blocked-date warning panels to use zinc/white styling
- Updated design docs to record that SMBLENDS should not use gold/amber accents
- Verified no gold/amber references remain in app/component code
- Rebuilt the public homepage into a seamless visual landing page using `images/2A64B001-CE84-4633-A4E4-E7BAC1535EB1.png` as the hero logo and the `IMG_*.jpeg` haircut photos in an infinite right-to-left marquee
- Added a top-right hamburger menu with `Book Now` and `Admin Login`
- Added a contact panel with phone, email, Instagram, address, parking, and entry instructions
- Verified with `npm run lint`, `npm run build`, and `curl -I http://localhost:3000`

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
- Cancelled bookings are retained with `status = cancelled` and no longer block the public slot
- Public booking, confirmation, and admin screens now follow the black-and-white neutral visual direction
- `/` now shows the new SMBLENDS landing page with logo hero, booking CTA, animated haircut-photo strip, hamburger menu, and contact panel

### Unfinished work
- Finish Resend domain verification so production emails can send to the barber email from a real sender
- Run the remaining logged-in browser admin QA checks with the Supabase auth password, including cancel-booking behavior
- Configure Cloudflare Pages
- Human visual review/tuning of the new landing page on desktop and mobile
- Booking-page visual polish to match the new landing page direction
- Add a real test suite beyond lint/build

### Blockers or risks
- Resend currently only sends from `onboarding@resend.dev` to the Resend account email; sending to `sanchitmehta51@gmail.com` requires domain verification and a real sender address
- Admin sessions currently use the Supabase access token lifetime, so the barber may need to log in again after the token expires
- `npm test` is not set up yet
- Supabase free-tier inactivity pause is still a later risk during development
- Logo and haircut portfolio images are intentionally deferred until the landing page polish pass near the end

### Manual setup still needed
- Run the logged-in admin QA checks: cancel one test booking and confirm the slot reopens, add/remove a blocked date, toggle availability and turn it back, mark no-show, verify no-show tracking, and sign out
- Verify a sending domain in Resend before production emails are sent to the barber email
- Change production `BARBER_NOTIFICATION_EMAIL` to `sanchitmehta51@gmail.com`
- Set up Cloudflare Pages project and production env vars
- Provide final logo and haircut portfolio photos for the landing page polish pass

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
**Last Finished:** Rebuilt the public landing page with the provided SMBLENDS logo, real haircut portfolio image marquee, hero slogan, minimal booking CTAs, hamburger side menu for booking/admin login, and contact panel. Verified lint, build, and local `/` response.
**In Progress:** Phase 2 admin MVP is functionally complete. Admin login, upcoming bookings, cancellation, logout, no-show marking, no-show tracking, weekly availability toggles, and blocked-date management are now implemented. Visual polish is underway: app palette and landing page are updated; booking-page visual polish is next after visual review.
**Needs User Action Next:** Review the new landing page at `http://localhost:3000` on desktop/mobile sizes and point out spacing/cropping/copy changes. Run the remaining logged-in admin QA checks with the Supabase auth password later, especially cancelling one test booking and confirming the slot reopens. Later, verify a sending domain in Resend and configure Cloudflare Pages.
**Recommended Next Prompt:** Read `AGENTS.md`, `agent_docs/project_brief.md`, and `agent_docs/clientInformation.md` first. Phase 2 admin MVP is functionally complete. The app-wide gold/amber accents have been replaced with a premium black-and-white neutral palette, and the public landing page now uses the provided SMBLENDS logo plus the haircut portfolio images in an infinite marquee. Cancelled bookings stay in Supabase with `status = cancelled` and reopen their slot; no-shows stay with `status = no_show` and appear in `/admin/no-shows`. Before launch prep, visually review/tune the landing page on desktop and mobile, then polish `/book` to match. Keep it mobile-first, dark, sleek, premium, minimal, black-and-white, and stop before Cloudflare deployment unless explicitly asked.
