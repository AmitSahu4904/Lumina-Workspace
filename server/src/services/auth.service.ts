import { supabaseAdmin } from '../config/supabase';
import { profileRepository } from '../repositories/profile.repository';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { Profile } from '../types/models';

export class AuthService {
  async signup(signupData: { email: string; name: string; password: string }) {
    const { email, name, password } = signupData;

    // Check if user already exists in profiles
    const existing = await profileRepository.findByEmail(email);
    if (existing) {
      throw new BadRequestError('A user with this email already exists');
    }

    // 1. Create the user in Supabase Auth via Admin API (bypasses email confirmation delay)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError || !authData.user) {
      throw new BadRequestError(authError?.message || 'Failed to create user account');
    }

    let profile: Profile;
    try {
      // 2. Automatically create profile record
      profile = await profileRepository.create({
        id: authData.user.id,
        email,
        name,
      });
    } catch (dbError) {
      // Rollback auth user creation if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw dbError;
    }

    // 3. Log user in directly to return a session
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError || !sessionData.session) {
      throw new BadRequestError('User registered successfully, but automatic login failed');
    }

    return {
      user: profile,
      session: {
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        expires_at: sessionData.session.expires_at,
      },
    };
  }

  async login(loginData: { email: string; password: string }) {
    const { email, password } = loginData;

    // Authenticate with Supabase Auth
    const { data, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user || !data.session) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Retrieve profile details
    let profile = await profileRepository.findById(data.user.id);
    
    // Fallback: If auth user exists but profile row doesn't, create it
    if (!profile) {
      profile = await profileRepository.create({
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || 'User',
      });
    }

    return {
      user: profile,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    };
  }

  async logout(token: string): Promise<void> {
    // Invalidate session on Supabase
    const { error } = await supabaseAdmin.auth.admin.signOut(token);
    if (error) {
      // Log error but do not block client logout
      console.error('Supabase signOut error:', error.message);
    }
  }
}

export const authService = new AuthService();
export default authService;
