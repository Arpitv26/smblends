# Technical Design Document: Smblends Booking Website MVP

## Overview

This document explains how to build **Smblends Booking Website** in a way that is fast, low-cost, and realistic for a 14-day MVP. It is designed for a builder who knows programming basics but wants AI to do most of the implementation while still giving clear setup steps and simple explanations.

## Verification Echo

Let me confirm the technical requirements:

- **Project:** Smblends Booking Website
- **Platform:** Web app
- **Tech Approach:** Low-code with AI, built in VS Code using Codex CLI
- **Frontend:** Next.js + Tailwind + shadcn/ui
- **Backend:** Supabase for database + auth, Next.js route handlers for server logic
- **Database:** PostgreSQL via Supabase
- **Hosting:** Cloudflare Pages / Workers-compatible Next.js deployment
- **Budget:** As close to free as possible
- **Timeline:** About 14 days, launch as soon as possible
- **Main concern:** Simple setup, low cost, and clear manual steps when setup is required

This document uses that understanding as the working technical plan.

---

## Recommended Approach

### Best Path for You: Low-Code with AI + Managed Services

This project should use a **full-stack web app** with a **managed backend** rather than a custom backend from scratch.

**Primary Recommendation:**
- **Frontend:** Next.js (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Postgres + Auth)
- **Notifications:** Resend for email in MVP
- **Deployment:** Cloudflare Pages / Cloudflare-compatible Next.js deployment
- **AI workflow:** VS Code + Codex CLI for generation, edits, debugging, and refactors

### Why this is the best fit

- Fast enough for a 14-day build
- Cheap enough to stay near free during MVP
- Modern stack with lots of examples and AI familiarity
- Avoids building your own backend auth and database layer
- Easy to hand off to the client later
- Lets AI do most of the coding while you focus on testing and setup

### Trade-off

This approach is not the most customizable possible setup, but it is the best balance of **speed, cost, and simplicity**.

---

## Alternatives Compared

| Option | Pros | Cons | Cost | Time to MVP | Recommendation |
|--------|------|------|------|-------------|----------------|
| **Next.js + Supabase + Cloudflare** | Fast, modern, AI-friendly, cheap, scalable enough, good UI ecosystem | Some deployment setup details on Cloudflare are slightly trickier than Vercel | Near free | 10–14 days | **Best choice** |
| **Next.js + Firebase + Vercel** | Easy docs, popular, fast setup | Commercial-use concern on Vercel free plan, Firebase data model is less ideal than Postgres for booking logic | Near free at first | 10–14 days | Good technically, weaker fit for this client project |
| **No-code booking tool / Calendly / Square-style embed** | Very fast | Less control, weaker branding, limited custom booking logic and policies | Often paid or limited | 2–5 days | Too limiting for this project |
| **Custom Node backend + Postgres hosting** | Full control | More setup, more backend code, more things to break | Higher effort | 14–21+ days | Not worth it for MVP |

### Final recommendation

Use **Next.js + Supabase + Cloudflare + Resend**.

---

## Platform and Architecture Choice

### Chosen platform: Web app

This should be a **responsive web app**, not a mobile app.

### Why web app is correct

- Users will likely come from Instagram link in bio
- Booking is a lightweight interaction, not something that needs an app install
- Faster to build and deploy
- Easier to maintain
- Better for SEO and sharable links

### Architecture pattern: Full-stack framework + managed backend

Use a **full-stack Next.js app** with:
- Server-rendered / hybrid frontend pages
- Next.js route handlers for booking submission and notification orchestration
- Supabase for database and admin auth
- External email service for notifications

### Why this pattern fits

- Simpler than microservices
- Easier for Codex to work with
- Keeps the codebase in one repo
- Supports both public booking flow and admin panel cleanly

### Trade-off

Not as separated as a large enterprise architecture, but much easier for one student developer to ship fast.

---

## Tech Stack Decision

## Frontend

### Recommended: Next.js + TypeScript + Tailwind + shadcn/ui

**Why this stack**
- Next.js gives routing, layouts, server-side logic, and good AI familiarity
- TypeScript helps reduce errors
- Tailwind makes styling fast
- shadcn/ui gives high-quality components without locking you into a big UI library

### Alternatives

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Next.js** | Best all-around, strong docs, great for full-stack web apps | Slight learning curve | **Use this** |
| React + Vite | Simple frontend setup | You would need to wire backend routing separately | Not ideal here |
| SvelteKit | Nice DX | Less common in AI-generated examples than Next.js | Optional, but not best here |

