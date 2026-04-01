
CREATE TABLE public.course_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  locale text NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  duration text,
  expected_effect text,
  target_audience text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (course_id, locale)
);

ALTER TABLE public.course_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read course translations"
  ON public.course_translations
  FOR SELECT
  TO anon, authenticated
  USING (true);
