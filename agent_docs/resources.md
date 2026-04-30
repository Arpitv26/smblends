# Essential Resources

## Project-Specific References
- Use the PRD for scope.
- Use the technical design for stack and folder layout.
- Use the research brief for cost, deployment, and ownership decisions.
- Use `agent_docs/clientInformation.md` as the current source of truth for the barber's business details.

## Codex Workflow References
- Keep `AGENTS.md` as the main source of truth.
- Keep `agent_docs/` focused and practical.
- Update docs when repeated mistakes happen.

## Useful Topics to Revisit Later
- Supabase Row Level Security
- Cloudflare Pages environment variables
- Resend domain verification
- date-fns-tz for Vancouver time handling
- minimal pre-commit setup
- future Stripe Checkout integration
- future SMS reminder integration

## Future v2 Expansion Notes
These are not part of MVP:
- Stripe deposits / prepayment
- SMS reminders
- client accounts
- waitlist
- multiple service durations
- review/testimonial system

## Handoff Reminders
Client should own:
- domain
- Cloudflare account
- Supabase project
- Resend account

You can keep the GitHub repo during build and transfer later if needed.

## Common Risks to Watch
- Supabase inactivity pause on free tier
- scope creep
- untested mobile UX
- deployment env var mistakes
- email provider setup issues

## Barber Info Checklist
Use this when you need to collect the real business info before launch.

### Booking schedule
- What days of the week do you work?
- What start time and end time do you want clients to book on each day?
- Do you want the same hours every week, or different hours on different days?
- What slot length should the website use for bookings?
- Do you want to allow same-day bookings?
- If yes, how many hours ahead should someone be allowed to book?
- Do you want to allow last-minute bookings late in the day?
- Do you want to allow after-hours cuts at or after 9 PM?
- If yes, what exact after-hours window should be bookable?
- Are there any days you never work?
- Are there any regular breaks that should not be bookable, like lunch or prayer time?
- Are there any dates already blocked out for vacations, events, or personal time?

### Service details
- What exact service names should appear in MVP?
- What is the price for each service?
- What add-ons should clients be allowed to choose?
- What is the price for each add-on?
- What is the after-hours surcharge?
- Are taxes included in the shown price or added later?
- Is there anything included in the haircut that should be mentioned?
- Are there any services that should not be listed yet but may be added later?

### Payment workflow
- How do you want clients to pay right now?
- Do you want payment handled in person only, or do you want deposits later?
- If payment is in person, what methods do you accept: cash, e-transfer, card, Apple Pay, something else?
- If you accept e-transfer, what email or phone number should be used?
- Do you want the website to say `pay at appointment`, `cash only`, or a different message?
- Do you want cancellation fees or no-show fees mentioned even if they are not automatically charged?

### Booking policies
- What is your late policy?
- After how many minutes late is the appointment cancelled?
- What is your no-show policy?
- What is your same-day cancellation policy?
- Do you charge extra for after-hours cuts?
- Do you want guests to know they must confirm by text, DM, or email after booking, or is website booking alone enough?
- Do you want any age limits, guest limits, or other shop rules mentioned?
- Do you want a policy for rescheduling?
- Do you want a policy for refunds or deposits later?

### Business identity and brand
- What exact business name should appear on the site?
- What short tagline or one-line description do you want under the heading?
- What Instagram handle should be linked?
- What phone number should appear on the site, if any?
- What email should appear on the site, if any?
- What booking confirmation email address should be used later?
- What colors do you want the site to use?
- Do you want the current black and gold style to stay?
- Do you have brand colors with exact hex codes?
- Do you have a logo?
- If yes, can you send the best quality version?
- Do you want any photos on the site?
- If yes, can you send haircut photos, chair/shop photos, or portraits to use?
- Do you want the look to feel more luxury, more streetwear, more minimal, or something else?

### Business location and logistics
- What is the shop address?
- Should the full address be shown before booking, after booking, or both?
- Are there parking instructions clients should see?
- Are there building-entry instructions, suite number, or buzzer details?
- Do you serve clients at one location only?
- Do you want travel/mobile cuts mentioned, or not at all?

### Contact and notification details
- What email should receive barber booking notifications?
- Do you want a second backup email for notifications?
- What phone number should clients use if they need help?
- Do you want the site to tell clients to DM Instagram for questions, or use phone/email instead?
- What sender name should confirmation emails come from later, for example `Smblends Bookings`?

### Admin and business operations
- Who should have admin access to the dashboard?
- Is it just you, or someone else too?
- What email should be used for your admin login later?
- Do you want upcoming bookings shown newest first or grouped by day?
- Do you want no-show tracking in the admin dashboard from day one?
- Do you want blocked dates managed by you only?

### Website content
- What main headline should clients see when they land on the site?
- What supporting text should explain the service?
- What short trust-building text do you want, if any?
- Do you want policy text visible on the booking page?
- Do you want FAQs on the landing page?
- Do you want a section that says how to prepare before the appointment?
- Do you want a section explaining after-hours pricing?

### Things needed directly from customers
This is the minimum customer info the website should collect in MVP.
- Full name
- Phone number
- Selected date
- Selected time slot
- Selected service
- Selected add-ons, if any
- Optional email for confirmation
- Optional notes

### Questions to confirm with the barber about customer data
- Do you want to collect email, or keep it optional?
- Do you want to collect notes, or remove notes to keep the form shorter?
- Do you want to collect Instagram handle, or not at all?
- Do you want to collect anything else that is truly necessary for the appointment?

### Files and assets to request
- Logo file
- Brand colors or reference screenshots
- Haircut or portfolio photos
- Shop/location photos
- Any existing policy text
- Any current booking instructions copied from Instagram
- Any wording already used in captions, highlights, or booking posts