### Final frontend choice
- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui

---

## Backend

### Recommended: Supabase + Next.js route handlers

Use Supabase for:
- Database
- Admin authentication
- Row Level Security
- Simple CRUD operations

Use Next.js route handlers for:
- Booking creation flow
- Input validation
- Notification sending
- Future payment/session orchestration

### Alternatives

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Supabase** | Postgres, auth, dashboard, easy for CRUD | Needs careful RLS setup | **Use this** |
| Firebase | Popular and easy to start | NoSQL is less natural for bookings and admin tables | Second choice |
| Custom Express API | Full control | More code, more setup, slower | Skip for MVP |

### Final backend choice
- **Database/Auth:** Supabase
- **Server logic:** Next.js route handlers
- **Validation:** Zod

---

## Deployment and Infrastructure

### Recommended: Cloudflare deployment path

Use Cloudflare because the project is commercial and needs a low-cost, production-safe deployment target.

### Alternatives

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Cloudflare** | Cheap/free, good global delivery, compatible with project constraints | Slightly more setup than the easiest Vercel path | **Use this** |
| Vercel | Very smooth Next.js experience | Not the preferred fit for this commercial free-tier project | Avoid for this client MVP |
| Netlify | Fine for many sites | Less aligned with the existing research recommendation | Backup option |

### Final infra choice
- **Hosting:** Cloudflare
- **Repo:** GitHub
- **Domain:** Client-owned custom domain later, free subdomain for development if needed

---

## Notifications and Future Payments

## Booking notifications

### MVP recommendation: Email first

Use **Resend** for booking notifications in the MVP.

**Why**
- Fastest to implement
- Free tier is enough for MVP volume
- Easy Next.js integration
- Reliable enough for confirmations and admin alerts

### Alternatives

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Resend** | Easy, clean developer experience, generous enough for MVP | Email only | **Use now** |
| Twilio SMS | Useful for reminders | Adds cost, setup, compliance concerns | Later |
| Telnyx SMS | Often cheaper than Twilio | Slightly less common in beginner workflows | Later |

### Final choice for MVP
- **Client notification:** Email confirmation
- **Barber notification:** Email alert
- **SMS reminders:** Future version

## Payments

### Future recommendation: Stripe Checkout

Do **not** build payments into MVP.

When payments are added later:
- Use **Stripe Checkout** or a Stripe payment link flow
- Store `payment_status`, `amount_due`, `amount_paid`, and `stripe_session_id`
- Trigger payment status updates with webhooks

### Trade-off

Payments are very doable later, but they add:
- Extra setup
- Webhook handling
- Refund / cancellation edge cases
- More user flow complexity

So this should remain a **v2 feature**.

---

## Project Structure

Use a clean structure that Codex can understand easily.

```text
smblends/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── book/
│   │   │   ├── page.tsx
│   │   │   └── confirmed/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── availability/page.tsx
│   │   └── blocked-dates/page.tsx
│   └── api/
│       ├── bookings/route.ts
│       ├── availability/route.ts
│       └── blocked-dates/route.ts
├── components/
│   ├── ui/
│   ├── booking/
│   ├── admin/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── validators/
│   ├── slots/
│   ├── notifications/
│   └── utils/
├── types/
├── public/
├── styles/
├── .env.local
├── README.md
└── package.json
```

### Why this structure
- Keeps public and admin routes separate
- Makes feature work easy for AI tools
- Keeps utilities and validation reusable
- Easy to scale later without major rewrite

---

## Core Features and How to Build Them

## Feature 1: Public Booking Flow

**Complexity:** Medium

### Goal
A client can:
1. Open the booking page
2. Pick a date
3. See available slots
4. Enter details
5. Confirm booking
6. See a success screen

### Main pieces
- Booking page UI
- Date picker
- Available slot loader
- Booking form
- Submit handler
- Confirmation page

### Data needed
- `availability`
- `blocked_dates`
- `bookings`

### API / logic
- Read available time slots for a selected date
- Exclude blocked dates
- Exclude booked slots
- Mark after-hours when slot is 8 PM or later
- Submit booking through POST endpoint

### Codex prompt example

```text
Build a public booking flow for a Next.js App Router project using TypeScript, Tailwind, shadcn/ui, and Supabase.
Requirements:
- Booking page at /book
- User selects date first
- Show only available slots for selected date
- Exclude blocked dates and existing bookings
- Label any slot at or after 8:00 PM as After Hours (+$25)
- Collect client name, phone, and service type
- Submit to Supabase through a route handler
- Show confirmation page after success
Explain file-by-file what you create.
```

