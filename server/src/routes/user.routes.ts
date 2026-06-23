import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { searchLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authMiddleware);

// Search registered users by email
router.get('/search', searchLimiter, userController.search);

export default router;
