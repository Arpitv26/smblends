# Testing Strategy

## Testing Philosophy
For this MVP, verification matters more than fancy test coverage. After each meaningful change:
1. run the smallest useful automated check
2. run the relevant manual flow
3. confirm the real user outcome

Do not move on with broken behavior.

## Automated Checks
### Core commands
```bash
npm run lint
npm run build
npm run preview
npm test
```

If `npm test` is not set up yet, say so clearly and propose the smallest useful first tests.

## What to Test by Area
### 1. Project bootstrap
- app runs locally
- no TypeScript errors
- no lint errors
- shadcn/ui components render correctly

### 2. Booking page
- user can select a date
- valid slots appear
- blocked dates show no slots
- after-hours slots from 9:00 PM-12:00 AM are labeled
- same-day booking is available when slots remain
- service selection shows Haircut and Haircut & Beard
- add-ons show Beard Fade and Beard Line-up separately at +$5 each
- selecting both beard add-ons adds $10 total
- Design add-on is not visible and is rejected by the booking API while Sanchit does not offer it
- price preview matches service + add-ons + after-hours surcharge
- form validation works
- submit button behavior is clear

### 3. Booking API
- valid booking succeeds
- invalid payload fails with friendly message
- duplicate booking fails safely
- server calculates `price_charged`; it does not trust a client-submitted price
- server marks 9:00 PM and later slots as after-hours
- server returns useful JSON errors
- a date with special availability uses the special windows instead of weekly availability
- a date without special availability still uses weekly availability
- private cancellation links cancel only confirmed future appointments and reopen the slot
- invalid, already-used, or past-appointment cancellation links return friendly errors
- future anti-spam checks reject missing or invalid Cloudflare Turnstile tokens if Turnstile is added later
- future rate-limit checks reject excessive same-phone or same-client booking attempts if booking throttling is added later

### 4. Notifications
- client booking confirmation sends as two short SMS messages: appointment details, then private cancellation link
- barber notification email sends
- client email remains optional while client phone remains required
- client cancellation SMS and barber cancellation email send after a successful self-cancel
- admin cancellation sends the client a cancellation SMS
- booking still exists if SMS/email delivery fails after insert
- SMS messages remain GSM-7/short enough to avoid unnecessary segments
- failure is logged safely

### 5. Admin flow
- unauthenticated users cannot access admin pages
- barber can log in
- upcoming bookings load
- admin cancellation changes the booking status and sends the client a cancellation SMS
- admin cancellation still succeeds if the client SMS cannot be sent
- no-show action updates status
- availability editor saves correctly
- special-date availability can add, toggle, and remove one-off schedule windows
- blocked dates save correctly

### 6. Deployment
- site loads on production URL
- booking flow works on live deployment
- env vars are configured correctly
- admin login works in production
- `npm run deploy` completes with OpenNext/Cloudflare Workers

## Manual Test Checklist
### Real-device tests
- iPhone Safari
- one common Android browser
- desktop Chrome

### Real booking tests before launch
- complete 5 real test bookings
- test at least one after-hours slot
- test both base services
- test each add-on
- test price calculation for a standard slot and an after-hours slot
- test one blocked date
- test one duplicate booking attempt
- test one admin login session
- test one client cancellation link from the confirmation text
- test one no-show update
- test one weekly hours change
- test one blocked date add/remove action

## Suggested Future Automated Coverage
These are good next additions after the MVP starts working:
- unit tests for slot generation
- API tests for booking route
- smoke test for admin auth
- end-to-end booking test
- anti-spam tests for Turnstile verification and phone-based booking limits if those features are added

## Pre-Commit Hooks
When hooks are added, they should at minimum run:
```bash
npm run lint
npm run build
```

Add tests too once the test suite is stable.

## Verification Loop
For every feature:
1. explain the plan
2. implement the smallest working version
3. run checks
4. show results
5. fix problems immediately
6. update `AGENTS.md` / `project_brief.md` if process or status changed

## Manual Setup Testing Rule
When the user finishes a manual setup task, verify it right away.

Examples:
- after Supabase setup, confirm env vars exist and a simple query works
- after Resend setup, send a real test email
- after Cloudflare setup, confirm the deployment URL opens
