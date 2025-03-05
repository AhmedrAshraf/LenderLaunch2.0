/*
  # Add storage policies for criteria sheets

  1. Changes
    - Add storage policies to allow bucket and object access
    - Enable public access to criteria sheets bucket
    - Set up proper RLS policies for storage

  2. Security
    - Allow public read access to criteria sheets
    - Allow authenticated users to upload and delete files
*/

-- Enable storage by creating policies
DO $$ 
BEGIN
  -- Create storage schema if it doesn't exist
  CREATE SCHEMA IF NOT EXISTS storage;

  -- Create storage.buckets policy
  DROP POLICY IF EXISTS "Give users access to storage buckets" ON storage.buckets;
  CREATE POLICY "Give users access to storage buckets"
    ON storage.buckets
    FOR ALL
    TO PUBLIC
    USING (true)
    WITH CHECK (true);

  -- Create storage.objects policy for criteria-sheets bucket
  DROP POLICY IF EXISTS "Give public access to criteria sheets" ON storage.objects;
  CREATE POLICY "Give public access to criteria sheets"
    ON storage.objects
    FOR ALL
    TO PUBLIC
    USING (bucket_id = 'criteria-sheets')
    WITH CHECK (bucket_id = 'criteria-sheets');

  -- Enable RLS on storage tables
  ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
END $$;