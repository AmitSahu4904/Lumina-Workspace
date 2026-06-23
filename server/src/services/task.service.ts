import { taskRepository, TaskFilters } from '../repositories/task.repository';
import { memberRepository } from '../repositories/member.repository';
import { projectRepository } from '../repositories/project.repository';
import { ForbiddenError, NotFoundError, BadRequestError } from '../utils/errors';
import { Task } from '../types/models';

export class TaskService {
  async createTask(
    projectId: string,
    userId: string,
    taskData: Omit<Task, 'id' | 'project_id' | 'created_by' | 'created_at' | 'updated_at'>
  ): Promise<Task> {
    // 1. Verify that the task creator is a member of the project
    const isMember = await memberRepository.findMember(projectId, userId);
    if (!isMember) {
      throw new ForbiddenError('You must be a member of the project to create tasks');
    }

    // 2. If an assignee is provided, verify they are also a project member
    if (taskData.assigned_to) {
      const isAssigneeMember = await memberRepository.findMember(projectId, taskData.assigned_to);
      if (!isAssigneeMember) {
        throw new BadRequestError('Assigned user must be a project member');
      }
    }

    // 3. Create task
    return taskRepository.create({
      ...taskData,
      project_id: projectId,
      created_by: userId,
    });
  }

  async getTasks(projectId: string, userId: string, filters: TaskFilters): Promise<Task[]> {
    // Verify membership
    const isMember = await memberRepository.findMember(projectId, userId);
    if (!isMember) {
      throw new ForbiddenError('You must be a member of this project to view tasks');
    }

    return taskRepository.findByProject(projectId, filters);
  }

  async updateTask(
    taskId: string,
    userId: string,
    updates: Partial<Omit<Task, 'id' | 'project_id' | 'created_by' | 'created_at' | 'updated_at'>>
  ): Promise<Task> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Verify requesting user is a member of the project this task belongs to
    const isMember = await memberRepository.findMember(task.project_id, userId);
    if (!isMember) {
      throw new ForbiddenError('You must be a member of the project to edit its tasks');
    }

    // If assignee is being updated, verify they are a project member
    if (updates.assigned_to) {
      const isAssigneeMember = await memberRepository.findMember(task.project_id, updates.assigned_to);
      if (!isAssigneeMember) {
        throw new BadRequestError('Assigned user must be a project member');
      }
    }

    return taskRepository.update(taskId, updates);
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Enforce Locked Decision: Only the task creator can delete the task
    if (task.created_by !== userId) {
      throw new ForbiddenError('Only the creator of this task is allowed to delete it');
    }

    await taskRepository.delete(taskId);
  }
}

export const taskService = new TaskService();
export default taskService;
