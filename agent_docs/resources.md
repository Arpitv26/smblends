# Essential Resources

## Project-Specific References
- Use the PRD for scope.
- Use the technical design for stack and folder layout.
- Use the research brief for cost, deployment, and ownership decisions.

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
