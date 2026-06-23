import { supabaseAdmin } from '../config/supabase';
import { Profile } from '../types/models';

export class ProfileRepository {
  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // PostgREST not found error code
      throw error;
    }
    return data;
  }

  async findByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async create(profile: { id: string; email: string; name: string }): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: profile.id,
        email: profile.email.toLowerCase(),
        name: profile.name,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Pick<Profile, 'name' | 'avatar_url'>>): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async searchByEmail(email: string, excludeIds: string[]): Promise<Profile[]> {
    let query = supabaseAdmin
      .from('profiles')
      .select('id, email, name, avatar_url')
      .ilike('email', `%${email}%`)
      .limit(10);

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}

export const profileRepository = new ProfileRepository();
export default profileRepository;
