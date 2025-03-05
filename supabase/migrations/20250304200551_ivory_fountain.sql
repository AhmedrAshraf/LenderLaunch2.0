/*
  # Add Last Login Tracking

  This migration adds last login tracking functionality to the users table.

  1. Changes
    - Add last_login column to users table
    - Add function to update last_login timestamp
*/

-- Add last_login column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE users ADD COLUMN last_login timestamptz;
  END IF;
END $$;