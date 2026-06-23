import { Router } from 'express';
import multer from 'multer';
import { profileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators/profile.validators';
import { BadRequestError } from '../utils/errors';

const router = Router();

// Multer memory storage configuration for avatar uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum
  },
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Only image files are allowed'));
    }
  },
});

router.use(authMiddleware);

router.get('/', profileController.getProfile);
router.patch('/', validate(updateProfileSchema), profileController.updateProfile);
router.post('/avatar', upload.single('avatar'), profileController.uploadAvatar);

export default router;
