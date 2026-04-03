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
- Payments are **not** part of MVP
- SMS is **not** part of MVP
- The design should feel **dark, sleek, premium, minimal, modern**
- The site must be **mobile-first**
- User-facing scheduling must use **America/Vancouver**

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
- Current app passes lint, production build, and localhost dev smoke check

### Completed this session
- Recovered the interrupted shadcn UI foundation and verified the app again
- Created the Supabase project and saved local env vars
- Added minimal Supabase helper modules for browser-safe and server-only access
- Applied the initial SQL schema and RLS policies in Supabase
- Added placeholder weekly availability rows for all 7 days
- Implemented the first slot-generation helper and verified it through a real API route

### Currently working
- Home page renders correctly
- Supabase connection works from the app
- `availability`, `blocked_dates`, and `bookings` tables exist
- Placeholder weekly availability is present in Supabase
- `/api/availability` returns hourly placeholder slots for valid dates
- Invalid availability requests return a clear `400` response

### Unfinished work
- Build the first booking page UI
- Connect the booking page to `/api/availability`
- Add booking form validation and submission API
- Handle double-booking responses in the API
- Build confirmation page
- Build admin auth and dashboard
- Configure Resend
- Configure Cloudflare Pages
- Add a real test suite beyond lint/build

### Blockers or risks
- No hard blocker right now
- Availability data is placeholder only and should not be treated as final barber hours
- `npm test` is not set up yet
- Supabase free-tier inactivity pause is still a later risk during development

### Manual setup still needed
- Replace placeholder availability with the barber’s real schedule later
- Add real blocked dates in Supabase later
- Set up Resend API key and sender configuration
- Set up Cloudflare Pages project and production env vars
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
**Last Updated:** 2026-04-03  
**Last Finished:** Implemented and verified the first availability backend slice against live Supabase data  
**In Progress:** Phase 1 backend foundation for the public booking flow  
**Needs User Action Next:** None for the next code step  
**Recommended Next Prompt:** Read `AGENTS.md` and `agent_docs/project_brief.md`, then build the first booking page slice that fetches `/api/availability` for a selected date and renders the returned time slots, verify it, and stop before adding booking submission.
