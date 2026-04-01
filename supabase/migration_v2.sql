-- ============================================================
-- NEXA SUPPLEMENTAL MIGRATION v2
-- Run in Supabase SQL Editor after the main migration.sql
-- ============================================================

-- ============================================================
-- 1. PENDING REGISTRATIONS TABLE
-- Stores signup data before admin approval (no auth user yet)
-- ============================================================
create table if not exists public.pending_registrations (
  id text primary key default 'pr-' || substring(gen_random_uuid()::text, 1, 9),
  email text not null unique,
  full_name text not null,
  phone text,
  country text,
  sector text default 'GENERAL',
  business_category text,
  business_type text,
  company_name text,
  preferred_currency text default 'USD',
  -- Payment verification
  transaction_id text,
  payment_phone text,
  payment_method text default 'MTN',
  bank_name text,
  account_name text,
  -- Status
  status text default 'PENDING', -- PENDING | APPROVED | REJECTED
  rejection_count integer default 0,
  created_at timestamptz default now()
);

-- RLS for pending_registrations
alter table public.pending_registrations enable row level security;

-- Only super admin can view/modify pending registrations
create policy "Super admin can manage pending registrations"
  on public.pending_registrations
  for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- Allow anyone to INSERT (sign up) - but not read/update/delete
create policy "Anyone can submit a registration"
  on public.pending_registrations
  for insert
  to anon, authenticated
  with check (true);

-- ============================================================
-- 2. USER PASSCODE / BIOMETRIC SETTINGS
-- Stores per-user device login preferences
-- ============================================================
create table if not exists public.user_auth_settings (
  id text primary key default 'uas-' || substring(gen_random_uuid()::text, 1, 9),
  user_id uuid not null references public.profiles(id) on delete cascade,
  -- Passcode: stored as a bcrypt hash via pgcrypto
  passcode_hash text,
  passcode_enabled boolean default false,
  biometric_enabled boolean default false,
  biometric_type text, -- 'face_id' | 'touch_id' | 'fingerprint'
  -- One-time reset code
  reset_code text,
  reset_code_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

alter table public.user_auth_settings enable row level security;

create policy "User can manage own auth settings"
  on public.user_auth_settings
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 3. Function to hash passcode (uses pgcrypto)
-- ============================================================
create extension if not exists pgcrypto;

create or replace function public.set_user_passcode(p_passcode text)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.user_auth_settings (user_id, passcode_hash, passcode_enabled)
  values (auth.uid(), crypt(p_passcode, gen_salt('bf')), true)
  on conflict (user_id)
  do update set
    passcode_hash = crypt(p_passcode, gen_salt('bf')),
    passcode_enabled = true,
    updated_at = now();
end;
$$;

create or replace function public.verify_user_passcode(p_passcode text)
returns boolean
language plpgsql
security definer
as $$
declare
  v_hash text;
begin
  select passcode_hash into v_hash
  from public.user_auth_settings
  where user_id = auth.uid() and passcode_enabled = true;

  if v_hash is null then return false; end if;
  return v_hash = crypt(p_passcode, v_hash);
end;
$$;

-- ============================================================
-- 4. Function for passcode reset via email code
-- ============================================================
create or replace function public.set_passcode_reset_code(p_user_id uuid, p_code text)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.user_auth_settings (user_id, reset_code, reset_code_expires_at)
  values (p_user_id, p_code, now() + interval '15 minutes')
  on conflict (user_id)
  do update set
    reset_code = p_code,
    reset_code_expires_at = now() + interval '15 minutes',
    updated_at = now();
end;
$$;

create or replace function public.reset_passcode_with_code(p_code text, p_new_passcode text)
returns boolean
language plpgsql
security definer
as $$
declare
  v_row public.user_auth_settings%ROWTYPE;
begin
  select * into v_row
  from public.user_auth_settings
  where user_id = auth.uid()
    and reset_code = p_code
    and reset_code_expires_at > now();

  if not found then return false; end if;

  update public.user_auth_settings
  set passcode_hash = crypt(p_new_passcode, gen_salt('bf')),
      passcode_enabled = true,
      reset_code = null,
      reset_code_expires_at = null,
      updated_at = now()
  where user_id = auth.uid();

  return true;
end;
$$;

-- ============================================================
-- 5. Update profiles to add passcode_reset_code column shortcut
-- ============================================================
alter table public.profiles
  add column if not exists passcode_reset_sent_at timestamptz;
