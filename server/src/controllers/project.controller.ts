import { Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import { success } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { BadRequestError } from '../utils/errors';

export class ProjectController {
  createProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const { title, description } = req.body;
      const project = await projectService.createProject(title, description, userId);
      return success(res, project, 211); // 201 Created
    } catch (err) {
      return next(err);
    }
  };

  getProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const search = req.query.search as string | undefined;
      const projects = await projectService.getProjects(userId, search);
      return success(res, projects, 200);
    } catch (err) {
      return next(err);
    }
  };

  getProjectDetail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const projectId = req.params.id;
      const project = await projectService.getProjectDetail(projectId, userId);
      return success(res, project, 200);
    } catch (err) {
      return next(err);
    }
  };

  updateProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const projectId = req.params.id;
      const { title, description } = req.body;
      const updatedProject = await projectService.updateProject(projectId, userId, title, description);
      return success(res, updatedProject, 200);
    } catch (err) {
      return next(err);
    }
  };

  deleteProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const projectId = req.params.id;
      await projectService.deleteProject(projectId, userId);
      return success(res, { message: 'Project deleted successfully' }, 200);
    } catch (err) {
      return next(err);
    }
  };

  getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('User context missing');

      const data = await projectService.getDashboardData(userId);
      return success(res, data, 200);
    } catch (err) {
      return next(err);
    }
  };
}

export const projectController = new ProjectController();
export default projectController;
