# Product Requirements Document: Smblends Booking Website MVP

## Overview

**Product Name:** Smblends Booking Website  
**Problem Statement:** Smblends currently relies on Instagram DMs for bookings, which creates friction for clients and creates manual scheduling work for the barber. The MVP will provide a clean, mobile-first website where clients can book appointments directly, see policies before confirming, and receive booking notifications.  
**MVP Goal:** Launch a reliable self-serve booking website that reduces DM-based scheduling and gives the barber a simple admin workflow.  
**Target Launch:** 14 days from project start

## Target Users

### Primary User Profile
**Who:** Clients booking haircuts with Smblends, mainly local users coming from Instagram on mobile.  
**Problem:** They currently need to message manually, wait for replies, and confirm details through chat.  
**Current Solution:** Instagram DMs  
**Why They'll Switch:** Faster booking, visible availability, clear policies, and instant confirmation.

### Secondary User Profile
**Who:** The barber/business owner  
**Problem:** Manual scheduling is hard to track, hard to scale, and easy to mess up.  
**Current Solution:** Managing everything manually through DMs  
**Why They'll Switch:** One dashboard for upcoming bookings, no-shows, blocked dates, and weekly hours.

### User Persona: Mobile Booking Client
- **Demographics:** Teens to young adults and other local clients booking grooming services
- **Tech Level:** Intermediate; comfortable with Instagram and simple web forms
- **Goals:** Book quickly, avoid back-and-forth messaging, know the rules before confirming
- **Frustrations:** Waiting for DM replies, unclear availability, unclear late/no-show rules

### User Persona: Barber Admin
- **Demographics:** Solo barber running a local service business
- **Tech Level:** Basic to moderate
- **Goals:** Manage bookings without code, avoid double-bookings, update hours easily
- **Frustrations:** Manual scheduling, missed messages, hard-to-track cancellations and no-shows

## User Journey

### The Story
A client visits Smblends’ Instagram profile, taps the booking link in bio, lands on the site, selects a date, sees available time slots, notices any after-hours pricing, enters their contact details, and confirms the booking. They immediately get a booking notification, while the barber receives an admin-side notification. Later, the barber can log in to view upcoming appointments, mark a no-show, block a future date, or update weekly hours.

### Key Touchpoints
1. **Discovery:** Instagram profile / link in bio
2. **First Contact:** Landing page or direct booking page
3. **Onboarding:** Select date and time, enter info, confirm
4. **Core Loop:** Book → confirm → attend appointment
5. **Retention:** Positive experience makes repeat booking easier next time

## MVP Features

### Core Features (Must Have)

#### 1. Public Booking Flow
- **Description:** Clients can choose an available date and time slot, then submit booking details.
- **User Value:** Removes DM friction and makes booking fast.
- **User Story:** As a client, I want to choose my appointment online so that I can book without messaging back and forth.
- **Success Criteria:**
  - Users can select a valid date and time
  - Users can submit name, phone number, and service
  - Booking is stored successfully in the database
- **Priority:** Critical

#### 2. Availability and Slot Logic
- **Description:** The system reads weekly availability and blocked dates, then displays only valid time slots.
- **User Value:** Prevents confusion and reduces manual back-and-forth.
- **User Story:** As a client, I want to see only valid appointment times so that I do not request unavailable slots.
- **Success Criteria:**
  - Only available slots are shown
  - Blocked dates cannot be booked
  - Already-booked slots are hidden or disabled
- **Priority:** Critical

#### 3. Double-Booking Prevention
- **Description:** The backend prevents two bookings from being made for the same date and time.
- **User Value:** Protects both clients and barber from scheduling errors.
- **User Story:** As the barber, I want the system to prevent overlapping bookings so that my calendar stays reliable.
- **Success Criteria:**
  - Duplicate date/time booking attempts fail safely
  - Users see a clear retry message
- **Priority:** Critical

#### 4. Booking Notifications
- **Description:** After booking, the client receives a confirmation notification and the barber gets a booking alert.
- **User Value:** Reassurance for clients and instant awareness for the barber.
- **User Story:** As a client, I want a confirmation after booking so that I know my slot is secured.
- **Success Criteria:**
  - Notification is sent to client
  - Notification is sent to barber
  - Booking details match the database record
