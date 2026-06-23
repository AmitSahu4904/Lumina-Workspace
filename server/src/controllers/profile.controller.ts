import { Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';
import { success } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { BadRequestError } from '../utils/errors';

export class ProfileController {
  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const profile = await profileService.getProfile(userId);
      return success(res, profile, 200);
    } catch (err) {
      return next(err);
    }
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const { name } = req.body;
      const updatedProfile = await profileService.updateProfile(userId, name);
      return success(res, updatedProfile, 200);
    } catch (err) {
      return next(err);
    }
  };

  uploadAvatar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const file = req.file;
      if (!file) {
        throw new BadRequestError('No avatar file provided');
      }

      const avatarUrl = await profileService.uploadAvatar(userId, file);
      return success(res, { avatar_url: avatarUrl }, 200);
    } catch (err) {
      return next(err);
    }
  };
}

export const profileController = new ProfileController();
export default profileController;
