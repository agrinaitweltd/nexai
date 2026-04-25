-- Add supplier payment tracking columns to inventory table
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS total_cost numeric;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS amount_paid_supplier numeric;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS supplier_id text;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS supplier_name text;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS purchase_reference text;
