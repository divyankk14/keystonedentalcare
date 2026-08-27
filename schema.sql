-- ============================================================
-- Dental Clinic Booking System — Supabase (Postgres) Schema
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- Drop existing table if you want a clean start (remove this line if you have data to keep)
drop table if exists bookings cascade;

-- Bookings table
create table bookings (
  id uuid primary key default gen_random_uuid(),
  booking_date date not null,
  time_slot smallint not null,
  patient_name text not null,
  phone text not null,
  status text not null default 'booked' check (status in ('booked', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast lookups by date
create index idx_bookings_date on bookings (booking_date);

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

-- ============================================================
-- Row Level Security — IMPORTANT for anon access
-- ============================================================
alter table bookings enable row level security;

-- Allow anon (public website visitors) to READ bookings
-- This is needed so the booking form can check which slots are taken
create policy "anon_select_bookings"
on bookings for select
to anon
using (true);

-- Allow anon to INSERT new bookings (patient booking flow)
create policy "anon_insert_bookings"
on bookings for insert
to anon
with check (status = 'booked');

-- Allow anon to UPDATE bookings (admin uses anon key for cancel/reschedule)
create policy "anon_update_bookings"
on bookings for update
to anon
using (true)
with check (true);

-- Allow anon to DELETE (not used but safe to have)
create policy "anon_delete_bookings"
on bookings for delete
to anon
using (true);