### Acceptance criteria
- User can complete booking end-to-end
- Invalid dates show no slots
- Double-booked slot cannot be submitted
- Confirmation page shows booking details

---

## Feature 2: Availability and Slot Logic

**Complexity:** Medium

### Goal
The system should calculate available slots from the barber’s weekly hours and blocked dates.

### Logic rules
- Read weekly hours from `availability`
- Read blocked dates from `blocked_dates`
- Generate time slots in 30-minute increments
- Remove already-booked slots from `bookings`
- Mark after-hours automatically

### Why this logic stays server-side
This is business logic and should be consistent for all users. It is safer to compute on the server or in shared utility code than only in the browser.

### Codex prompt example

```text
Create a reusable slot-generation utility for a barber booking app.
Rules:
- Use weekly availability from Supabase
- Support blocked dates
- Generate 30-minute slots
- Exclude existing confirmed bookings
- Mark slots at or after 8 PM as after-hours
Return a typed result suitable for a booking UI.
Also explain how to test edge cases.
```

### Acceptance criteria
- Slot list is correct for active days
- No slots appear on blocked dates
- Existing bookings remove matching time slots
- After-hours labeling is accurate

---

## Feature 3: Double-Booking Prevention

**Complexity:** Easy to Medium

### Goal
Never allow two bookings for the same date and time.

### Recommended implementation
Use **both**:
1. A database-level unique constraint on `(booking_date, time_slot)`
2. Friendly error handling in the booking API

### Why both are needed
- UI checks improve user experience
- DB constraints guarantee correctness even if two people submit at the same time

### Codex prompt example

```text
Add double-booking prevention to a Supabase-backed booking API.
Requirements:
- Use a unique constraint on booking_date and time_slot
- Catch duplicate insert errors in the Next.js route handler
- Return a user-friendly JSON error message
- Show a clean error state in the booking form UI
```

### Acceptance criteria
- Duplicate booking attempts fail safely
- User sees a clear message and can pick another time

---

## Feature 4: Booking Notifications

**Complexity:** Easy to Medium

### Goal
After a booking is created, notify:
- the client
- the barber

### Recommended MVP flow
1. Booking API inserts row
2. API sends client email
3. API sends barber email
4. API returns success to frontend

### Why not background jobs yet
For this scale, a simple synchronous flow is fine. Background queues would be overkill for MVP.

### Codex prompt example

```text
Add booking notification emails using Resend to a Next.js booking route.
Requirements:
- Send one confirmation email to the client
- Send one notification email to the barber
- Keep templates simple and mobile-friendly
- If email sending fails after booking insert succeeds, log the error and return a safe partial-success state
Explain the trade-off of this approach.
```

### Acceptance criteria
- Both email types send successfully in normal flow
- Booking still exists even if email fails
- Error is visible in logs for debugging

---

## Feature 5: Admin Dashboard

**Complexity:** Medium

### Goal
The barber can sign in and manage bookings without touching code.

### Main sections
- Login page
- Upcoming bookings table
- Mark no-show
- Edit weekly hours
- Block dates

### Recommended auth approach
Use **Supabase Auth** for one admin user.

### Why
- Included in the backend stack
- Simple email/password flow
- Good enough for one-admin MVP

### Codex prompt example

```text
Build a protected admin area for a Next.js App Router app using Supabase Auth.
Requirements:
- /admin/login page
- Protected admin dashboard
- Show upcoming bookings in a table
- Add mark-no-show action
- Add weekly hours editor
- Add blocked dates manager
Use simple, clear components and explain what setup I must do manually in Supabase.
```

### Acceptance criteria
- Unauthenticated users cannot access admin pages
- Barber can log in and see upcoming bookings
- Admin actions update the database correctly

---

## Feature 6: Policy Display and After-Hours Handling

**Complexity:** Easy

### Goal
Make policies visible before users book.

### UI requirements
- Late fee policy visible
- No-show policy visible
- After-hours fee visible
- After-hours slots labeled directly in the UI

### Why this matters
This reduces confusion and helps the barber enforce rules manually.

### Codex prompt example

```text
Create a policy banner and after-hours slot label system for a barber booking site.
Requirements:
- Show late fee, no-show, and after-hours policy clearly
- Display after-hours badge on slots at or after 8 PM
- Keep the design dark, sleek, premium, and mobile-friendly
```