- **Priority:** Critical

#### 5. Admin Dashboard
- **Description:** The barber can log in to view upcoming bookings, mark no-shows, block dates, and edit weekly hours.
- **User Value:** Keeps operations simple without touching code.
- **User Story:** As the barber, I want a simple dashboard so that I can manage my schedule myself.
- **Success Criteria:**
  - Barber can authenticate securely
  - Upcoming bookings display correctly
  - Hours and blocked dates can be updated
  - No-shows can be marked with one click
- **Priority:** Critical

#### 6. Policy Display and After-Hours Handling
- **Description:** The booking flow clearly shows policies for lateness, no-shows, same-day cancellations, and after-hours cuts.
- **User Value:** Sets expectations before users book.
- **User Story:** As a client, I want to see the rules before booking so that there are no surprises later.
- **Success Criteria:**
  - Policies are visible on booking pages
  - 8 PM+ slots are labeled as after-hours
  - After-hours bookings show the $25 rate clearly
- **Priority:** Critical

### Future Features (Not in MVP)

| Feature | Why Wait | Planned For |
|---------|----------|-------------|
| Online prepayment / deposits | Adds payment setup, webhooks, refund logic, and more edge cases | Version 2 |
| SMS reminders | Useful but adds telecom cost and compliance work | Version 2 |
| Client accounts/login | Not needed for simple public booking | Version 2 |
| Review/testimonial system | Not required for launch booking flow | Version 2 |
| Multiple services with different durations | Adds scheduling complexity | Version 2 |
| Waitlist | Nice-to-have, not core to launch | Version 2 |

## Success Metrics

### Primary Metrics
1. **Completed Website Bookings:** 25 bookings in the first 30 days
   - How to measure: Count confirmed bookings in database
   - Why it matters: Shows clients are actually using the site

2. **Double-Booking Error Rate:** 0 double-booked appointments
   - How to measure: Audit bookings table and support issues
   - Why it matters: Reliability is non-negotiable for a booking system

### Secondary Metrics
- **Booking Completion Rate:** 70%+ of users who start booking finish it
- **Admin Task Completion:** Barber can update hours, block dates, and view bookings without developer help
- **Mobile Usability:** Core booking flow completes successfully on iPhone Safari and common mobile browsers

## UI/UX Direction

**Design Feel:** Dark, sleek, premium, minimal, modern

### Inspiration
- Instagram-first visual identity
- Clean booking experience with minimal friction
- Premium local service brand feel rather than a generic salon template

### Key Screens

1. **Landing Page**
   - Purpose: Introduce the brand and push users into booking
   - Key Elements: Hero section, CTA button, Instagram link, featured haircut visuals, short policy teaser
   - User Actions: Start booking, visit Instagram

2. **Booking Page**
   - Purpose: Let users select date, slot, and submit info
   - Key Elements: Calendar/date picker, slot selector, client form, policy banner, after-hours labels
   - User Actions: Book an appointment

3. **Booking Confirmation Page**
   - Purpose: Confirm success and reduce uncertainty
   - Key Elements: Booking summary, policy reminder, contact info, optional Instagram CTA
   - User Actions: Save details, return to Instagram

4. **Admin Login**
   - Purpose: Secure entry for barber
   - Key Elements: Phone/email and password form
   - User Actions: Sign in

5. **Admin Dashboard**
   - Purpose: Manage operations
   - Key Elements: Upcoming bookings table, no-show action, blocked dates, weekly hours editor
   - User Actions: View, update, manage schedule

### Design Principles
- **Fast clarity:** Users should understand how to book in seconds
- **Mobile first:** Most traffic is expected from Instagram mobile users
- **Brand consistency:** Dark, polished visuals that match Smblends’ Instagram presence
- **Trust through transparency:** Policies and pricing should be visible before confirmation

## Technical Considerations

**Platform:** Web  
**Responsive:** Yes, mobile-first

