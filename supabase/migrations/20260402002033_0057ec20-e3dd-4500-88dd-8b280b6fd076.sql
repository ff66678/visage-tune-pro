-- S2: Add onboarding answer fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_goal text,
  ADD COLUMN IF NOT EXISTS skin_type text,
  ADD COLUMN IF NOT EXISTS concerns text[],
  ADD COLUMN IF NOT EXISTS preferred_time text;

-- M5: Tighten profiles RLS from public to authenticated
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);