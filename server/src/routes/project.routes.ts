import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { memberController } from '../controllers/member.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validators';
import { addMemberSchema } from '../validators/member.validators';
import { nestedTaskRouter } from './task.routes';

const router = Router();

router.use(authMiddleware);

// Dashboard counts & recent projects - Must be placed BEFORE /:id to avoid route shadowing
router.get('/dashboard', projectController.getDashboardStats);

// Project CRUD
router.get('/', projectController.getProjects);
router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/:id', projectController.getProjectDetail);
router.patch('/:id', validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Nested Project Members management
router.get('/:id/members', memberController.getMembers);
router.post('/:id/members', validate(addMemberSchema), memberController.addMember);
router.delete('/:id/members/:userId', memberController.removeMember);

// Nested Tasks management - passes projectId down to nested task router
router.use('/:projectId/tasks', nestedTaskRouter);

export default router;
