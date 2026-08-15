-- Booking app schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Tables: services, business_settings, customers, bookings
-- Row Level Security is enabled everywhere. In v1 there is no end-user auth,
-- so writes happen through n8n using the service_role key (which bypasses RLS).
-- The anon key (used by the website) gets read-only access to the data it
-- needs to render the booking form, and no direct write access to bookings.

create extension if not exists "pgcrypto";

-- ============================================================
-- services
-- ============================================================
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  price_cents integer not null default 0 check (price_cents >= 0),
  currency text not null default 'USD',
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table services is 'Bookable services offered by the business.';

-- ============================================================
-- business_settings
-- Single-row (or multi-row, for future multi-location support) config table
-- that n8n reads to check availability, format emails, etc.
-- ============================================================
create table if not exists business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  timezone text not null default 'UTC',
  contact_email text not null,
  contact_phone text,
  address text,
  -- Opening hours keyed by lowercase weekday, each an array of {start,end} in 24h "HH:mm"
  -- e.g. {"mon": [{"start":"09:00","end":"17:00"}], "tue": [...], "sun": []}
  opening_hours jsonb not null default '{}'::jsonb,
  buffer_minutes integer not null default 0,
  booking_lead_time_minutes integer not null default 60,
  booking_horizon_days integer not null default 60,
  google_calendar_id text,
  is_accepting_bookings boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table business_settings is 'Per-business configuration read by n8n and the frontend.';

-- ============================================================
-- customers
-- ============================================================
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  notes text,
  -- Reserved for Version 2 (Supabase Auth client portal)
  auth_user_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email)
);

comment on table customers is 'People who have made at least one booking.';

-- ============================================================
-- bookings
-- ============================================================
do $$ begin
  create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
exception
  when duplicate_object then null;
end $$;

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete restrict,
  service_id uuid not null references services (id) on delete restrict,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status booking_status not null default 'pending',
  customer_notes text,
  internal_notes text,
  google_calendar_event_id text,
  confirmation_email_sent_at timestamptz,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);

comment on table bookings is 'Booking records created by n8n after a website submission.';

create index if not exists bookings_start_time_idx on bookings (start_time);
create index if not exists bookings_service_id_idx on bookings (service_id);
create index if not exists bookings_customer_id_idx on bookings (customer_id);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists services_set_updated_at on services;
create trigger services_set_updated_at before update on services
  for each row execute function set_updated_at();

drop trigger if exists business_settings_set_updated_at on business_settings;
create trigger business_settings_set_updated_at before update on business_settings
  for each row execute function set_updated_at();

drop trigger if exists customers_set_updated_at on customers;
create trigger customers_set_updated_at before update on customers
  for each row execute function set_updated_at();

drop trigger if exists bookings_set_updated_at on bookings;
create trigger bookings_set_updated_at before update on bookings
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table services enable row level security;
alter table business_settings enable row level security;
alter table customers enable row level security;
alter table bookings enable row level security;

-- Public (anon key, used by the website) can read active services...
create policy "Public can read active services"
  on services for select
  using (is_active = true);

-- ...and the public fields of business settings needed to render the form.
create policy "Public can read business settings"
  on business_settings for select
  using (true);

-- Customers and bookings are NOT readable or writable by the anon key.
-- The website never talks to these tables directly; only n8n does, via the
-- service_role key, which bypasses RLS entirely. No policies are created
-- for anon on customers/bookings, so both default to "no access".

-- ============================================================
-- Seed: one business_settings row + starter services (safe to edit/remove)
-- ============================================================
insert into business_settings (business_name, timezone, contact_email, contact_phone, opening_hours, buffer_minutes, booking_lead_time_minutes, booking_horizon_days)
values (
  'Your Business Name',
  'America/New_York',
  'owner@example.com',
  '+1 555 010 0100',
  '{
    "mon": [{"start":"09:00","end":"17:00"}],
    "tue": [{"start":"09:00","end":"17:00"}],
    "wed": [{"start":"09:00","end":"17:00"}],
    "thu": [{"start":"09:00","end":"17:00"}],
    "fri": [{"start":"09:00","end":"15:00"}],
    "sat": [],
    "sun": []
  }'::jsonb,
  15,
  120,
  60
)
on conflict do nothing;

insert into services (name, description, duration_minutes, price_cents, currency, display_order)
values
  ('Initial Consultation', 'A first meeting to understand what you need.', 30, 0, 'USD', 1),
  ('Standard Appointment', 'Our most popular service.', 60, 8000, 'USD', 2),
  ('Extended Session', 'For more involved requests.', 90, 12000, 'USD', 3)
on conflict do nothing;

-- ============================================================
-- Prospect qualification fields (Follow-Up Refinement Milestone)
-- Additive only. Run this against the existing database; it does not
-- touch any existing rows, columns, or the customers/bookings structure
-- above. Safe to re-run (IF NOT EXISTS on every column).
-- ============================================================
alter table bookings add column if not exists automation_interests text[];
alter table bookings add column if not exists automation_description text;
alter table bookings add column if not exists timezone text;

comment on column bookings.automation_interests is
  'GrowthLab capability slugs the prospect selected in the booking form (e.g. lead-management, crm-automation). Multiple allowed.';
comment on column bookings.automation_description is
  'Free-text description the prospect gave of what they want automated.';
comment on column bookings.timezone is
  'IANA timezone the prospect selected/was detected in at booking time (e.g. America/New_York). Used to render correct local time in confirmation and internal notification emails.';
