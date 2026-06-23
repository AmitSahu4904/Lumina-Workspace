import { supabaseAdmin } from '../config/supabase';
import { ProjectMember, MemberRole } from '../types/models';

export class MemberRepository {
  async findMember(projectId: string, userId: string): Promise<ProjectMember | null> {
    const { data, error } = await supabaseAdmin
      .from('project_members')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByProject(projectId: string): Promise<ProjectMember[]> {
    // Select project members and join with profiles
    const { data, error } = await supabaseAdmin
      .from('project_members')
      .select(`
        id,
        project_id,
        user_id,
        role,
        joined_at,
        profile:profiles (
          id,
          email,
          name,
          avatar_url,
          created_at,
          updated_at
        )
      `)
      .eq('project_id', projectId)
      .order('joined_at', { ascending: true })
      .limit(100); // Hard MVP limit

    if (error) throw error;
    return (data as any) || [];
  }

  async addMember(projectId: string, userId: string, role: MemberRole = 'MEMBER'): Promise<ProjectMember> {
    const { data, error } = await supabaseAdmin
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: userId,
        role,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}

export const memberRepository = new MemberRepository();
export default memberRepository;
