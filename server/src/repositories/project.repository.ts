import { supabaseAdmin } from '../config/supabase';
import { Project } from '../types/models';

export class ProjectRepository {
  async findById(id: string): Promise<Project | null> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async findByUser(userId: string, search?: string): Promise<Project[]> {
    // 1. Get project ids where the user is a member
    const { data: memberRows, error: memberError } = await supabaseAdmin
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId);

    if (memberError) throw memberError;
    if (!memberRows || memberRows.length === 0) return [];

    const projectIds = memberRows.map((r) => r.project_id);

    // 2. Fetch projects matching those IDs
    let query = supabaseAdmin
      .from('projects')
      .select('*')
      .in('id', projectIds)
      .order('updated_at', { ascending: false })
      .limit(50); // Hard MVP limit

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data: projects, error: projectsError } = await query;
    if (projectsError) throw projectsError;

    // 3. For each project, fetch counts of members and tasks
    // Since this is MVP and limited to 50 projects, doing counts in parallel is fine.
    const enrichedProjects = await Promise.all(
      (projects || []).map(async (project) => {
        // Members count
        const { count: membersCount, error: mcError } = await supabaseAdmin
          .from('project_members')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', project.id);

        // Tasks count
        const { count: tasksCount, error: tcError } = await supabaseAdmin
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', project.id);

        return {
          ...project,
          members_count: mcError ? 0 : membersCount || 0,
          tasks_count: tcError ? 0 : tasksCount || 0,
        };
      })
    );

    return enrichedProjects;
  }

  async create(project: { title: string; description?: string | null; owner_id: string }): Promise<Project> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        title: project.title,
        description: project.description || null,
        owner_id: project.owner_id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Pick<Project, 'title' | 'description'>>): Promise<Project> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async countDashboardStats(userId: string) {
    // 1. Get projects user belongs to
    const { data: memberRows, error: memberError } = await supabaseAdmin
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId);

    if (memberError) throw memberError;
    const projectIds = memberRows?.map((r) => r.project_id) || [];

    const totalProjects = projectIds.length;

    if (totalProjects === 0) {
      return {
        total_projects: 0,
        total_tasks: 0,
        completed_tasks: 0,
        pending_tasks: 0,
      };
    }

    // 2. Fetch task counts for these project IDs
    const { count: completedTasks, error: ctError } = await supabaseAdmin
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .in('project_id', projectIds)
      .eq('status', 'DONE');

    const { count: totalTasks, error: ttError } = await supabaseAdmin
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .in('project_id', projectIds);

    if (ctError) throw ctError;
    if (ttError) throw ttError;

    const total_tasks = totalTasks || 0;
    const completed_tasks = completedTasks || 0;

    return {
      total_projects: totalProjects,
      total_tasks,
      completed_tasks,
      pending_tasks: total_tasks - completed_tasks,
    };
  }

  async getRecentProjects(userId: string, limit = 5): Promise<Project[]> {
    const { data: memberRows, error: memberError } = await supabaseAdmin
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId);

    if (memberError) throw memberError;
    const projectIds = memberRows?.map((r) => r.project_id) || [];

    if (projectIds.length === 0) return [];

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .in('id', projectIds)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}

export const projectRepository = new ProjectRepository();
export default projectRepository;
