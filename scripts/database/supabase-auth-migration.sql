-- Add author tracking columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS author_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255);

-- Create index for author lookups
CREATE INDEX IF NOT EXISTS idx_posts_author_email ON posts(author_email);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
