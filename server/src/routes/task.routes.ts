import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validators';

// 1. Standalone Router (for /api/v1/tasks)
const taskRouter = Router();

taskRouter.use(authMiddleware);
taskRouter.patch('/:id', validate(updateTaskSchema), taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);

export default taskRouter;

// 2. Nested Router (for /api/v1/projects/:projectId/tasks)
// mergeParams: true allows accessing :projectId parameter defined in the parent router
export const nestedTaskRouter = Router({ mergeParams: true });

nestedTaskRouter.use(authMiddleware);
nestedTaskRouter.get('/', taskController.getTasks);
nestedTaskRouter.post('/', validate(createTaskSchema), taskController.createTask);
