-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url VARCHAR(500),
  cover_image_alt VARCHAR(255),
  tags TEXT[],
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for slug and published status
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read of published posts
CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT
  USING (published = TRUE);

-- Policy: Admin can do everything
-- This will be handled by the service role key on the backend

-- Create storage bucket for covers
INSERT INTO storage.buckets (id, name)
VALUES ('covers', 'covers')
ON CONFLICT DO NOTHING;

-- Allow public read from covers bucket
CREATE POLICY "Public can view cover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

-- Service role can upload to covers (handled via API)
-- No policy needed - service role bypasses RLS
