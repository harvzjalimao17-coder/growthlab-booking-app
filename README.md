# Booking App

A multi-business booking website. The frontend only collects and validates
bookings — every piece of automation (availability, Supabase writes, the
Google Calendar event, and both emails) is owned by n8n.

```
Customer → Booking Website (Netlify) → n8n Webhook → Supabase
         → Google Calendar → Gmail → Customer + Business Owner
```

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Motion | Framer Motion |
| Forms | React Hook Form + Zod |
| Data | Supabase (Postgres) |
| Automation | n8n |
| Hosting | Netlify |
| Email | Gmail, via n8n OAuth (never from the website) |
| Calendar | Google Calendar, via n8n |

## Project structure

```
app/                  Routes (App Router)
  page.tsx            Landing page
  book/page.tsx        Booking flow
components/
  ui/                 shadcn-style primitives (Button, Input, Select, ...)
  booking/            Booking flow: stepper, steps, review, outcomes
  layout/             Header, Footer
lib/
  supabase/           Client + read-only queries (services, business_settings)
  validations/        Zod schemas
  api/                Webhook submission
  availability.ts     Client-side slot generation (display only)
types/                Domain + database types
hooks/                useServices, useBusinessSettings
supabase/
  schema.sql          All 4 tables, RLS policies, seed data
n8n/
  booking-workflow.json  Importable workflow scaffold
  README.md              Node-by-node explanation
```

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql`. This creates
   `services`, `business_settings`, `customers`, and `bookings`, enables Row
   Level Security, and seeds one business + three sample services.
3. Copy your Project URL and `anon` public key (Settings → API) — you'll
   need these for `.env.local`. **Keep the `service_role` key out of the
   website entirely; it belongs only in n8n.**
4. Edit the seeded `business_settings` row (or the `services` rows) to match
   your real business — either in the Table Editor or by re-running the
   relevant `insert` statements.

## 2. Set up n8n

1. Import `n8n/booking-workflow.json` into your n8n instance.
2. Connect four credentials: Supabase (`service_role` key), Google Calendar
   OAuth2, and Gmail OAuth2 (used for both the confirmation and the owner
   notification).
3. Read `n8n/README.md` for the full node-by-node breakdown and the exact
   request/response contract the frontend expects.
4. Activate the workflow and copy its **Production** webhook URL.

## 3. Configure the frontend

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_N8N_WEBHOOK=
```

Then install and run:

```bash
npm install
npm run dev
```

## 4. Deploy to Netlify

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
   `netlify.toml` already configures the build command, publish directory,
   and the `@netlify/plugin-nextjs` plugin — no manual build settings
   needed.
3. Add the three environment variables from `.env.example` under **Site
   configuration → Environment variables**.
4. Deploy. Every booking submitted on the live site now flows through your
   n8n workflow.

## Customizing for a different business

- **Branding & copy** — `app/page.tsx`, `components/layout/Header.tsx`, and
  the color/font tokens in `tailwind.config.ts` + `app/globals.css`.
- **Services & hours** — edit rows in Supabase directly (`services`,
  `business_settings`); the frontend and the n8n workflow both read from
  there, so nothing in the code needs to change.
- **Booking rules** — `buffer_minutes`, `booking_lead_time_minutes`, and
  `booking_horizon_days` on `business_settings` control spacing, minimum
  notice, and how far out people can book.

## Roadmap (structured for, not built yet)

The schema and types already leave room for:

- **Client Portal** — `customers.auth_user_id` is reserved for Supabase
  Auth; wire up `@supabase/ssr` alongside the existing `lib/supabase/client.ts`.
- **Employee Portal / Admin Dashboard** — read/write against the same
  `bookings`/`services` tables with a service-role backend (or Supabase
  Auth + RLS policies scoped to a `staff` role).
- **Online Payments (Stripe)** — `services.price_cents` and
  `services.currency` already model price; add a Stripe node in n8n after
  "Create Booking" and a `bookings.payment_status` column.
- **SMS / WhatsApp Notifications** — additional nodes after "Create
  Booking" in the same n8n workflow; no frontend changes required.
- **AI Customer Support / CRM integrations** — n8n is already the
  integration layer; add nodes without touching the website.

## Notes

- The frontend never talks to `customers` or `bookings` directly — Row
  Level Security in `supabase/schema.sql` only grants the anon key
  read access to `services` and `business_settings`. All writes happen
  in n8n using the service-role key.
- `lib/availability.ts` generates candidate time slots for display only.
  n8n performs the real availability check after submission, which is why
  the webhook response can come back `"unavailable"` even for a slot the
  UI offered.
