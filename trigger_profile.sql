-- Auto-create profile row when a new auth user is created
-- This runs server-side and bypasses RLS, fixing the signup error
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, role, phone, country, sector,
    business_category, business_type, company_name,
    preferred_currency, dashboard_theme, setup_complete,
    activation_status, rejection_count
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'ADMIN'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'country',
    COALESCE(NEW.raw_user_meta_data->>'sector', 'GENERAL'),
    NEW.raw_user_meta_data->>'business_category',
    NEW.raw_user_meta_data->>'business_type',
    NEW.raw_user_meta_data->>'company_name',
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'USD'),
    'emerald',
    false,
    COALESCE(NEW.raw_user_meta_data->>'activation_status', 'PENDING'),
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
