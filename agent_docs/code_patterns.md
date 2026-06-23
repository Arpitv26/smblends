# Code Patterns & Project Rules

## Main Goal
Build the simplest reliable MVP that:
- works on mobile
- stays within scope
- is easy for the barber to manage
- is easy for the user to understand and maintain with AI help

## User Level Rule
The user is **not** deeply familiar with full-stack setup yet.

That means:
- keep explanations plain
- explain why a step exists
- break manual actions into tiny steps
- prefer one small change over one giant refactor
- avoid unexplained jargon

## Architecture Rules
### 1. UI components stay presentational
React components should mostly:
- show data
- collect input
- call actions or route handlers

They should **not** contain complex booking rules.

### 2. Business logic belongs in reusable modules
Put logic in focused files such as:
- `lib/slots/*`
- `lib/notifications/*`
- `lib/validators/*`
- `lib/utils/*`

### 3. Route handlers stay thin
Route handlers should:
- parse input
- validate input
- call business logic
- return a response

Route handlers should **not** become giant all-in-one files.

### 4. Database access should be centralized
Keep Supabase access in predictable helper files so the codebase stays easy to reason about.

## Type Safety Rules
- `any` is forbidden
- type all props
- type all function inputs
- type all return values
- use `unknown` + narrowing instead of `any`
- validate external input with Zod

## Validation Pattern
Validate on both sides:
- **client side:** fast feedback
- **server side:** actual trust boundary

### Example booking schema
```ts
import { z } from "zod";

export const bookingSchema = z.object({
  bookingDate: z.string().min(1),
  timeSlot: z.string().min(1),
  clientName: z.string().min(2).max(100),
  clientPhone: z.string().min(7).max(30),
  clientEmail: z.string().email().optional(),
  serviceType: z.enum(["Haircut", "Haircut & Beard"]),
  addOns: z.array(z.enum(["Beard Fade / Line-up"])).default([]),
  notes: z.string().max(500).optional()
});
```

## Error Handling Pattern
Errors must help the user recover.

### Good error messages
- “That time slot was just booked. Please choose another time.”
- “Please fill in your name and phone number.”
- “Login failed. Check your email and password.”

### Bad error messages
- “Insert failed”
- “Unexpected issue”
- raw database errors shown to users

### Example API handling
```ts
try {
  // insert booking
} catch (error) {
  // If duplicate booking error, show a retry message.
  // For unknown errors, log the full error and return a safe generic message.
}
```

## Booking Logic Rules
Always enforce these rules:
1. Only valid slots appear.
2. Blocked dates show no slots.
3. Confirmed bookings remove matching slots.
4. A DB partial unique index prevents duplicate active bookings for the same date/time.
5. API errors remain user-friendly.
6. Any slot at or after 9 PM is marked after-hours.
7. Same-day bookings are allowed with no cutoff, as long as the slot is still available.
8. Store the price charged from server-side pricing logic, not from a client-submitted price.
9. Cancelled and no-show bookings stay stored for history, but only `confirmed` bookings should block public slots or database inserts.

## Smblends Business Rules
- Standard hours:
  - Monday-Saturday: 9:00 AM-9:00 PM
  - Sunday: 3:00 PM-9:00 PM
- After-hours:
  - Every day: 9:00 PM-12:00 AM
  - Surcharge: +$10
- Slot length:
  - 60 minutes
- Services:
  - Haircut: $20
  - Haircut & Beard: $30
- Add-ons:
  - Beard Fade / Line-up: +$10
- Disabled future add-on:
  - Design: +$5
- Payment:
  - In person by cash or e-transfer
  - E-transfer email: sanchitmehta51@gmail.com
- Required booking fields:
  - full name
  - phone number
  - email
  - date
  - time
  - service
- Optional fields:
  - notes

## UI Rules
### Visual style
- dark
- sleek
- premium
- minimal
- modern
- black-and-white neutral palette only; do not use gold/amber brand accents

### UX rules
- mobile-first
- fast booking flow
- clear policies before submission
- large tap targets
- visible after-hours labeling
- no clutter

### Form rules
- keep forms short
- do not ask for unnecessary fields
- label inputs clearly
- show inline validation where useful

## File Naming Conventions
- components: `PascalCase.tsx`
- utilities: `kebab-case.ts` or focused descriptive names
- route handlers: `route.ts`
- validation files: `[feature].schema.ts` or `[feature].ts`
- types: `types/[domain].ts`

## Coding Conventions
- prefer small files with a clear purpose
- prefer readable names over clever names
- leave short comments only where the “why” is not obvious
- avoid giant components
- avoid deeply nested conditionals when a small helper function is cleaner

## What NOT To Do
- do not add Stripe in MVP
- do not add SMS in MVP
- do not add client accounts in MVP
- do not build multi-staff scheduling
- do not over-engineer service durations yet
- do not add libraries just because they are popular
- do not skip mobile testing
- do not hardcode secrets
- do not put booking rules only in the frontend

## Manual Setup Output Format
When setup requires the user to do something:
1. **Goal:** one sentence
2. **Steps:** short numbered list
3. **What to paste/copy:** exact values or where to find them
4. **Done check:** one sentence
5. **Common mistake to avoid:** one sentence max

## Session Handoff Pattern
At the end of each session, always write:
- what was completed
- what files changed
- what still needs user action
- the exact next prompt the user should give Codex

## Definition of Done for a Feature
A feature is done only when:
- code is implemented
- it is tested
- obvious edge cases were checked
- docs or current-state notes are updated
- the next step is clear
