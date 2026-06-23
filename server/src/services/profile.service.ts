import { profileRepository } from '../repositories/profile.repository';
import { supabaseAdmin } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';
import { Profile } from '../types/models';

export class ProfileService {
  async getProfile(userId: string): Promise<Profile> {
    const profile = await profileRepository.findById(userId);
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, name: string): Promise<Profile> {
    // Update profile database row
    const profile = await profileRepository.update(userId, { name });

    // Update Supabase Auth user metadata as well
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { name },
    });
    if (authError) {
      console.error('Failed to update auth metadata for user:', userId, authError.message);
    }

    return profile;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<string> {
    const profile = await this.getProfile(userId);

    // 1. Best-effort delete of previous avatar
    if (profile.avatar_url) {
      try {
        const oldPath = this.extractStoragePath(profile.avatar_url);
        if (oldPath) {
          await supabaseAdmin.storage.from('avatars').remove([oldPath]);
        }
      } catch (err) {
        // Log deletion error but don't fail upload
        console.error('Failed to delete old avatar file:', err);
      }
    }

    // 2. Upload new avatar file
    const fileExtension = file.originalname.split('.').pop() || 'png';
    const filePath = `${userId}/${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false, // Use false to enforce unique timestamped path
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new AppError('Avatar file upload failed', 500);
    }

    // 3. Get the public URL of the uploaded file
    const { data } = supabaseAdmin.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // 4. Update the profile row with the new avatar URL
    await profileRepository.update(userId, { avatar_url: publicUrl });

    return publicUrl;
  }

  private extractStoragePath(publicUrl: string): string | null {
    try {
      const marker = '/storage/v1/object/public/avatars/';
      const index = publicUrl.indexOf(marker);
      if (index === -1) return null;
      return decodeURIComponent(publicUrl.substring(index + marker.length));
    } catch {
      return null;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;
