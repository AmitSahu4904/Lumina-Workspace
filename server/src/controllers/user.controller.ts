import { Response, NextFunction } from 'express';
import { profileRepository } from '../repositories/profile.repository';
import { memberRepository } from '../repositories/member.repository';
import { success } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { BadRequestError } from '../utils/errors';

export class UserController {
  search = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.user?.id;
      if (!currentUserId) throw new BadRequestError('User context missing');

      const email = req.query.email as string;
      if (!email || email.trim().length < 2) {
        throw new BadRequestError('Search query must be at least 2 characters');
      }

      const excludeProjectId = req.query.excludeProjectId as string | undefined;
      const excludeIds: string[] = [currentUserId];

      if (excludeProjectId) {
        // Find existing project members to exclude them from results
        const existingMembers = await memberRepository.findByProject(excludeProjectId);
        existingMembers.forEach((member) => {
          excludeIds.push(member.user_id);
        });
      }

      const users = await profileRepository.searchByEmail(email, excludeIds);
      return success(res, users, 200);
    } catch (err) {
      return next(err);
    }
  };
}

export const userController = new UserController();
export default userController;
