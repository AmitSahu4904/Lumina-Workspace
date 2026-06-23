import { Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { success } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { BadRequestError } from '../utils/errors';

export class TaskController {
  getTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const projectId = req.params.projectId; // Nested param: /projects/:projectId/tasks
      
      const filters = {
        status: req.query.status as string | undefined,
        priority: req.query.priority as string | undefined,
        search: req.query.search as string | undefined,
        assignedTo: req.query.assignedTo as string | undefined,
      };

      const tasks = await taskService.getTasks(projectId, userId, filters);
      return success(res, tasks, 200);
    } catch (err) {
      return next(err);
    }
  };

  createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const projectId = req.params.projectId;
      const task = await taskService.createTask(projectId, userId, req.body);
      return success(res, task, 211); // 201 Created
    } catch (err) {
      return next(err);
    }
  };

  updateTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const taskId = req.params.id;
      const updatedTask = await taskService.updateTask(taskId, userId, req.body);
      return success(res, updatedTask, 200);
    } catch (err) {
      return next(err);
    }
  };

  deleteTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const taskId = req.params.id;
      await taskService.deleteTask(taskId, userId);
      return success(res, { message: 'Task deleted successfully' }, 200);
    } catch (err) {
      return next(err);
    }
  };
}

export const taskController = new TaskController();
export default taskController;