---

## Database Design

## Recommended database: PostgreSQL via Supabase

### Why PostgreSQL is the right fit
- Great for structured booking data
- Easy to enforce unique constraints
- Better fit than NoSQL for admin tables and scheduling logic
- Comes with Supabase dashboard and SQL tools

### Core tables

#### 1. `availability`
Stores weekly recurring hours.

Fields:
- `id`
- `day_of_week`
- `start_time`
- `end_time`
- `slot_minutes`
- `is_active`
- `created_at`

#### 2. `blocked_dates`
Stores days where booking is unavailable.

Fields:
- `id`
- `date`
- `reason`
- `created_at`

#### 3. `bookings`
Stores appointment records.

Fields:
- `id`
- `booking_date`
- `time_slot`
- `client_name`
- `client_phone`
- `client_email` (optional at MVP if retained)
- `service_type`
- `is_after_hours`
- `price_charged`
- `status`
- `notes`
- `created_at`

### Future-safe fields to plan for now
Even if unused initially, consider leaving space for:
- `notification_preference`
- `payment_status`
- `amount_paid`
- `stripe_session_id`
- `sms_reminder_sent_at`

### Trade-off
Adding future-ready fields early can help avoid migrations later, but too many unused fields can make the MVP feel messy. Keep it lean.

---

## Security Design

## Data sensitivity
This app stores light personal data:
- name
- phone number
- maybe email
- booking time and service

This is not extreme compliance territory, but it still matters.

### Recommended security baseline
- Use Supabase Auth for admin login
- Use Row Level Security on all tables
- Public users can only insert bookings and read allowed availability data
- Validate all booking inputs with Zod
- Never expose service-role keys in the frontend
- Store secrets in environment variables only
- Add rate limiting later if abuse appears

### Alternatives

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Supabase Auth + RLS** | Fast, secure enough, built-in | Needs correct policies | **Use this** |
| Clerk/Auth0 | Powerful | Adds more setup and more moving parts | Overkill for MVP |
| Custom auth | Full control | Unnecessary risk and effort | Avoid |

### Trade-off
This is secure enough for MVP, but not meant to handle advanced enterprise auth needs.

---

## Development Workflow

## Recommended workflow
- Single GitHub repo
- Build feature by feature
- Commit after each working milestone
- Deploy early and often
- Test on real mobile devices

### Git strategy
Use **GitHub Flow**:
- `main` = stable
- short feature branches if needed
- merge once working

This is simpler than GitFlow and better for a solo project.

### Environments
- **Local** for development
- **Production** for deployed preview / live app

Optional later:
- Add **staging** if the project grows

### Testing priority
1. Manual flow testing first
2. Light unit tests for helpers
3. A few end-to-end tests for critical paths

### Why this testing approach fits
In 14 days, the biggest win is testing the real booking flow, not chasing high coverage numbers.

---

## AI Assistance Strategy

## Primary AI workflow
Use **VS Code + Codex CLI** as the main implementation assistant.

### What AI should do
- scaffold components
- create route handlers
- generate Supabase utilities
- write validation schemas
- refactor repeated code
- explain setup steps
- debug errors

### What you should do
- review generated code
- run commands
- set up Supabase and Cloudflare accounts
- test flows manually
- verify real-world behavior on desktop and mobile

### Best prompting style for this project
Ask for:
- file-by-file changes
- exact commands to run
- simple explanations
- acceptance criteria
- test steps after each feature

### Prompt template for Codex

```text
You are helping build a production-quality MVP for a barber booking website.
Stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Zod
Requirements:
- Keep implementation simple and maintainable
- Explain any manual setup I need to do
- After coding, list exactly how I should test the feature
- Do not add features outside the current scope
Feature to build:
[describe feature here]
```

### When to ask AI for explanation mode
Use explanation mode when:
- a file confuses you
- setup steps are unclear
- you need to understand a bug
- you want to learn how data flows through the app

---

## Project Setup Checklist

## Step 1: Create accounts
- [ ] GitHub
- [ ] Supabase
- [ ] Cloudflare
- [ ] Resend

## Step 2: Local environment
- [ ] Install Node.js LTS
- [ ] Install Git
- [ ] Install VS Code
- [ ] Install Codex CLI
- [ ] Confirm GitHub auth works

## Step 3: Initialize project
```bash
npx create-next-app@latest smblends --typescript --tailwind --app
cd smblends
npm install
```

