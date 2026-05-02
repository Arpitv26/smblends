# Product Requirements

## Product Name
Smblends Booking Website

## Business Details
- **Business name:** SMBLENDS
- **Owner/barber:** Sanchit
- **Instagram:** @smblends._
- **Phone:** +1 778-681-7694
- **Email:** sanchitmehta51@gmail.com
- **Location:** 6686 Imperial St, Burnaby, BC V5E 1M8
- **Entry instructions:** Do not knock on the front door. Go down the driveway and go up the stairs.
- **Parking:** Street parking available

## One-Line Description
A reliable, mobile-first self-serve booking website for Smblends that reduces Instagram DM scheduling and gives the barber a simple admin workflow.

## Primary User Story
**As a client, I want to choose my appointment online so that I can book without messaging back and forth.**

## Core Features (Must Have)
### 1. Public Booking Flow
- Clients can choose an available date and time slot, then submit booking details.
- Success criteria:
  - Users can select a valid date and time
  - Users can submit full name, phone number, service, and selected add-ons if any
  - Booking is stored successfully in the database

### 2. Availability and Slot Logic
- The system reads weekly availability and blocked dates, then displays only valid time slots.
- Success criteria:
  - Monday-Friday standard hours are 4:00 PM-9:00 PM
  - Saturday standard hours are 9:00 AM-9:00 PM
  - Sunday standard hours are 3:00 PM-9:00 PM
  - After-hours slots are offered daily from 9:00 PM-12:00 AM
  - Appointment slots are 60 minutes
  - Same-day booking is allowed with no cutoff other than actual slot availability
  - Only available slots are shown
  - Blocked dates cannot be booked
  - Already-booked slots are hidden or disabled

### 3. Double-Booking Prevention
- The backend prevents two bookings from being made for the same date and time.
- Success criteria:
  - Duplicate date/time booking attempts fail safely
  - Users see a clear retry message

### 4. Booking Notifications
- After booking, the client receives a confirmation notification and the barber gets a booking alert.
- Success criteria:
  - Notification is sent to the barber at sanchitmehta51@gmail.com
  - Client notification is sent only if client email is collected or another contact method is added later
  - Booking details match the database record

### 5. Admin Dashboard
- The barber can log in to view upcoming bookings, mark no-shows, block dates, and edit weekly hours.
- Success criteria:
  - Barber can authenticate securely
  - Upcoming bookings display correctly
  - Future bookings can be cancelled without deleting the record
  - Hours and blocked dates can be updated
  - No-shows can be marked with one click
  - No-shows remain stored and visible for follow-up
  - Cancelled bookings remain stored for history and do not block public slots
  - Past bookings remain stored for history and are not auto-deleted in MVP

### 6. Policy Display and After-Hours Handling
- The booking flow clearly shows policies for lateness, no-shows, same-day cancellations, and after-hours cuts.
- Success criteria:
  - Policies are visible on booking pages
  - 9 PM-12 AM slots are labeled as after-hours
  - After-hours bookings add $10 to the selected base service price
  - The final estimated price is clear before submission

### 7. Services, Add-ons, and Pricing
- The booking flow supports the barber's current service menu.
- Base services:
  - Haircut: $20
  - Haircut & Beard: $30
- Add-ons:
  - Beard Fade / Line-up: +$10
- Disabled for launch:
  - Design: +$5, re-enable later when Sanchit offers it
- Pricing rules:
  - After-hours surcharge: +$10
  - Taxes are not included in the displayed price
  - Payment is in person by cash or e-transfer

## Nice-to-Have Features
The PRD does not separate a dedicated “nice-to-have” section. The closest equivalent is the future / version 2 list below.

## Future Features / Not in MVP
- Online prepayment / deposits
- SMS reminders
- Client accounts/login
- Review/testimonial system
- Multiple service durations if the barber later wants different slot lengths per service
- Waitlist

## Explicitly Not Accepted in This Project
- Placeholder content in production
- Half-working booking flow
- Admin features that require code edits to use
- Untested mobile booking flow
- Features outside MVP scope just because there is “extra time”

## Success Metrics
### Primary metrics
1. **Completed Website Bookings:** 25 bookings in the first 30 days
2. **Double-Booking Error Rate:** 0 double-booked appointments

### Secondary metrics
- **Booking Completion Rate:** 70%+ of users who start booking finish it
- **Admin Task Completion:** Barber can update hours, block dates, and view bookings without developer help
- **Mobile Usability:** Core booking flow completes successfully on iPhone Safari and common mobile browsers

## UI/UX Requirements
### Design feel
- dark
- sleek
- premium
- minimal
- modern

### Design principles
- fast clarity
- mobile first
- brand consistency
- trust through transparency

### Key screens
- landing page
- booking page
- booking confirmation page
- admin login
- admin dashboard

## Target Users
### Primary users
Clients booking haircuts with Smblends, mainly local users coming from Instagram on mobile.

### Secondary users
The barber / business owner managing the schedule.

## Technical Requirements from PRD
- Platform: web
- Responsive: yes, mobile-first
- Public users do not need accounts
- Only the barber has admin authentication
- Row Level Security enabled on booking-related tables
- Collect only necessary client data
- Required public booking fields are full name, phone number, date, time, and service
- Email and notes are optional unless the barber asks to require them later
- Test on iPhone Safari before launch
- Support Chrome, Safari, Firefox, Edge
- Use America/Vancouver for all user-facing scheduling

## Website Copy and Policies
### Homepage
- Headline: "Get Blessed"
- Description: "My barber business is built on skill and strong customer connections. I take pride in delivering a sharp, clean, and fresh cut. It ain't about selling a cut - it's selling confidence."

### Payment Instructions
- Display: "Pay cash or e-transfer. Payment is expected before or after the haircut."
- E-transfer email: sanchitmehta51@gmail.com

### Policies
- 20 minutes late: $5 fee
- 30 minutes late: appointment marked as no-show
- No-show: $10 fee applied to next cut
- Same-day cancellation: $10 fee applied to next cut
- Rescheduling: allowed without restriction
- Maximum 2 extra people allowed per client

## Constraints
### Budget
- development tools: free tier stack
- hosting/infrastructure: $0/month target
- third-party services: $0–5 CAD/month target for MVP
- total ongoing target: near-zero monthly cost, excluding domain

### Timeline
- MVP development: 2 weeks
- testing and launch polish included inside the same 2-week roadmap
- launch target: within 14 days of start

### Technical constraints
- must be simple enough to build fast
- must support commercial use on free hosting
- must avoid unnecessary complexity for v1
- must allow easy client handoff and ownership

## Risk Mitigation
- free-tier backend inactivity pause → add uptime ping or light activity monitor
- barber delays feedback/content → set client responsibilities early
- scope creep → lock MVP scope and keep v2 separate
- mobile UX issues → test full flow on real phones
- notification provider complexity → launch with the simplest notification method first

## MVP Completion Checklist
### Development complete
- public booking flow works end-to-end
- available slots load correctly
- double-booking protection works
- admin login works
- dashboard shows upcoming bookings
- barber can block dates and edit weekly hours
- booking notifications work correctly

### Launch ready
- mobile responsive
- custom domain connected or free Cloudflare Pages subdomain live
- basic monitoring configured
- Instagram link in bio updated to booking site

### Quality checks
- 5 real test bookings completed
- core policy text visible and accurate
- pricing and after-hours surcharge checked against `agent_docs/clientInformation.md`
- no critical bugs in booking flow
- barber can use admin panel without help
