# smblends._ Booking Website — Full Research Brief
**For:** UBC CS Student, 2nd Year | **Client:** smblends._ (Burnaby, BC)  
**Goal:** Live booking site in ≤ 14 days, $0–5 CAD/month ongoing  
*Compiled April 2026*

---

## Table of Contents
1. [Recommended Stack](#1-recommended-stack)
2. [Free Tier Cost Table](#2-free-tier-cost-table)
3. [2-Week Build Roadmap](#3-2-week-build-roadmap)
4. [Booking Database Schema](#4-booking-database-schema)
5. [Client Ownership & Handoff Guide](#5-client-ownership--handoff-guide)
6. [Freelance Pricing & Contract Basics](#6-freelance-pricing--contract-basics)
7. [Supplementary Deep Dives](#7-supplementary-deep-dives)

---

## 1. Recommended Stack

**Single best recommendation, optimized for 2-week build + $0/month.**

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | Best docs, huge community, works on Cloudflare Pages with `@cloudflare/next-on-pages`, shadcn/ui is built for it |
| Hosting | **Cloudflare Pages** (free) | Unlimited bandwidth, unlimited requests, **commercial use explicitly allowed**, global CDN, no sleep/cold starts |
| Database + Auth | **Supabase** (free tier) | Postgres DB + Auth + REST API in one dashboard — no custom backend needed. 500MB DB is enormous for a barber site |
| Email | **Resend** (free tier) | 3,000 emails/month free, best-in-class Next.js SDK, 5-minute setup |
| UI | **shadcn/ui + Tailwind CSS** | Copy-paste components, no styling from scratch, looks professional, very fast |
| Domain | **Porkbun** (.com or .ca) | Cheapest transparent renewal pricing; no upsells |

> **Why not Vercel Free?** ⚠️ Vercel's Hobby plan explicitly bans commercial use in its ToS. A client's business website is commercial. Vercel won't proactively shut you down for a low-traffic barber site, but you'd be violating terms. Cloudflare Pages has **no such restriction** and is actually more generous on bandwidth (unlimited vs Vercel's 100 GB cap).

> **Why not Cal.com or Calendly?** Cal.com takes 2–4 days just to self-host and configure. Calendly free plan doesn't support custom policies, your domain, or any backend integration. **Building custom availability logic with Supabase takes about 4 hours** and gives you total control. For a single barber with one set of weekly hours, this is the right call.

> **Why not Stripe?** Adding Stripe to enforce no-show deposits adds 3–4 days of work, requires business registration, and will make the booking flow feel heavy. For launch, display policies clearly and have the barber enforce manually. Stripe can be added in version 2.

---

## 2. Free Tier Cost Table

> All prices verified April 2026. Free tiers are subject to change — check the linked pricing pages before launch.

| Service | Free Tier Limit | What Triggers a Charge | Easy to Accidentally Exceed? | Link |
|---|---|---|---|---|
| **Cloudflare Pages** (hosting) | Unlimited bandwidth, unlimited requests, 500 builds/month, unlimited sites | Paid Workers plan at $5/month needed only if you use Pages Functions heavily (>100K req/day) | No — a barber site will use ~50–200 req/day | [cloudflare.com/plans](https://www.cloudflare.com/plans/) |
| **Supabase** (DB + Auth) | 500MB DB storage, 1GB file storage, 5GB egress/month, 50,000 MAUs, 2 projects | $25/month Pro if you exceed any limit OR if project is inactive 7+ days (auto-pauses) | ⚠️ **Inactivity pause is the main risk** — set a cron ping or use a free uptime monitor | [supabase.com/pricing](https://supabase.com/pricing) |
| **Resend** (email) | 3,000 emails/month, 100 emails/day, 1 custom domain, 1-day log retention | $20/month Pro for 50K emails/month | No — a barber with 10 bookings/day = ~300 emails/month | [resend.com/pricing](https://resend.com/pricing) |
| **Cloudflare DNS** (if you use their nameservers) | Free forever for DNS management | Never — DNS is always free | No | [cloudflare.com](https://www.cloudflare.com) |
| **GitHub** (code repo) | Unlimited public/private repos | Never for this use case | No | [github.com](https://github.com) |
| **Domain name** (.com via Porkbun) | N/A — one-time annual fee | ~$11 USD/year (~$15 CAD) renewal | No | [porkbun.com](https://porkbun.com) |
| **Domain name** (.ca via Webnames.ca) | N/A — one-time annual fee | ~$15–20 CAD/year renewal | No | [webnames.ca](https://www.webnames.ca) |

**True $0/month scenario:** Cloudflare Pages (free) + Supabase (free) + Resend (free) + GitHub (free) = **$0/month**. Only unavoidable cost: domain ~$12–20 CAD/year (~$1–1.70/month amortized).

### ⚠️ Supabase Inactivity Pause — The #1 Risk
Supabase free projects **auto-pause after 7 consecutive days of inactivity**. For a barber website that gets bookings regularly, this won't be an issue. But during development or slow weeks, it can bite you. **Fix:** use a free service like [UptimeRobot](https://uptimerobot.com) (free tier) to ping your Supabase API endpoint every 24 hours. This counts as activity and keeps the project alive.

### Free Subdomain Option (if client isn't ready for a paid domain)
Use the default Cloudflare Pages URL: `smblends.pages.dev`. This is free, HTTPS, and fully functional. It's acceptable as a short-term solution while the client decides on a domain. Do NOT use a `.vercel.app` subdomain for a commercial site (violates Vercel ToS).

---

## 3. 2-Week Build Roadmap

**Philosophy:** Build the simplest possible version that solves the actual problem. Resist adding features mid-build.

### Pre-Work (Before Day 1)
- [ ] Set up GitHub repo
- [ ] Create Supabase account + new project (save DB URL and anon key)
- [ ] Create Cloudflare account
- [ ] Create Resend account + verify a domain (or use `onboarding@resend.dev` for testing)
- [ ] Bootstrap Next.js: `npx create-next-app@latest smblends --typescript --tailwind --app`
- [ ] Install shadcn: `npx shadcn@latest init`
- [ ] Connect repo to Cloudflare Pages via GitHub integration

---

### Days 1–2: Foundation & Database
- [ ] Set up Supabase schema (see Section 4 below)
- [ ] Enable Supabase Row Level Security (RLS) on all tables
- [ ] Create Supabase Auth user for the barber (email/password — this is the only login)
- [ ] Build basic page layout: `layout.tsx`, navigation, color scheme
- [ ] Add shadcn/ui components: `Button`, `Card`, `Input`, `Select`, `Calendar`

---

### Days 3–4: Public Booking Flow (Core Feature)
- [ ] Build `/book` page — step 1: show available dates (read from `availability` table)
- [ ] Build `/book` page — step 2: show available time slots for selected date
  - Query `bookings` table to exclude already-booked slots
  - Highlight any slot at or after 9 PM as "After Hours (+$10)"
- [ ] Build `/book` page — step 3: client info form (name, phone, service type)
- [ ] On submit: insert row into `bookings` table
- [ ] Block double-booking: use Supabase unique constraint on `(date, time_slot)`

---

### Days 5–6: Email Notifications
- [ ] Install Resend SDK: `npm install resend`
- [ ] Create `app/api/bookings/route.ts` — POST endpoint that:
  1. Inserts booking into Supabase
  2. Sends confirmation email to client (Resend)
  3. Sends notification email to barber (Resend)
- [ ] Build React Email templates for both emails (keep it simple — text + booking details)
- [ ] Test with real emails

---

### Days 7–8: Admin Panel
- [ ] Build `/admin` route group (protected by Supabase Auth middleware)
- [ ] Admin login page (Supabase email/password auth)
- [ ] Admin dashboard:
  - Table of upcoming bookings (date, time, client name, service, phone)
  - Button to mark booking as "no-show" (toggles a flag in DB)
  - Simple weekly availability editor (Mon–Sat, set start/end times)
  - Date blocker — pick a date to mark as unavailable (vacation, etc.)

---

### Days 9–10: Policy Display & UX Polish
- [ ] Add policy banner to booking page:
  - "20+ min late: $5 fee"
  - "No-show / same-day cancel: $10 surcharge on next booking"
  - "Bookings after 9 PM: +$10 after-hours fee (automatically shown in pricing)"
- [ ] Auto-detect after-hours slots and show an "After Hours (+$10)" label
- [ ] Add booking confirmation page `/book/confirmed`
- [ ] Mobile responsive check — test on iPhone Safari (barber's clients book on mobile)
- [ ] Add favicon, meta title, Instagram link

---

### Days 11–12: Testing & Deployment
- [ ] End-to-end test: make 5 real bookings as a "client"
- [ ] Test double-booking prevention
- [ ] Test email delivery (check spam folders)
- [ ] Test admin login + dashboard
- [ ] Set up UptimeRobot to ping Supabase every 24h (prevents inactivity pause)
- [ ] Add custom domain to Cloudflare Pages + configure DNS
- [ ] Enable Cloudflare's free SSL (automatic)
- [ ] Set `NEXT_PUBLIC_*` env vars in Cloudflare Pages dashboard

---

### Days 13–14: Buffer & Launch
- [ ] Have the barber test everything on his own phone
- [ ] Fix any bugs from barber testing
- [ ] Walk the barber through the admin panel (30-min screen share)
- [ ] Give barber login credentials + emergency contact instructions
- [ ] Announce on his Instagram: link in bio → booking site

---

### What NOT to Build in 2 Weeks
- Stripe payments / deposits
- SMS notifications (Twilio adds complexity and cost)
- Client accounts / login
- Review system
- Multiple services with different durations
- Waitlist

These are valid v2 features. Ship the core first.

---

## 4. Booking Database Schema

Use Supabase (PostgreSQL). Create these tables in the SQL editor.

### Table: `availability`
Stores the barber's recurring weekly schedule.

```sql
create table availability (
  id           uuid primary key default gen_random_uuid(),
  day_of_week  int not null check (day_of_week between 0 and 6), -- 0=Sun, 6=Sat
  start_time   time not null,   -- e.g. '10:00:00'
  end_time     time not null,   -- e.g. '20:00:00'
  slot_minutes int not null default 30, -- booking duration in minutes
  is_active    boolean not null default true,
  created_at   timestamptz default now()
);
```

### Table: `blocked_dates`
Stores vacation days, stat holidays, etc.

```sql
create table blocked_dates (
  id         uuid primary key default gen_random_uuid(),
  date       date not null unique,
  reason     text,
  created_at timestamptz default now()
);
```

### Table: `bookings`
Core table. One row per appointment.

```sql
create table bookings (
  id              uuid primary key default gen_random_uuid(),
  booking_date    date not null,
  time_slot       time not null,
  client_name     text not null,
  client_email    text not null,
  client_phone    text not null,
  service_type    text not null default 'Haircut', -- 'Haircut', 'Fade', 'Beard', etc.
  is_after_hours  boolean not null default false,
  price_charged   int not null default 0,  -- in cents (e.g. 2500 = $25.00)
  status          text not null default 'confirmed' 
                    check (status in ('confirmed', 'cancelled', 'no_show', 'completed')),
  notes           text,
  created_at      timestamptz default now(),
  -- prevent double-booking at same date+time
  unique (booking_date, time_slot)
);
```

### Row Level Security (RLS) Policies

```sql
-- Bookings: anyone can INSERT (to make a booking), only admin can SELECT/UPDATE/DELETE
alter table bookings enable row level security;

create policy "Public can insert bookings"
  on bookings for insert to anon with check (true);

create policy "Admin can do everything"
  on bookings for all to authenticated using (true);

-- Same pattern for availability and blocked_dates
alter table availability enable row level security;
create policy "Public can read availability" on availability for select to anon using (true);
create policy "Admin can manage availability" on availability for all to authenticated using (true);

alter table blocked_dates enable row level security;
create policy "Public can read blocked dates" on blocked_dates for select to anon using (true);
create policy "Admin can manage blocked dates" on blocked_dates for all to authenticated using (true);
```

### Slot Generation Logic (TypeScript helper)

```typescript
// lib/slots.ts
import { createClient } from '@/lib/supabase/server'

export async function getAvailableSlots(date: Date): Promise<string[]> {
  const supabase = createClient()
  const dayOfWeek = date.getDay()

  // 1. Get barber's hours for this day
  const { data: avail } = await supabase
    .from('availability')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .eq('is_active', true)
    .single()

  if (!avail) return [] // barber is off this day

  // 2. Check if date is blocked
  const { data: blocked } = await supabase
    .from('blocked_dates')
    .select('id')
    .eq('date', date.toISOString().split('T')[0])
    .single()

  if (blocked) return []

  // 3. Get already-booked slots for this date
  const { data: existing } = await supabase
    .from('bookings')
    .select('time_slot')
    .eq('booking_date', date.toISOString().split('T')[0])
    .in('status', ['confirmed'])

  const bookedTimes = new Set(existing?.map(b => b.time_slot) ?? [])

  // 4. Generate all slots between start_time and end_time
  const slots: string[] = []
  const [startH, startM] = avail.start_time.split(':').map(Number)
  const [endH, endM] = avail.end_time.split(':').map(Number)
  let current = startH * 60 + startM
  const end = endH * 60 + endM

  while (current + avail.slot_minutes <= end) {
    const h = Math.floor(current / 60).toString().padStart(2, '0')
    const m = (current % 60).toString().padStart(2, '0')
    const slot = `${h}:${m}:00`
    if (!bookedTimes.has(slot)) {
      slots.push(slot)
    }
    current += avail.slot_minutes
  }

  return slots
}
```

### Time Zone Note
All times are stored in the database as plain `time` (no timezone) and `date` types. Your Next.js app should use the **America/Vancouver** timezone for all display and input. Use `date-fns-tz` library for reliable Vancouver time handling.

```typescript
import { formatInTimeZone } from 'date-fns-tz'
const TIMEZONE = 'America/Vancouver'
const display = formatInTimeZone(new Date(), TIMEZONE, 'h:mm a')
```

---

## 5. Client Ownership & Handoff Guide

### Who Should Own What

| Asset | Owner | Why |
|---|---|---|
| Domain name | **Client (barber)** | It's his brand. If you two part ways, he should keep `smblends.com` |
| Cloudflare account | **Client** | Hosting + DNS. Create under his personal email |
| Supabase project | **Client** | His data (bookings) lives here. Create under his email |
| Resend account | **Client** | Tied to his sending domain |
| GitHub repo | **You** (for now) | Keep the code. Transfer the repo to him later if he wants it |

### Account Setup Process
1. The barber creates accounts on Cloudflare, Supabase, and Resend using his own email.
2. He invites you as a collaborator/member with admin access on each.
3. You build using your access.
4. At handoff, you remove yourself or downgrade to viewer.

This protects him if you ever become unavailable, and protects you from being on the hook for an account you don't want to manage forever.

### Minimum Admin Panel — What the Barber Needs
Build these and nothing else for launch:

- **View upcoming bookings** — table sorted by date, showing name, service, phone, time
- **Mark no-show** — one-click button to flag a booking (for his manual $10 surcharge tracking)
- **Block a date** — pick from calendar, marks that whole day unavailable
- **Edit weekly hours** — change his Mon–Sat start/end times without touching code

Keep changes code-side for anything rare (e.g., adding a new service type). The barber doesn't need a CMS for everything.

### Handoff Checklist (at project completion)
- [ ] Walk him through the admin panel on a screen share (record it for him)
- [ ] Leave a `README.md` in the repo with: how to deploy, how to update availability, env var list
- [ ] Document all account credentials in a shared note (1Password, Google Keep, whatever he uses)
- [ ] Give him the Supabase dashboard URL and show him where bookings live
- [ ] Confirm he knows how to forward the domain if he ever switches registrars

---

## 6. Freelance Pricing & Contract Basics

### What to Charge (Canada, Student Developer, First Project)

This is a real deliverable with business value. Do not work for free.

| Scenario | Suggested Rate | Rationale |
|---|---|---|
| Friend discount (your situation) | **$400–700 CAD flat** | 40–60 hrs × $10–15/hr effective rate. Fair for a first project with a friend — below market, but you get a portfolio piece and testimonial |
| Stranger / acquaintance | $800–1,500 CAD flat | More appropriate for someone you don't know personally |
| Market rate (experienced junior) | $1,500–3,000 CAD | What a junior freelancer with a portfolio charges for this scope |

**Ongoing maintenance:** If he wants you on retainer for bug fixes and updates, $50–100 CAD/month is reasonable. Scope it tightly — define "included" (e.g., up to 2 hours/month) and "extra" (new features billed at $X/hour).

**Never work for "exposure."** A testimonial + portfolio piece is fair non-cash compensation for the friend rate, but get it in writing.

### Minimum Contract Terms (Canadian Student Freelancer)

Use a simple 1–2 page written agreement. You don't need a lawyer for a $500 project, but you do need something written. Cover these 5 clauses:

---

**1. Scope of Work**
List exactly what you're building. Example: "A booking website including: public booking page, admin dashboard, email notifications, deployment on Cloudflare Pages." Explicitly list what is **NOT** included (Stripe payments, SMS, multiple staff, mobile app, etc.).

*Why it matters:* Prevents scope creep. When he asks for "just one more feature," you can point to this.

---

**2. Payment Terms**
Specify: amount, currency (CAD), when it's due. Recommended structure: **50% deposit before you start, 50% on launch day.** 

*Why it matters:* The $0 deposit scenario is how student devs get ghosted after 2 weeks of work. The deposit commits the client.

---

**3. Client Responsibilities**
List what you need from him: timely feedback (within 48 hours), content (Instagram handle, service names, pricing), and account creation by Day 1. Delays caused by his non-response push the timeline.

*Why it matters:* Projects stall when clients disappear mid-build. This clause gives you protection if he complains about delays.

---

**4. Intellectual Property / Ownership**
State that upon final payment, the client owns the deployed website and all custom code you wrote for it. You retain the right to show it in your portfolio.

*Why it matters:* Clarifies he can't claim ownership before paying, and you can use it as a portfolio piece.

---

**5. Warranty / Post-Launch Support**
Define a bug-fix window: "14 days after launch, I will fix bugs in the agreed scope at no charge. New features or changes to scope are billed separately."

*Why it matters:* Without this, "maintenance" becomes indefinite free work.

---

**Simple free contract tools for Canadian freelancers:**
- [AND.CO / Fiverr Workspace](https://www.and.co) — free contract templates
- [HelloSign / Dropbox Sign](https://sign.dropbox.com) — free e-signing (up to 3 docs/month)
- A Google Doc sent by email with a reply confirming acceptance is also legally valid in Canada for this dollar amount — don't let perfect be the enemy of done.

---

## 7. Supplementary Deep Dives

### A. Policy Enforcement — Simplest Viable Approach

**Do not build automated policy enforcement for v1.** Here's why:

Collecting deposits via Stripe requires:
- Stripe account (needs business registration or sole proprietor setup)
- Stripe Connect if you're building on behalf of someone else
- Stripe Canada documentation and payout setup (~3–5 business days)
- PCI compliance considerations
- A UI for refund flows
- ~3–5 extra days of dev time

For a barber doing 5–15 bookings per day from his personal Instagram following, **manual enforcement is completely fine at launch.** Display the policies prominently:

```tsx
// components/PolicyBanner.tsx
const policies = [
  { icon: '⏰', text: 'Arriving 20+ minutes late: $5 fee charged at appointment' },
  { icon: '🚫', text: 'No-shows or same-day cancellations: $10 added to your next booking' },
  { icon: '🌙', text: 'Bookings after 9:00 PM: +$10 after-hours fee' },
]
```

The barber enforces the $5 late fee and $10 no-show surcharge in person — he knows his clients. The system flags no-shows in the admin panel. He tracks the $10 surcharge by checking the flag before the client's next appointment.

**The $10 after-hours surcharge** is the one you can actually enforce in the UI:

```typescript
// In your slot generation logic
const isAfterHours = (timeSlot: string): boolean => {
  const [h] = timeSlot.split(':').map(Number)
  return h >= 21 // 9:00 PM = hour 21 in 24h
}

// Display in UI
const afterHoursFee = isAfterHours(slot) ? 10 : 0
const label = isAfterHours(slot) ? 'After Hours (+$10)' : 'Regular Booking'
```

When the client selects a 9 PM or later slot, show the selected service price plus the $10 after-hours fee clearly. They confirm before submitting. That's enforceable without Stripe.

---

### B. Auth Strategy — Simplest Setup

**Clients do NOT need accounts.** They enter name, email, phone. That's it. No password, no login.

**The barber needs one admin login.** Use Supabase Auth (email + password). Create his account manually in the Supabase dashboard. RLS policies (shown in Section 4) handle the rest.

Why not Clerk? Clerk is excellent but adds a dependency and more setup. For one admin user, Supabase Auth is sufficient and already included in your stack.

---

### C. What a Modern Barber Booking UI Looks Like in 2025

Reference these sites for design inspiration (don't copy, just observe patterns):
- Square Appointments booking pages (clean calendar → time slots → form)
- Booksy barber profiles
- GentlemansCut.com (simple, dark, minimal)

**Key UX principles for barber bookings on mobile:**
1. Full-page calendar picker first (large tap targets)
2. Time slots as big pill buttons (not a dropdown)
3. Service type as visual cards with icons
4. Keep the form to 3–4 fields max (name, email, phone, optional notes)
5. Prominent confirmation screen with all booking details
6. Dark color scheme is conventional and expected for barbers

**shadcn/ui components you'll actually use:**
- `Calendar` — date picker
- `Button` — time slot selections
- `Card` — service type picker
- `Input`, `Label` — booking form
- `Badge` — "After Hours" label
- `Alert` — policy notice
- `Table` — admin booking list
- `Dialog` — confirmation modal

---

### D. Frontend Hosting: Vercel vs Netlify vs Cloudflare Pages

| Feature | Vercel Free (Hobby) | Netlify Free | Cloudflare Pages Free |
|---|---|---|---|
| Commercial use | ❌ **Prohibited** | ✅ Allowed | ✅ Allowed |
| Bandwidth | 100 GB/month | 100 GB/month | **Unlimited** |
| Builds/month | 100 | 300 | 500 |
| Functions | 100K invocations/month | 125K invocations/month | 100K req/day (~3M/month) |
| Cold starts | Present | Present | Near-zero (edge) |
| Custom domain | ✅ | ✅ | ✅ |
| Free SSL | ✅ | ✅ | ✅ |
| Next.js support | Native (best) | Good | Good (via `@cloudflare/next-on-pages`) |

**Verdict:** Use Cloudflare Pages. The unlimited bandwidth and explicit commercial-use permission make it the only free option for a client project.

**One caveat on Cloudflare Pages + Next.js:** Some advanced Next.js features (ISR, some edge functions) require minor configuration with `@cloudflare/next-on-pages`. For a simple booking app with no heavy SSR magic, this is trivial. Follow [Cloudflare's Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/).

---

### E. Domain Decision Tree

```
Does the barber want to pay for a domain now?
│
├── YES → Register smblends.ca (~$15–20 CAD/yr, Webnames.ca for .ca)
│          or smblends.com (~$11 USD/yr, Porkbun)
│          → Client owns and pays for it
│
└── NO (not ready yet) → Use smblends.pages.dev (Cloudflare default)
                          → Free, HTTPS, works fine short-term
                          → Easy to add custom domain later (2 mins)
```

**.ca vs .com for a Burnaby barber:**
- `.ca` signals Canadian business, builds local trust — good choice
- `.com` is universally recognized and often cleaner-looking
- Either is fine. Let the barber choose.
- Note: `.ca` requires Canadian Presence (CIRA rules) — the barber, being in Burnaby, qualifies as a Canadian individual.

---

### F. Notification Strategy

**Resend is the right choice** over Gmail SMTP for this use:

| | Resend Free | Gmail SMTP |
|---|---|---|
| Setup time | ~5 minutes with `npm install resend` | 20–30 min (App Password, less-secure app config) |
| Daily limit | 100 emails/day (~3,000/month) | ~500/day but Google may block "suspicious" sending |
| Reliability | High (dedicated sending infrastructure) | Medium (Google can rate-limit or flag) |
| Custom from address | `bookings@smblends.com` | Always `yourgmailaddress@gmail.com` |
| Next.js SDK | Native `resend` package + React Email | Manual `nodemailer` setup |
| Spam folder risk | Low | Medium-high |

For a barber with ~10 bookings/day (20 emails: 1 confirmation + 1 barber notification per booking), you'll use ~600 emails/month — well within Resend's free 3,000/month.

**Two emails per booking:**
1. **Client confirmation:** booking date, time, address, cancellation policy
2. **Barber notification:** client name, phone, service, time — so he can add to his phone calendar

---

*Document prepared for smblends._ booking website project. All pricing verified April 2026 — confirm free tier limits before relying on them, as they change.*
