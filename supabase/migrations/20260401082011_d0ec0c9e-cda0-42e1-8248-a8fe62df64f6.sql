
CREATE TABLE public.product_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  locale text NOT NULL,
  name text NOT NULL,
  description text,
  tag text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, locale)
);

ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product translations"
  ON public.product_translations FOR SELECT
  TO anon, authenticated
  USING (true);
