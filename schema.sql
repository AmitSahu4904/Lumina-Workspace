-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE member_role AS ENUM ('OWNER', 'MEMBER');
CREATE TYPE task_status   AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- Tables

-- Profiles Table (Linked to Supabase Auth)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Projects Table
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 100),
  description TEXT CHECK (char_length(description) <= 500),
  owner_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Project Members Table
CREATE TABLE project_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role        member_role NOT NULL DEFAULT 'MEMBER',
  joined_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (project_id, user_id)
);

-- Tasks Table
CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 100),
  description TEXT CHECK (char_length(description) <= 1000),
  status      task_status   NOT NULL DEFAULT 'TODO',
  priority    task_priority NOT NULL DEFAULT 'MEDIUM',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id    ON project_members(user_id);
CREATE INDEX idx_tasks_project_id           ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to          ON tasks(assigned_to);
CREATE INDEX idx_tasks_status               ON tasks(status);
CREATE INDEX idx_projects_owner_id          ON projects(owner_id);

-- Triggers and updated_at hook
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updated_at = NOW(); 
  RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at  BEFORE UPDATE ON profiles  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_projects_updated_at  BEFORE UPDATE ON projects  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tasks_updated_at     BEFORE UPDATE ON tasks     FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Row Level Security (RLS) and Policies

-- Non-recursive helper function to check membership safely (bypasses RLS recursively via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION is_project_member(p_id UUID, u_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = p_id AND user_id = u_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks            ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_auth" ON profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id OR auth.role() = 'service_role');

-- Projects Policies
CREATE POLICY "projects_select_member" ON projects FOR SELECT
  USING (is_project_member(id, auth.uid()) OR auth.role() = 'service_role');

CREATE POLICY "projects_insert_auth" ON projects FOR INSERT 
  WITH CHECK (auth.uid() = owner_id OR auth.role() = 'service_role');

CREATE POLICY "projects_update_owner" ON projects FOR UPDATE
  USING (owner_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "projects_delete_owner" ON projects FOR DELETE
  USING (owner_id = auth.uid() OR auth.role() = 'service_role');

-- Project Members Policies
CREATE POLICY "members_select_member" ON project_members FOR SELECT
  USING (is_project_member(project_id, auth.uid()) OR auth.role() = 'service_role');

CREATE POLICY "members_insert_owner" ON project_members FOR INSERT
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()) OR auth.role() = 'service_role');

CREATE POLICY "members_delete_owner" ON project_members FOR DELETE
  USING (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()) OR auth.role() = 'service_role');

-- Tasks Policies
CREATE POLICY "tasks_select_member" ON tasks FOR SELECT
  USING (is_project_member(project_id, auth.uid()) OR auth.role() = 'service_role');

CREATE POLICY "tasks_insert_member" ON tasks FOR INSERT
  WITH CHECK (is_project_member(project_id, auth.uid()) OR auth.role() = 'service_role');

CREATE POLICY "tasks_update_member" ON tasks FOR UPDATE
  USING (is_project_member(project_id, auth.uid()) OR auth.role() = 'service_role');

CREATE POLICY "tasks_delete_member" ON tasks FOR DELETE
  USING (is_project_member(project_id, auth.uid()) OR auth.role() = 'service_role');

-- Realtime configuration
begin;
  -- remove the tables from the publication first if they exist to avoid errors
  alter publication supabase_realtime drop table if exists projects, project_members, tasks;
  -- add tables
  alter publication supabase_realtime add table projects;
  alter publication supabase_realtime add table project_members;
  alter publication supabase_realtime add table tasks;
commit;

-- Storage bucket for avatars
-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage objects
CREATE POLICY "avatar_upload_own" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatar_update_own" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatar_select_all" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
