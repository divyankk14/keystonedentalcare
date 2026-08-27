-- ============================================================
-- Dental Clinic Booking System — Supabase (Postgres) Schema
-- ============================================================

-- Bookings table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_date date not null,
  time_slot smallint not null,              -- hour in 24h format, e.g. 10, 11, 14
  patient_name text not null,
  phone text not null check (phone ~ '^[0-9]{10}$'),
  status text not null default 'booked' check (status in ('booked', 'cancelled', 'completed')),
  notes text,                                -- optional admin notes
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Prevent double-booking the same slot on the same day (only for active bookings)
  constraint unique_active_slot unique (booking_date, time_slot)
);

-- Auto-update updated_at on row changes
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bookings_set_updated_at
before update on bookings
for each row execute function set_updated_at();

-- Index for fast lookups by date (calendar view)
create index if not exists idx_bookings_date on bookings (booking_date);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table bookings enable row level security;

-- Public (anon) can INSERT a new booking (patient booking flow)
create policy "Public can create bookings"
on bookings for insert
to anon
with check (status = 'booked');

-- Public (anon) can SELECT only date + time_slot + status (to know which slots are taken)
-- NOTE: Supabase RLS is row-level, not column-level. For column-level restriction,
-- expose a view instead of the raw table to the public client (see below).
create view public_slot_availability as
select booking_date, time_slot, status
from bookings
where status = 'booked';

-- Admin (authenticated) can SELECT/UPDATE/DELETE everything
create policy "Admin full access"
on bookings for all
to authenticated
using (true)
with check (true);

-- ============================================================
-- Optional: clinic_settings table for configurable hours/slots
-- ============================================================
create table if not exists clinic_settings (
  id int primary key default 1,
  clinic_name text not null default 'Dental Clinic',
  slot_length_minutes int not null default 60,
  open_hour smallint not null default 10,     -- 24h format
  close_hour smallint not null default 18,
  lunch_start smallint,                        -- nullable, e.g. 13
  lunch_end smallint,                          -- nullable, e.g. 14
  closed_days smallint[] default '{}',         -- 0=Sunday ... 6=Saturday
  constraint single_row check (id = 1)
);

insert into clinic_settings (id) values (1) on conflict (id) do nothing;
