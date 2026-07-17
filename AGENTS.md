# AGENTS.md — Master Plan for Smblends Booking Website

## Project Overview
**App:** Smblends Booking Website  
**Goal:** Launch a reliable self-serve, mobile-first booking website for Smblends so clients can book without Instagram DMs and the barber can manage bookings from a simple admin dashboard.  
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase + Zod + Resend + Cloudflare Pages  
**Primary Tool:** OpenAI Codex CLI in VS Code terminal  
**User Level:** Level C — learning while building; AI should do most coding, but explain setup simply  
**Current Phase:** Phase 2 — Admin MVP foundation

## How I Should Think
1. **Understand intent first.** Figure out what the user actually needs before writing code.
2. **Ask only when truly blocked.** If a critical fact is missing, ask one focused question. Otherwise, make the safest MVP assumption and continue.
3. **Plan before coding.** Propose a short plan, wait for approval, then implement.
4. **Verify after changes.** Run tests, linting, or manual checks after each meaningful change.
5. **Explain trade-offs.** When recommending an approach, mention the simpler alternative and why this choice fits the MVP.
6. **Protect the beginner.** Whenever the user must do something manually, switch into very simple, step-by-step instructions with no jargon.
7. **Stay within MVP.** Do not add features outside the approved scope just because there is extra time.

## Codex Session Workflow
### At the start of every new session
1. Read `AGENTS.md` first.
2. Read `agent_docs/project_brief.md` next.
3. Read only the additional docs needed for the task (`tech_stack.md`, `code_patterns.md`, `testing.md`, `product_requirements.md`).
4. Summarize the current state in 5–10 lines before proposing any code changes.
5. Propose the next smallest useful step.

### Before ending every session
1. Update the **Current State** section in this file.
2. Update `agent_docs/project_brief.md` with:
   - what changed
   - what still works
   - what is blocked
   - the exact next task
3. If commands changed, update `agent_docs/tech_stack.md` or `agent_docs/testing.md`.
4. If a repeated mistake happened, add a new rule to `agent_docs/code_patterns.md`.

## Manual Setup Rule — Extremely Important
When the user needs to do anything manually (Supabase, Cloudflare, Resend, GitHub, env vars, domain setup, auth setup, deployment, dashboard settings, etc.), do **all** of the following:

1. Say clearly that this is a **manual step for the user**.
2. Give **numbered steps only**.
3. Keep each step short and literal.
4. Mention exactly what screen/page to open.
5. Mention exactly what button to click.
6. Mention exactly what value to paste or type.
7. Mention what the user should see after the step.
8. Avoid assuming prior knowledge.
9. After the steps, give a one-line “Done check”.
10. Then wait for the user’s confirmation before moving to the next risky manual setup step.

### Example style for manual setup
- Open Supabase and click **New project**.
- Name it `smblends-booking`.
- Save the database password somewhere safe.
- Click **Create new project**.
- Wait until the dashboard finishes loading.
- Done check: you should now see the Supabase project dashboard.

## Plan → Execute → Verify
1. **Plan:** Outline a brief approach and ask for approval before coding.
2. **Plan Mode:** If Codex supports a planning or reflective mode for the task, use it.
3. **Execute:** Implement one small feature or one setup task at a time.
4. **Verify:** Run the relevant checks immediately after each feature.
5. **Fix before moving on:** Do not leave failing tests, broken lint, or unverified flows behind.

## Context & Memory
- Treat `AGENTS.md` and `agent_docs/` as living docs.
- Keep the main file concise and use `agent_docs/` for detailed guidance.
- Use these docs to carry context across sessions.
- Prefer updating docs rather than relying on chat history alone.

## Optional Roles (If Supported)
- **Planner:** Break work into the smallest safe next step.
- **Builder:** Implement the approved step.
- **Verifier:** Run checks and confirm the result.
- **Explainer:** Translate technical work into simple language for the user.

## Testing & Verification
- Follow `agent_docs/testing.md`.
- If no automated tests exist yet, propose the smallest useful checks first.
- For each finished feature, verify both the happy path and at least one edge case.
- For booking logic, always verify:
  - valid slot creation
  - blocked date behavior
  - double-booking prevention
  - admin access protection
  - mobile usability

## Checkpoints & Pre-Commit Hooks
- Create a checkpoint after each milestone:
  - project bootstrap
  - database setup
  - public booking flow
  - notifications
  - admin dashboard
  - deployment
- If pre-commit hooks exist, run them before any commit.
- If they fail, fix the issue before continuing.

