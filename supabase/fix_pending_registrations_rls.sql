-- Fix RLS policies for public.pending_registrations so users can submit signups.
-- Run this once in Supabase SQL Editor for the target project.

alter table if exists public.pending_registrations enable row level security;

-- Remove conflicting/older policies if present.
drop policy if exists "Super admin can manage pending registrations" on public.pending_registrations;
drop policy if exists "Anyone can submit a registration" on public.pending_registrations;
drop policy if exists "pending_registrations_insert_public" on public.pending_registrations;
drop policy if exists "pending_registrations_select_admin" on public.pending_registrations;
drop policy if exists "pending_registrations_update_admin" on public.pending_registrations;
drop policy if exists "pending_registrations_delete_admin" on public.pending_registrations;

-- Allow public signup inserts (anon + authenticated).
create policy "pending_registrations_insert_public"
  on public.pending_registrations
  for insert
  to anon, authenticated
  with check (true);

-- Restrict admin actions to super admins only.
create policy "pending_registrations_select_admin"
  on public.pending_registrations
  for select
  to authenticated
  using (public.is_super_admin());

create policy "pending_registrations_update_admin"
  on public.pending_registrations
  for update
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

create policy "pending_registrations_delete_admin"
  on public.pending_registrations
  for delete
  to authenticated
  using (public.is_super_admin());
