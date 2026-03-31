CREATE POLICY "Anyone can read courses"
  ON public.courses
  FOR SELECT
  TO anon
  USING (true);