## Context Files
Load only what is needed for the current task:
- `agent_docs/tech_stack.md` — stack, libraries, commands, deployment
- `agent_docs/code_patterns.md` — architecture, conventions, anti-patterns
- `agent_docs/project_brief.md` — living status, decisions, blockers, next step
- `agent_docs/product_requirements.md` — PRD requirements and scope guardrails
- `agent_docs/testing.md` — verification strategy and manual test flows
- `agent_docs/resources.md` — useful references and future expansion notes
- `agent_docs/clientInformation.md` — barber-provided business rules, schedule, services, pricing, policies, contact info, location, and content

## Roadmap
### Phase 0: Setup and Foundation
- [ ] Initialize Next.js 14 project
- [ ] Install Tailwind CSS and shadcn/ui
- [ ] Create Supabase project
- [ ] Create database schema and RLS
- [ ] Set up environment variables
- [ ] Configure Cloudflare Pages
- [ ] Configure Resend
- [ ] Add pre-commit hooks

### Phase 1: Public MVP Flow
- [ ] Landing page
- [ ] Booking page
- [ ] Slot generation and availability logic
- [ ] Double-booking prevention
- [ ] Confirmation page
- [ ] Policy display and after-hours labels

### Phase 2: Admin MVP
- [x] Admin login
- [x] Upcoming bookings table
- [x] Mark no-show action
- [x] Weekly availability editor
- [x] Blocked dates manager

### Phase 3: Testing and Launch
- [ ] Real booking tests
- [ ] Mobile browser checks
- [ ] Email delivery checks
- [ ] Deploy to Cloudflare Pages
- [ ] Connect custom domain or use `smblends.pages.dev`
- [ ] Handoff walkthrough with barber

## Engineering Constraints
### Type Safety
- Do not use `any`.
- Type all function parameters and return values.
- Use Zod for runtime validation at API boundaries.

### Architecture
- Route handlers handle request/response only.
- Business logic goes in `lib/slots`, `lib/notifications`, or other focused modules.
- Do not put scheduling logic directly in React components.
- Do not put raw database queries in UI components.

### Data Safety
- Enforce double-booking prevention with a database constraint **and** friendly API handling.
- Keep secrets server-side only.
- Use Supabase Row Level Security.
- Collect only required client data.

### Workflow Discipline
- Do not skip verification because a change “looks simple”.
- Do not silently add dependencies without checking whether the current stack already solves the problem.
- Prefer native and existing tools before adding new libraries.

## What NOT To Do
- Do NOT delete files without explicit confirmation.
- Do NOT modify database schemas without a clear migration or backup plan.
- Do NOT add features not in the current phase.
- Do NOT skip tests or manual checks for “simple” changes.
- Do NOT bypass failing tests or pre-commit hooks.
- Do NOT use deprecated libraries or outdated patterns.
- Do NOT deploy placeholder content.
- Do NOT leave the booking flow half-working.
- Do NOT require code edits for the barber to use admin features.

## Current State (Update This Every Session)
**Last Updated:** 2026-07-17
**Completed This Session:** Split Beard Fade / Line-up into separate Beard Fade +$5 and Beard Line-up +$5 options. Added/applied migration `20260717070000_split_beard_add_ons.sql`, retained the legacy combined value for historical bookings, verified lint/build and live validation, cancelled the temporary validation booking, and deployed Worker version `4678f9f9-7800-4a6d-a712-c57550c04785`.
**Currently Working:** Phase 1 and Phase 2 remain complete. Production uses Twilio SMS for clients and Resend email for Sanchit. The booking form now exposes two independent beard add-ons at +$5 each; selecting both totals +$10.
**Currently Working Well:** `npm run lint` and `npm run build` pass. Live `/book` returns `200` and shows Beard Fade and Beard Line-up separately at $5. The API rejects the old combined add-on for new bookings while historical records remain readable.
**Unfinished Work:** No automated test suite exists beyond lint/build/manual smoke checks.
**Blockers Or Risks:** Twilio is prepaid and charges per SMS segment plus the monthly phone-number fee; auto-recharge is initially disabled, so texts stop when the balance runs out. Fake bookings can consume SMS credit and fill slots. No bot protection is installed; add Cloudflare Turnstile first if spam appears. Admin sessions still use the Supabase access token lifetime. `npm test` is not configured.
**Manual Setup Still Needed:** None for the add-on split.
**Next Recommended Task:** Continue with the next requested SMBLENDS change.

## Next session prompt
 Read `AGENTS.md`, `agent_docs/project_brief.md`, and `agent_docs/clientInformation.md` first. Twilio SMS is deployed and the beard add-ons are split into two +$5 options. Continue with the next requested change.
