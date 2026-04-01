-- Super admin helper function
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_signups ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_super_admin());
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_super_admin());
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE
  USING (public.is_super_admin());

-- Owner-access policies for all data tables
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'farms','crops','harvests','inventory','animals','transactions',
    'export_orders','clients','staff_members','staff_payments',
    'requisitions','purchase_orders','notifications','documents',
    'messages','announcements','departments'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_owner_all" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_owner_all" ON public.%I FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())', tbl, tbl);
  END LOOP;
END $$;

-- PENDING SIGNUPS
DROP POLICY IF EXISTS "pending_signups_insert" ON public.pending_signups;
DROP POLICY IF EXISTS "pending_signups_select" ON public.pending_signups;
DROP POLICY IF EXISTS "pending_signups_delete" ON public.pending_signups;
DROP POLICY IF EXISTS "pending_signups_update" ON public.pending_signups;

CREATE POLICY "pending_signups_insert" ON public.pending_signups FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "pending_signups_select" ON public.pending_signups FOR SELECT
  USING (user_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "pending_signups_delete" ON public.pending_signups FOR DELETE
  USING (public.is_super_admin());
CREATE POLICY "pending_signups_update" ON public.pending_signups FOR UPDATE
  USING (public.is_super_admin());
