
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  tag text,
  category text NOT NULL,
  duration text NOT NULL,
  difficulty text NOT NULL,
  intensity text,
  description text,
  target_audience text[],
  expected_effect text,
  rating numeric(2,1) DEFAULT 4.8,
  review_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_today_plan boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read courses"
  ON public.courses
  FOR SELECT
  TO authenticated
  USING (true);
