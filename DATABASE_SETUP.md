# Database Setup Instructions

## Supabase Database Schema

Run the following SQL commands in your Supabase SQL editor to set up the database:

```sql
-- Create User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles_um2024 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'specialist', 'admin')),
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'inactive')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects_um2024 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  project_info TEXT,
  specialist_name TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  emails_sent INTEGER DEFAULT 0,
  meetings_booked INTEGER DEFAULT 0,
  client_info JSONB DEFAULT '{"name": "", "email": "", "company": ""}',
  ideal_customer_profile JSONB DEFAULT '{"job_titles": [], "industry": [], "location": [], "company_size": [], "meeting_links": [], "campaign_offers": []}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Project Assignments Table (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS project_assignments_um2024 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles_um2024(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects_um2024(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles_um2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_um2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignments_um2024 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles_um2024
CREATE POLICY "Users can view their own profile" ON user_profiles_um2024
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" ON user_profiles_um2024
  FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Admins can view all profiles" ON user_profiles_um2024
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles_um2024 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow inserts for new users" ON user_profiles_um2024
  FOR INSERT WITH CHECK (true);

-- RLS Policies for projects_um2024
CREATE POLICY "Users can view assigned projects" ON projects_um2024
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_assignments_um2024 pa
      JOIN user_profiles_um2024 up ON pa.user_id = up.id
      WHERE pa.project_id = projects_um2024.id AND up.auth_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles_um2024 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Specialists and admins can update projects" ON projects_um2024
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM project_assignments_um2024 pa
      JOIN user_profiles_um2024 up ON pa.user_id = up.id
      WHERE pa.project_id = projects_um2024.id 
      AND up.auth_id = auth.uid() 
      AND up.role IN ('specialist', 'admin')
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles_um2024 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert projects" ON projects_um2024
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles_um2024 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for project_assignments_um2024
CREATE POLICY "Users can view their assignments" ON project_assignments_um2024
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles_um2024 
      WHERE id = user_id AND auth_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles_um2024 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage assignments" ON project_assignments_um2024
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles_um2024 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample data
INSERT INTO user_profiles_um2024 (email, name, role, status) VALUES
  ('admin@salesmate.com', 'System Admin', 'admin', 'active'),
  ('john.smith@techcorp.com', 'John Smith', 'client', 'active'),
  ('sarah.johnson@specialist.com', 'Sarah Johnson', 'specialist', 'active'),
  ('lisa.rodriguez@medtech.com', 'Dr. Lisa Rodriguez', 'client', 'active'),
  ('michael.chen@specialist.com', 'Michael Chen', 'specialist', 'active');

INSERT INTO projects_um2024 (project_name, project_info, specialist_name, progress, emails_sent, meetings_booked, client_info, ideal_customer_profile) VALUES
  (
    'Digital Marketing Campaign',
    'Q4 lead generation campaign targeting SaaS companies in North America',
    'Sarah Johnson',
    45,
    127,
    8,
    '{"name": "John Smith", "email": "john.smith@techcorp.com", "company": "TechCorp Solutions"}',
    '{"job_titles": ["Marketing Director", "VP of Marketing"], "industry": ["SaaS", "Technology", "Software"], "location": ["North America", "United States", "Canada"], "company_size": ["50-500 employees", "$5M-$50M ARR"], "meeting_links": ["https://calendly.com/meeting1"], "campaign_offers": ["Free Marketing Audit", "30-day trial"]}'
  ),
  (
    'Healthcare Outreach',
    'B2B outreach campaign for healthcare technology solutions',
    'Michael Chen',
    25,
    45,
    3,
    '{"name": "Dr. Lisa Rodriguez", "email": "lisa.rodriguez@medtech.com", "company": "MedTech Innovations"}',
    '{"job_titles": ["Chief Medical Officer", "Healthcare Administrator"], "industry": ["Healthcare", "Medical Technology"], "location": ["United States", "Canada"], "company_size": ["100-1000 employees"], "meeting_links": ["https://calendly.com/healthcare-demo"], "campaign_offers": ["Free consultation", "ROI analysis"]}'
  );

-- Create project assignments
INSERT INTO project_assignments_um2024 (user_id, project_id)
SELECT 
  up.id,
  p.id
FROM user_profiles_um2024 up
CROSS JOIN projects_um2024 p
WHERE 
  (up.email = 'john.smith@techcorp.com' AND p.project_name = 'Digital Marketing Campaign') OR
  (up.email = 'sarah.johnson@specialist.com' AND p.project_name = 'Digital Marketing Campaign') OR
  (up.email = 'lisa.rodriguez@medtech.com' AND p.project_name = 'Healthcare Outreach') OR
  (up.email = 'michael.chen@specialist.com' AND p.project_name = 'Healthcare Outreach');
```

## Setup Steps

1. **Create a Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Get Your Credentials**: Copy your Project URL and Anon Key from the project settings
3. **Update Configuration**: Replace the placeholder values in `src/lib/supabase.js`
4. **Run SQL Schema**: Execute the SQL commands above in your Supabase SQL editor
5. **Enable Authentication**: In Supabase Dashboard > Authentication > Settings, disable email confirmation for easier testing

## Test Accounts

After running the setup, you can test with these accounts:

- **Admin**: admin@salesmate.com
- **Client**: john.smith@techcorp.com  
- **Specialist**: sarah.johnson@specialist.com

Create passwords for these accounts through Supabase Auth or use the sign-up flow.

## Features

- **Role-based Access Control**: Clients see only their projects, specialists see assigned projects
- **User Invitation System**: Invite clients and specialists via email
- **Project Assignment**: Assign users to specific projects
- **Secure Authentication**: Supabase Auth with RLS policies