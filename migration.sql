-- ============================================================
-- NEXA COMPREHENSIVE MIGRATION
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- HELPER: Super-admin check function
-- ============================================================
create or replace function public.is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'SUPER_ADMIN'
  );
$$ language sql security definer stable;

-- ============================================================
-- 1. PROFILES (extended, linked to auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'ADMIN',
  phone text,
  country text,
  sector text default 'GENERAL',
  business_category text,
  business_type text,
  company_name text,
  company_address text,
  employee_count text,
  contact_email text,
  setup_complete boolean default false,
  tutorial_completed boolean default false,
  theme text default 'dark',
  dashboard_theme text default 'emerald',
  dashboard_widgets jsonb default '[]'::jsonb,
  subscription_plan text,
  preferred_currency text default 'USD',
  initial_balance numeric default 0,
  activation_status text default 'PENDING',
  rejection_count integer default 0,
  reg_number text,
  tin text,
  directors text,
  business_size text,
  ucda_number text,
  assigned_farm_ids text[] default '{}',
  department_id text,
  permissions text[] default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- 2. FARMS
-- ============================================================
create table if not exists public.farms (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  location text,
  size text,
  farming_type text default 'CROP',
  staff_ids text[] default '{}',
  initial_assets text[] default '{}',
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- 3. CROPS
-- ============================================================
create table if not exists public.crops (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id text not null,
  name text not null,
  variety text,
  status text default 'PLANTED',
  planted_date timestamptz default now(),
  created_at timestamptz default now()
);

-- ============================================================
-- 4. HARVESTS
-- ============================================================
create table if not exists public.harvests (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id text,
  crop_id text,
  crop_name text,
  grade text,
  quantity numeric not null,
  unit text default 'kg',
  date timestamptz default now(),
  status text default 'COLLECTED',
  notes text,
  history jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- 5. INVENTORY
-- ============================================================
create table if not exists public.inventory (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_name text not null,
  grade text,
  quantity numeric not null default 0,
  unit text default 'kg',
  location text default 'Main Warehouse',
  last_updated timestamptz default now(),
  cost_per_unit numeric,
  low_stock_threshold numeric,
  created_at timestamptz default now()
);

-- ============================================================
-- 6. ANIMALS
-- ============================================================
create table if not exists public.animals (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  breed text,
  quantity integer not null default 0,
  status text default 'HEALTHY',
  location text,
  age text,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- 7. TRANSACTIONS
-- ============================================================
create table if not exists public.transactions (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  category text,
  amount numeric not null,
  description text,
  date timestamptz default now(),
  payment_method text,
  reference text,
  created_at timestamptz default now()
);

-- ============================================================
-- 8. EXPORT ORDERS
-- ============================================================
create table if not exists public.export_orders (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_type text default 'EXPORT',
  client_id text,
  buyer_name text,
  buyer_country text,
  buyer_email text,
  buyer_phone text,
  product_name text,
  grade text,
  quantity numeric,
  unit text,
  price_per_unit numeric,
  status text default 'PENDING',
  shipment_number text,
  shipping_cost numeric default 0,
  total_value numeric default 0,
  amount_paid numeric default 0,
  date timestamptz default now(),
  origin_warehouse text,
  origin_location text,
  destination_port text,
  destination_country text,
  transit_ports text,
  transport_provider text,
  transport_method text,
  port_of_exit text,
  created_at timestamptz default now()
);

-- ============================================================
-- 9. CLIENTS
-- ============================================================
create table if not exists public.clients (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text default 'BUYER',
  country text,
  email text,
  phone text,
  total_orders integer default 0,
  total_value numeric default 0,
  joined_date timestamptz default now(),
  created_at timestamptz default now()
);

-- ============================================================
-- 10. STAFF MEMBERS
-- ============================================================
create table if not exists public.staff_members (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  role text,
  salary numeric default 0,
  currency text default 'UGX',
  frequency text default 'MONTHLY',
  phone text,
  email text,
  assigned_farm_ids text[] default '{}',
  department_id text,
  status text default 'ACTIVE',
  joined_date timestamptz default now(),
  permissions text[] default '{}',
  tasks jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- 11. STAFF PAYMENTS
-- ============================================================
create table if not exists public.staff_payments (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  staff_id text,
  staff_name text,
  amount numeric not null,
  date timestamptz default now(),
  period text,
  method text,
  reference text,
  created_at timestamptz default now()
);

-- ============================================================
-- 12. REQUISITIONS
-- ============================================================
create table if not exists public.requisitions (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  staff_id text,
  staff_name text,
  farm_id text,
  amount numeric not null,
  reason text,
  category text,
  status text default 'PENDING',
  priority text default 'STANDARD',
  date timestamptz default now(),
  created_at timestamptz default now()
);

-- ============================================================
-- 13. PURCHASE ORDERS
-- ============================================================
create table if not exists public.purchase_orders (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  supplier_id text,
  supplier_name text,
  date timestamptz default now(),
  expected_date timestamptz,
  status text default 'PENDING_APPROVAL',
  items jsonb default '[]'::jsonb,
  total_amount numeric default 0,
  amount_paid numeric default 0,
  payment_status text default 'UNPAID',
  order_number text,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- 14. NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  read boolean default false,
  date timestamptz default now(),
  type text default 'INFO',
  link text,
  created_at timestamptz default now()
);

-- ============================================================
-- 15. DOCUMENTS
-- ============================================================
create table if not exists public.documents (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  doc_type text,
  category text,
  size text,
  date timestamptz default now(),
  url text,
  uploaded_by text,
  created_at timestamptz default now()
);

-- ============================================================
-- 16. MESSAGES
-- ============================================================
create table if not exists public.messages (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  sender_id text,
  sender_name text,
  subject text,
  content text,
  date timestamptz default now(),
  read boolean default false,
  msg_type text default 'INBOX',
  priority text,
  created_at timestamptz default now()
);

-- ============================================================
-- 17. ANNOUNCEMENTS
-- ============================================================
create table if not exists public.announcements (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text,
  date timestamptz default now(),
  author text,
  priority text default 'LOW',
  created_at timestamptz default now()
);

-- ============================================================
-- 18. DEPARTMENTS
-- ============================================================
create table if not exists public.departments (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  manager_id text,
  created_at timestamptz default now()
);

-- ============================================================
-- 19. PENDING SIGNUPS (admin approval queue)
-- ============================================================
create table if not exists public.pending_signups (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text,
  user_email text,
  transaction_id text,
  payment_phone text,
  payment_method text,
  bank_name text,
  account_name text,
  date timestamptz default now(),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.crops enable row level security;
alter table public.harvests enable row level security;
alter table public.inventory enable row level security;
alter table public.animals enable row level security;
alter table public.transactions enable row level security;
alter table public.export_orders enable row level security;
alter table public.clients enable row level security;
alter table public.staff_members enable row level security;
alter table public.staff_payments enable row level security;
alter table public.requisitions enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.notifications enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;
alter table public.announcements enable row level security;
alter table public.departments enable row level security;
alter table public.pending_signups enable row level security;

-- PROFILES policies
create policy "profiles_select" on public.profiles for select
  using (id = auth.uid() or public.is_super_admin());
create policy "profiles_insert" on public.profiles for insert
  with check (id = auth.uid());
create policy "profiles_update" on public.profiles for update
  using (id = auth.uid() or public.is_super_admin());
create policy "profiles_delete" on public.profiles for delete
  using (public.is_super_admin());

-- Generic owner-access policy for all data tables
do $$
declare
  tbl text;
begin
  for tbl in select unnest(array[
    'farms','crops','harvests','inventory','animals','transactions',
    'export_orders','clients','staff_members','staff_payments',
    'requisitions','purchase_orders','notifications','documents',
    'messages','announcements','departments'
  ]) loop
    execute format('create policy "%s_owner_all" on public.%I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', tbl, tbl);
  end loop;
end $$;

-- PENDING SIGNUPS: users can insert their own, super admin can manage all
create policy "pending_signups_insert" on public.pending_signups for insert
  with check (user_id = auth.uid());
create policy "pending_signups_select" on public.pending_signups for select
  using (user_id = auth.uid() or public.is_super_admin());
create policy "pending_signups_delete" on public.pending_signups for delete
  using (public.is_super_admin());
create policy "pending_signups_update" on public.pending_signups for update
  using (public.is_super_admin());