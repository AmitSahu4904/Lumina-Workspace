import { memberRepository } from '../repositories/member.repository';
import { projectRepository } from '../repositories/project.repository';
import { profileRepository } from '../repositories/profile.repository';
import { ForbiddenError, NotFoundError, BadRequestError } from '../utils/errors';
import { ProjectMember } from '../types/models';

export class MemberService {
  async getMembers(projectId: string, userId: string): Promise<ProjectMember[]> {
    // Check if the requesting user belongs to the project
    const member = await memberRepository.findMember(projectId, userId);
    if (!member) {
      throw new ForbiddenError('You are not a member of this project');
    }

    return memberRepository.findByProject(projectId);
  }

  async addMember(projectId: string, ownerId: string, email: string): Promise<ProjectMember> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Only project owner can add members
    if (project.owner_id !== ownerId) {
      throw new ForbiddenError('Only the project owner can add members');
    }

    // Find the user profile by email
    const targetUser = await profileRepository.findByEmail(email);
    if (!targetUser) {
      throw new NotFoundError('User with this email is not registered');
    }

    // Check if the user is already a member
    const existingMember = await memberRepository.findMember(projectId, targetUser.id);
    if (existingMember) {
      throw new BadRequestError('User is already a member of this project');
    }

    // Add member
    return memberRepository.addMember(projectId, targetUser.id, 'MEMBER');
  }

  async removeMember(projectId: string, ownerId: string, targetUserId: string): Promise<void> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Only project owner can remove members
    if (project.owner_id !== ownerId) {
      throw new ForbiddenError('Only the project owner can remove members');
    }

    // Cannot remove the project owner
    if (project.owner_id === targetUserId) {
      throw new BadRequestError('Cannot remove the project owner from the project');
    }

    // Check if the target user is a member
    const member = await memberRepository.findMember(projectId, targetUserId);
    if (!member) {
      throw new NotFoundError('User is not a member of this project');
    }

    // Delete membership
    await memberRepository.removeMember(projectId, targetUserId);
  }
}

export const memberService = new MemberService();
export default memberService;