## Step 4: Add core dependencies
```bash
npm install @supabase/supabase-js zod date-fns date-fns-tz resend
npx shadcn@latest init
```

## Step 5: Environment variables
Create `.env.local` with placeholders like:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
BARBER_NOTIFICATION_EMAIL=
NEXT_PUBLIC_SITE_URL=
```

### Important note
`SUPABASE_SERVICE_ROLE_KEY` must never be used in the browser. It stays server-side only.

---

## 14-Day Build Plan

## Days 1–2
- initialize Next.js project
- install dependencies
- connect Supabase
- create DB schema
- set up shadcn/ui
- create base layout and theme

## Days 3–4
- build public booking page
- generate available slots
- submit bookings
- add confirmation page

## Days 5–6
- add email notifications with Resend
- improve errors and loading states
- test booking edge cases

## Days 7–8
- build admin auth flow
- build dashboard table
- add no-show action

## Days 9–10
- build weekly availability editor
- build blocked dates manager
- polish dark premium UI

## Days 11–12
- test real booking flows
- mobile test on iPhone/Android
- fix bugs
- prepare deployment

## Days 13–14
- deploy live
- connect domain or subdomain
- handoff testing with barber
- fix final issues

---

## Cost Breakdown

## MVP phase

| Service | Expected cost | Notes |
|--------|---------------|-------|
| GitHub | Free | Repo hosting |
| Next.js | Free | Open-source framework |
| Tailwind + shadcn/ui | Free | UI/styling |
| Supabase | Free for MVP scale | Database + auth |
| Cloudflare | Free for MVP scale | Hosting |
| Resend | Free for MVP scale | Email notifications |
| Domain | Optional yearly cost | Can delay until later |

### Expected monthly total
- **Best case MVP:** $0/month plus domain later
- **Likely MVP:** still near $0/month
- **Potential paid upgrade later:** Supabase/Resend/Cloudflare usage only if growth or features increase

### Trade-off
Keeping costs near zero means accepting free-tier limits and slightly more care around service usage.

---

## Scaling Path

## At 0–100 users
Current stack is more than enough.

## At 100–1,000 users
- monitor email volume
- monitor DB usage
- maybe add better logging

## At 1,000+ users
- consider paid plans
- add monitoring and error tracking
- optimize queries
- consider SMS reminders if ROI is clear

## When payments are added
- add Stripe Checkout
- add webhook handling
- add payment states to DB

---

## Main Trade-Offs and Limitations

### What this approach is great at
- fast MVP shipping
- low cost
- easy AI assistance
- simple maintenance
- polished modern web UI

### What it is not great at
- not designed for multi-staff scheduling yet
- not optimized for complex service-duration logic yet
- SMS is not free/easy enough for MVP
- payments require extra backend handling later

### Honest limitation
The fastest architecture is not always the cleanest long-term architecture, but for this project the speed advantage is worth it.

---

## Definition of Technical Success

The technical implementation is successful when:
- the booking flow works end-to-end
- double-booking is prevented
- admin login and dashboard work
- the app is live on a real URL
- the barber can manage bookings without code
- the monthly cost stays near zero
- you can understand and maintain the main parts with AI help

---

## Self-Verification Checklist

| Required Section | Present? |
|-----------------|----------|
| Platform/approach clearly chosen | Yes |
| Alternatives compared with pros/cons | Yes |
| Tech stack fully specified | Yes |
| Trade-offs honestly acknowledged | Yes |
| Cost breakdown included | Yes |
| Timeline realistic | Yes |
| AI assistance strategy defined | Yes |

---

## Critical Review Questions

1. **Does this tech stack match the budget?**
   Yes. It is designed to stay near free for MVP.

2. **Does the timeline match the complexity?**
   Yes, if the scope stays tight and AI handles most implementation.

3. **Are there security concerns?**
   Yes, but they are manageable with Supabase Auth, RLS, server-only secrets, and input validation.

---

## Save Location

Save this as:

`TechDesign-Smblends-Booking-Website-MVP.md`

---

## Your Documents So Far

1. Research findings
2. PRD — what to build
3. Technical Design — how to build it

## Next Step

Proceed to **Part 4** to generate:
- `AGENTS.md`
- tool-specific instructions
- project guardrails for Codex
- build workflow rules

---

**Created for:** Smblends Booking Website  
**Approach:** Low-code with AI  
**Primary Tooling:** VS Code + Codex CLI  
**Estimated Time to MVP:** 10–14 days  
**Estimated Monthly Cost:** Near $0 for MVP

