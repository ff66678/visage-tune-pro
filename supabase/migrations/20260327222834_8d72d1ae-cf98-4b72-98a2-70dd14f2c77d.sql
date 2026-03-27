
-- Create progress_photos table
CREATE TABLE public.progress_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, photo_date)
);

-- Enable RLS
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

-- Users can view their own photos
CREATE POLICY "Users can view own photos"
  ON public.progress_photos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own photos
CREATE POLICY "Users can insert own photos"
  ON public.progress_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own photos (re-take for same day)
CREATE POLICY "Users can update own photos"
  ON public.progress_photos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true);

-- Storage RLS: users can upload to their own folder
CREATE POLICY "Users can upload progress photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage RLS: anyone can view (public bucket)
CREATE POLICY "Public can view progress photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'progress-photos');

-- Storage RLS: users can update their own photos
CREATE POLICY "Users can update own progress photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
