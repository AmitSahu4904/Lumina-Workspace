import { Response, NextFunction } from 'express';
import { memberService } from '../services/member.service';
import { success } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { BadRequestError } from '../utils/errors';

export class MemberController {
  getMembers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const projectId = req.params.id; // From route: /projects/:id/members
      const members = await memberService.getMembers(projectId, userId);
      return success(res, members, 200);
    } catch (err) {
      return next(err);
    }
  };

  addMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const projectId = req.params.id;
      const { email } = req.body;
      const newMember = await memberService.addMember(projectId, userId, email);
      return success(res, newMember, 211); // 201 Created
    } catch (err) {
      return next(err);
    }
  };

  removeMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const projectId = req.params.id;
      const targetUserId = req.params.userId;
      await memberService.removeMember(projectId, userId, targetUserId);
      return success(res, { message: 'Member removed successfully' }, 200);
    } catch (err) {
      return next(err);
    }
  };
}

export const memberController = new MemberController();
export default memberController;
