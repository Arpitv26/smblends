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
- add-ons show Beard Fade / Line-up only
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

### 4. Notifications
- client confirmation email sends
- barber notification email sends
- booking still exists if email fails after insert
- failure is logged safely

### 5. Admin flow
- unauthenticated users cannot access admin pages
- barber can log in
- upcoming bookings load
- no-show action updates status
- availability editor saves correctly
- blocked dates save correctly

### 6. Deployment
- site loads on production URL
- booking flow works on live deployment
- env vars are configured correctly
- admin login works in production

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
- test one no-show update
- test one weekly hours change
- test one blocked date add/remove action

## Suggested Future Automated Coverage
These are good next additions after the MVP starts working:
- unit tests for slot generation
- API tests for booking route
- smoke test for admin auth
- end-to-end booking test

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
