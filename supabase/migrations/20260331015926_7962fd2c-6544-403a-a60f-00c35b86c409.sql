
CREATE TABLE public.face_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  photo_url text NOT NULL,
  elasticity_score integer NOT NULL DEFAULT 0,
  health_grade varchar(2) NOT NULL DEFAULT 'C',
  nasolabial_level varchar(20) NOT NULL DEFAULT 'moderate',
  jawline_level varchar(20) NOT NULL DEFAULT 'moderate',
  eye_contour_score integer NOT NULL DEFAULT 0,
  analysis_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.face_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analyses" ON public.face_analyses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON public.face_analyses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
