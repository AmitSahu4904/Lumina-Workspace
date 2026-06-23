import { projectRepository } from '../repositories/project.repository';
import { memberRepository } from '../repositories/member.repository';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { Project } from '../types/models';

export class ProjectService {
  async createProject(title: string, description: string | null, ownerId: string): Promise<Project> {
    // 1. Create the project
    const project = await projectRepository.create({
      title,
      description,
      owner_id: ownerId,
    });

    // 2. Automatically make the project owner an OWNER member of the project
    await memberRepository.addMember(project.id, ownerId, 'OWNER');

    return project;
  }

  async getProjects(userId: string, search?: string): Promise<Project[]> {
    return projectRepository.findByUser(userId, search);
  }

  async getProjectDetail(projectId: string, userId: string): Promise<Project> {
    // Verify membership
    const member = await memberRepository.findMember(projectId, userId);
    if (!member) {
      throw new ForbiddenError('You are not a member of this project');
    }

    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  async updateProject(projectId: string, userId: string, title?: string, description?: string | null): Promise<Project> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Only owner can update project details
    if (project.owner_id !== userId) {
      throw new ForbiddenError('Only the project owner can edit this project');
    }

    const updates: Partial<Pick<Project, 'title' | 'description'>> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    return projectRepository.update(projectId, updates);
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Only owner can delete project
    if (project.owner_id !== userId) {
      throw new ForbiddenError('Only the project owner can delete this project');
    }

    await projectRepository.delete(projectId);
  }

  async getDashboardData(userId: string) {
    const stats = await projectRepository.countDashboardStats(userId);
    const recentProjects = await projectRepository.getRecentProjects(userId, 5);

    return {
      stats,
      recentProjects,
    };
  }
}

export const projectService = new ProjectService();
export default projectService;
