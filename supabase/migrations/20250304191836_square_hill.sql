/*
  # Initial Schema Setup for Lender Launch 2.0

  1. New Tables
    - `users` - Stores user accounts with authentication details
    - `lenders` - Stores lender information and loan parameters
    - `criteria_sheets` - Stores criteria sheet documents for lenders
    - `favorites` - Stores user favorite lenders

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create lenders table
CREATE TABLE IF NOT EXISTS lenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text,
  website_link text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  min_rate numeric NOT NULL,
  max_rate numeric NOT NULL,
  min_loan integer NOT NULL,
  max_loan integer NOT NULL,
  min_term integer NOT NULL,
  max_term integer NOT NULL,
  min_age integer NOT NULL,
  max_age integer NOT NULL,
  min_loan_processing_time integer NOT NULL,
  max_loan_processing_time integer NOT NULL,
  min_decision_time integer NOT NULL,
  max_decision_time integer NOT NULL,
  min_trading_period integer NOT NULL,
  max_loan_to_value integer NOT NULL,
  personal_guarantee boolean NOT NULL,
  early_repayment_charges boolean NOT NULL,
  interest_treatment text NOT NULL,
  covered_location text[] NOT NULL,
  loan_types text[] NOT NULL,
  additional_info text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create criteria_sheets table
CREATE TABLE IF NOT EXISTS criteria_sheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_id uuid REFERENCES lenders(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  upload_date timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  lender_id uuid REFERENCES lenders(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lender_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create default admin user
INSERT INTO users (username, password, is_admin)
VALUES ('admin', 'LenderLaunch2025^%$', true)
ON CONFLICT (username) DO NOTHING;

-- Create policies for users table
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update users"
  ON users
  FOR UPDATE
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Create policies for lenders table
CREATE POLICY "Anyone can read lenders"
  ON lenders
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert lenders"
  ON lenders
  FOR INSERT
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update lenders"
  ON lenders
  FOR UPDATE
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete lenders"
  ON lenders
  FOR DELETE
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Create policies for criteria_sheets table
CREATE POLICY "Anyone can read criteria sheets"
  ON criteria_sheets
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert criteria sheets"
  ON criteria_sheets
  FOR INSERT
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update criteria sheets"
  ON criteria_sheets
  FOR UPDATE
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete criteria sheets"
  ON criteria_sheets
  FOR DELETE
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Create policies for favorites table
CREATE POLICY "Users can read their own favorites"
  ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);