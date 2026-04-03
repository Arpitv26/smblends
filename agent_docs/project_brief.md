# Project Brief (Persistent)

## Product Vision
Smblends Booking Website is a mobile-first booking web app that replaces Instagram DM scheduling with a clean public booking flow and a simple admin dashboard for the barber.

## User Profile
- **User level:** Level C — learning while building
- **Preferred workflow:** AI does most of the coding, but setup steps for the user must be very simple
- **Main need:** clear, safe progress without getting lost in full-stack setup

## Fixed Project Decisions
- This is a **web app**, not a mobile app
- Hosting should be **Cloudflare Pages**
- Backend should be **Supabase**
- Notifications should be **email first with Resend**
- Payments are **not** part of MVP
- SMS is **not** part of MVP
- The design should feel **dark, sleek, premium, minimal, modern**
- The site must be **mobile-first**
- User-facing scheduling must use **America/Vancouver**

## Persistent Workflow Rules
1. Stay within MVP.
2. Build one small piece at a time.
3. Test immediately after each meaningful change.
4. Give beginner-friendly explanations.
5. For manual setup, switch into short step-by-step instructions.
6. Update this file and `AGENTS.md` at the end of each work session.

## Quality Gates
- TypeScript throughout
- Zod validation at API boundaries
- Explicit error handling
- No double-booking
- Mobile-first layout
- Real booking flow tested
- Admin panel usable without code edits

## Key Commands
```bash
npm run dev
npm run build
npm run lint
npm test
```

## Current Status
### Done
- Research brief completed
- PRD completed
- Technical design completed
- Agent instruction files generated

### Not started yet
- Repo bootstrap
- Supabase project setup
- Database schema creation
- Next.js app implementation
- Cloudflare deployment
- Resend setup

## Likely First Build Order
1. Bootstrap Next.js app
2. Add shadcn/ui and core packages
3. Create Supabase project
4. Add database schema + RLS
5. Build booking page
6. Add booking API
7. Add email notifications
8. Build admin panel
9. Deploy and test

## Manual Setup Reminder
Whenever the user must leave the code editor and do something in a dashboard:
- explain like a beginner
- one small step at a time
- say what success looks like
- do not assume they know where settings are

## Update Cadence
Update this file:
- at the end of every session
- after any major architecture decision
- after any new recurring problem or rule
- before handing work to a new Codex session

## Session Handoff Block
**Last Updated:** 2026-04-02  
**Last Finished:** Documentation and AI agent setup  
**In Progress:** Waiting to bootstrap the codebase  
**Needs User Action Next:** Create the project folder and start Codex in the repo  
**Recommended Next Prompt:** Read `AGENTS.md` and `agent_docs/project_brief.md`, summarize the current project state, then help me bootstrap the Next.js app step by step. Use very simple instructions for anything I need to do manually.
