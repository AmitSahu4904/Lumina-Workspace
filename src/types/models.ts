import { MemberRole, TaskStatus, TaskPriority } from './enums';

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
  members_count: number;
  tasks_count: number;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  profile: Profile;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: string | null;
  created_by: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assignee?: Profile | null;
}

export interface DashboardStats {
  total_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentProjects: Project[];
}
