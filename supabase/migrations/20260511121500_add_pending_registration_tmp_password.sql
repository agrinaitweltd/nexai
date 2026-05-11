alter table public.pending_registrations
  add column if not exists _tmp_password text;

notify pgrst, 'reload schema';