**Recommended Stack:**
- Next.js 14 (App Router)
- Cloudflare Pages
- Supabase
- shadcn/ui + Tailwind CSS
- Notifications provider to be selected later (email first, SMS in v2)

**Performance Goals:**
- Initial load under 3 seconds on mobile
- Smooth booking interactions
- Booking submission feedback within 2 seconds for most users

**Security/Privacy:**
- Public users do not need accounts
- Only the barber has admin authentication
- Row Level Security enabled on booking-related tables
- Collect only necessary client data: name, phone, service details, optional email if retained later

**Scalability:**
- Designed for one barber and a standard recurring weekly schedule
- Enough for current demand and reasonable growth without re-architecture
- Can later expand with payments, SMS, or more advanced service logic

**Browser/Device Support:**
- Chrome, Safari, Firefox, Edge
- iPhone Safari must be tested before launch
- Android mobile browsers supported

**Timezone Requirement:**
- All booking display and user-facing scheduling should use America/Vancouver

## Constraints & Requirements

### Budget
- **Development tools:** Free tier stack
- **Hosting/Infrastructure:** $0/month target
- **Third-party services:** $0–5 CAD/month target for MVP
- **Domain:** Separate annual cost
- **Total ongoing target:** Near-zero monthly cost, excluding domain

### Timeline
- **MVP Development:** 2 weeks
- **Testing + launch polish:** Included inside 2-week roadmap
- **Launch Target:** Within 14 days of start

### Technical Constraints
- Must be simple enough to build fast
- Must support commercial use on free hosting
- Must avoid unnecessary complexity for v1
- Must allow easy client handoff and ownership

## Open Questions & Assumptions
- Exact service list is assumed to be simple at launch, likely one core haircut service
- Assumes barber can provide content, branding assets, and timely feedback during build
- Assumes booking volume will fit comfortably within free-tier limits
- Assumes SMS is not required for launch if it pushes cost or complexity too high
- Assumes the barber wants site ownership under his own accounts

## Quality Standards

**Code Quality:**
- TypeScript preferred throughout
- Explicit error handling for booking and auth flows
- Validate booking inputs on both client and server
- Keep logic simple and maintainable

**Design Quality:**
- Consistent spacing, typography, and dark-theme branding
- No placeholder content at launch
- Strong mobile responsiveness
- Basic accessibility checks: readable contrast, labeled inputs, keyboard-friendly interactions

**What This Project Will NOT Accept:**
- Placeholder content in production
- Half-working booking flow
- Admin features that require code edits to use
- Untested mobile booking flow
- Features outside MVP scope just because there is “extra time”

## Risk Mitigation

| Risk | Impact | Mitigation Strategy |
|------|--------|-------------------|
| Free-tier backend inactivity pause | Medium | Add uptime ping or light activity monitor |
| Barber delays feedback/content | High | Set client responsibilities early and require timely responses |
| Scope creep during build | High | Lock MVP scope and keep v2 list separate |
| Mobile UX issues | High | Test full flow on real phones before launch |
| Notification provider complexity | Medium | Launch with simplest notification method and add SMS later |

## MVP Completion Checklist

### Development Complete
- [ ] Public booking flow works end-to-end
- [ ] Available slots load correctly
- [ ] Double-booking protection works
- [ ] Admin login works
- [ ] Dashboard shows upcoming bookings
- [ ] Barber can block dates and edit weekly hours
- [ ] Booking notifications work correctly

### Launch Ready
- [ ] Mobile responsive
- [ ] Custom domain connected or free subdomain live
- [ ] Basic monitoring configured
- [ ] Instagram link in bio updated to booking site

### Quality Checks
- [ ] 5 real test bookings completed
- [ ] Core policy text visible and accurate
- [ ] No critical bugs in booking flow
- [ ] Barber can use admin panel without help

## Next Steps

1. Review and approve this PRD
2. Create the Technical Design Document
3. Set up repo, hosting, database, and environment variables
4. Build the public booking flow first
5. Test with real devices and real booking scenarios
6. Launch and update Instagram bio link

---
**Created:** April 2026  
**Status:** Draft — Ready for Technical Design