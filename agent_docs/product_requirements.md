# Product Requirements

## Product Name
Smblends Booking Website

## One-Line Description
A reliable, mobile-first self-serve booking website for Smblends that reduces Instagram DM scheduling and gives the barber a simple admin workflow.

## Primary User Story
**As a client, I want to choose my appointment online so that I can book without messaging back and forth.**

## Core Features (Must Have)
### 1. Public Booking Flow
- Clients can choose an available date and time slot, then submit booking details.
- Success criteria:
  - Users can select a valid date and time
  - Users can submit name, phone number, and service
  - Booking is stored successfully in the database

### 2. Availability and Slot Logic
- The system reads weekly availability and blocked dates, then displays only valid time slots.
- Success criteria:
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
  - Notification is sent to client
  - Notification is sent to barber
  - Booking details match the database record

### 5. Admin Dashboard
- The barber can log in to view upcoming bookings, mark no-shows, block dates, and edit weekly hours.
- Success criteria:
  - Barber can authenticate securely
  - Upcoming bookings display correctly
  - Hours and blocked dates can be updated
  - No-shows can be marked with one click

### 6. Policy Display and After-Hours Handling
- The booking flow clearly shows policies for lateness, no-shows, same-day cancellations, and after-hours cuts.
- Success criteria:
  - Policies are visible on booking pages
  - 8 PM+ slots are labeled as after-hours
  - After-hours bookings show the $25 rate clearly

## Nice-to-Have Features
The PRD does not separate a dedicated “nice-to-have” section. The closest equivalent is the future / version 2 list below.

## Future Features / Not in MVP
- Online prepayment / deposits
- SMS reminders
- Client accounts/login
- Review/testimonial system
- Multiple services with different durations
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
- Test on iPhone Safari before launch
- Support Chrome, Safari, Firefox, Edge
- Use America/Vancouver for all user-facing scheduling

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
- custom domain connected or free subdomain live
- basic monitoring configured
- Instagram link in bio updated to booking site

### Quality checks
- 5 real test bookings completed
- core policy text visible and accurate
- no critical bugs in booking flow
- barber can use admin panel without help
