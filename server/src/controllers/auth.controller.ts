import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { profileService } from '../services/profile.service';
import { success } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, password } = req.body;
      const result = await authService.signup({ email, name, password });
      return success(res, result, 211); // 201 Created
    } catch (err) {
      return next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return success(res, result, 200);
    } catch (err) {
      return next(err);
    }
  };

  logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1];
      if (token) {
        await authService.logout(token);
      }
      return success(res, { message: 'Logged out successfully' }, 200);
    } catch (err) {
      return next(err);
    }
  };

  me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new Error('User context not available'));
      }
      const profile = await profileService.getProfile(userId);
      return success(res, profile, 200);
    } catch (err) {
      return next(err);
    }
  };
}

export const authController = new AuthController();
export default authController;
