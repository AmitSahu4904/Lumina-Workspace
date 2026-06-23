import { supabaseAdmin } from '../config/supabase';
import { Task } from '../types/models';

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  assignedTo?: string;
}

export class TaskRepository {
  async findById(id: string): Promise<Task | null> {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assigned_to_fkey (id, email, name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as any;
  }

  async findByProject(projectId: string, filters: TaskFilters): Promise<Task[]> {
    let query = supabaseAdmin
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assigned_to_fkey (id, email, name, avatar_url)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(200); // Hard MVP limit

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.assignedTo) {
      if (filters.assignedTo === 'null') {
        query = query.is('assigned_to', null);
      } else {
        query = query.eq('assigned_to', filters.assignedTo);
      }
    }
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as any) || [];
  }

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert(task)
      .select(`
        *,
        assignee:profiles!tasks_assigned_to_fkey (id, email, name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data as any;
  }

  async update(id: string, updates: Partial<Omit<Task, 'id' | 'project_id' | 'created_by' | 'created_at' | 'updated_at'>>): Promise<Task> {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        assignee:profiles!tasks_assigned_to_fkey (id, email, name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data as any;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const taskRepository = new TaskRepository();
export default taskRepository;
