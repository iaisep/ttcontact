
-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  last_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS contacts_name_idx ON contacts (name);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts (email);
CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON contacts (user_id);

-- Set up Row Level Security (RLS) policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own contacts
CREATE POLICY contacts_select_policy ON contacts
  FOR SELECT USING (user_id = auth.uid());

-- Create policy to allow users to insert their own contacts
CREATE POLICY contacts_insert_policy ON contacts
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create policy to allow users to update only their own contacts
CREATE POLICY contacts_update_policy ON contacts
  FOR UPDATE USING (user_id = auth.uid());

-- Create policy to allow users to delete only their own contacts
CREATE POLICY contacts_delete_policy ON contacts
  FOR DELETE USING (user_id = auth.uid());

-- Add function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER contacts_updated_at_trigger
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
