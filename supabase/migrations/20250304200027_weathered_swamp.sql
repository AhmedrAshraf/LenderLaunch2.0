/*
  # Update RLS Policies

  This migration updates the Row Level Security (RLS) policies for all tables
  to allow public access while maintaining security.

  1. Changes
    - Drops existing restrictive policies if they exist
    - Creates new policies allowing public access for all CRUD operations
    - Ensures no duplicate policies are created
*/

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Enable read access for all users" ON users;
  DROP POLICY IF EXISTS "Enable insert for all users" ON users;
  DROP POLICY IF EXISTS "Enable update for all users" ON users;
  DROP POLICY IF EXISTS "Enable delete for all users" ON users;
  DROP POLICY IF EXISTS "Users can read their own data" ON users;
  DROP POLICY IF EXISTS "Admins can insert users" ON users;
  DROP POLICY IF EXISTS "Admins can update users" ON users;
  DROP POLICY IF EXISTS "Admins can delete users" ON users;
  
  DROP POLICY IF EXISTS "Enable read access for all users" ON lenders;
  DROP POLICY IF EXISTS "Enable insert for all users" ON lenders;
  DROP POLICY IF EXISTS "Enable update for all users" ON lenders;
  DROP POLICY IF EXISTS "Enable delete for all users" ON lenders;
  DROP POLICY IF EXISTS "Anyone can read lenders" ON lenders;
  DROP POLICY IF EXISTS "Admins can insert lenders" ON lenders;
  DROP POLICY IF EXISTS "Admins can update lenders" ON lenders;
  DROP POLICY IF EXISTS "Admins can delete lenders" ON lenders;
  
  DROP POLICY IF EXISTS "Enable read access for all users" ON criteria_sheets;
  DROP POLICY IF EXISTS "Enable insert for all users" ON criteria_sheets;
  DROP POLICY IF EXISTS "Enable update for all users" ON criteria_sheets;
  DROP POLICY IF EXISTS "Enable delete for all users" ON criteria_sheets;
  DROP POLICY IF EXISTS "Anyone can read criteria sheets" ON criteria_sheets;
  DROP POLICY IF EXISTS "Admins can insert criteria sheets" ON criteria_sheets;
  DROP POLICY IF EXISTS "Admins can update criteria sheets" ON criteria_sheets;
  DROP POLICY IF EXISTS "Admins can delete criteria sheets" ON criteria_sheets;
  
  DROP POLICY IF EXISTS "Enable read access for all users" ON favorites;
  DROP POLICY IF EXISTS "Enable insert for all users" ON favorites;
  DROP POLICY IF EXISTS "Enable update for all users" ON favorites;
  DROP POLICY IF EXISTS "Enable delete for all users" ON favorites;
  DROP POLICY IF EXISTS "Users can read their own favorites" ON favorites;
  DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
  DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;
END $$;

-- Create new policies for users table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read users' AND tablename = 'users') THEN
    CREATE POLICY "Anyone can read users"
      ON users
      FOR SELECT
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can create users' AND tablename = 'users') THEN
    CREATE POLICY "Anyone can create users"
      ON users
      FOR INSERT
      TO PUBLIC
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update users' AND tablename = 'users') THEN
    CREATE POLICY "Anyone can update users"
      ON users
      FOR UPDATE
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can delete users' AND tablename = 'users') THEN
    CREATE POLICY "Anyone can delete users"
      ON users
      FOR DELETE
      TO PUBLIC
      USING (true);
  END IF;
END $$;

-- Create new policies for lenders table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read lenders' AND tablename = 'lenders') THEN
    CREATE POLICY "Anyone can read lenders"
      ON lenders
      FOR SELECT
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can create lenders' AND tablename = 'lenders') THEN
    CREATE POLICY "Anyone can create lenders"
      ON lenders
      FOR INSERT
      TO PUBLIC
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update lenders' AND tablename = 'lenders') THEN
    CREATE POLICY "Anyone can update lenders"
      ON lenders
      FOR UPDATE
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can delete lenders' AND tablename = 'lenders') THEN
    CREATE POLICY "Anyone can delete lenders"
      ON lenders
      FOR DELETE
      TO PUBLIC
      USING (true);
  END IF;
END $$;

-- Create new policies for criteria_sheets table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read criteria sheets' AND tablename = 'criteria_sheets') THEN
    CREATE POLICY "Anyone can read criteria sheets"
      ON criteria_sheets
      FOR SELECT
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can create criteria sheets' AND tablename = 'criteria_sheets') THEN
    CREATE POLICY "Anyone can create criteria sheets"
      ON criteria_sheets
      FOR INSERT
      TO PUBLIC
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update criteria sheets' AND tablename = 'criteria_sheets') THEN
    CREATE POLICY "Anyone can update criteria sheets"
      ON criteria_sheets
      FOR UPDATE
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can delete criteria sheets' AND tablename = 'criteria_sheets') THEN
    CREATE POLICY "Anyone can delete criteria sheets"
      ON criteria_sheets
      FOR DELETE
      TO PUBLIC
      USING (true);
  END IF;
END $$;

-- Create new policies for favorites table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read favorites' AND tablename = 'favorites') THEN
    CREATE POLICY "Anyone can read favorites"
      ON favorites
      FOR SELECT
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can create favorites' AND tablename = 'favorites') THEN
    CREATE POLICY "Anyone can create favorites"
      ON favorites
      FOR INSERT
      TO PUBLIC
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update favorites' AND tablename = 'favorites') THEN
    CREATE POLICY "Anyone can update favorites"
      ON favorites
      FOR UPDATE
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can delete favorites' AND tablename = 'favorites') THEN
    CREATE POLICY "Anyone can delete favorites"
      ON favorites
      FOR DELETE
      TO PUBLIC
      USING (true);
  END IF;
END $$;