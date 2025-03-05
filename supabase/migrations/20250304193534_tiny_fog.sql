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
CREATE POLICY "Enable read access for all users"
  ON users
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON users
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON users
  FOR UPDATE
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable delete for all users"
  ON users
  FOR DELETE
  TO PUBLIC
  USING (true);

-- Create policies for lenders table
CREATE POLICY "Enable read access for all users"
  ON lenders
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON lenders
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON lenders
  FOR UPDATE
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable delete for all users"
  ON lenders
  FOR DELETE
  TO PUBLIC
  USING (true);

-- Create policies for criteria_sheets table
CREATE POLICY "Enable read access for all users"
  ON criteria_sheets
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON criteria_sheets
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON criteria_sheets
  FOR UPDATE
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable delete for all users"
  ON criteria_sheets
  FOR DELETE
  TO PUBLIC
  USING (true);

-- Create policies for favorites table
CREATE POLICY "Enable read access for all users"
  ON favorites
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON favorites
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON favorites
  FOR UPDATE
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable delete for all users"
  ON favorites
  FOR DELETE
  TO PUBLIC
  USING (true);