-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL CHECK (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  subject text NOT NULL,
  message text NOT NULL,
  lang text,
  source_ip text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX idx_contact_submissions_email ON contact_submissions (email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions (created_at);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow new submissions to be created
CREATE POLICY "Allow anonymous submissions" ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow admin to read submissions
CREATE POLICY "Allow admin to read submissions" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'admin');

-- Prevent anonymous updates
CREATE POLICY "Prevent anonymous updates" ON contact_submissions
  FOR UPDATE
  TO anon
  WITH CHECK (false);

-- Prevent anonymous deletes
CREATE POLICY "Prevent anonymous deletes" ON contact_submissions
  FOR DELETE
  TO anon
  USING (false);

-- Function to clean up old submissions
CREATE OR REPLACE FUNCTION delete_old_submissions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM contact_submissions
  WHERE created_at < now() - INTERVAL '6 months';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to clean up old submissions
CREATE TRIGGER cleanup_old_submissions
AFTER INSERT ON contact_submissions
EXECUTE FUNCTION delete_old_submissions();
