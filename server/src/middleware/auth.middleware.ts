import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { UnauthorizedError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Missing or invalid Authorization header'));
    }

    const token = authHeader.split(' ')[1];
    
    // Validate the token directly with Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return next(new UnauthorizedError(error?.message || 'Invalid or expired session'));
    }

    // Attach authenticated user information to request object
    req.user = {
      id: user.id,
      email: user.email,
    };

    return next();
  } catch (err) {
    return next(new UnauthorizedError('Authentication failed'));
  }
};

export default authMiddleware;
