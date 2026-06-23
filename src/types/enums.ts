export type MemberRole = 'OWNER' | 'MEMBER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export const MEMBER_ROLES = {
  OWNER: 'OWNER' as MemberRole,
  MEMBER: 'MEMBER' as MemberRole,
} as const;

export const TASK_STATUSES = {
  TODO: 'TODO' as TaskStatus,
  IN_PROGRESS: 'IN_PROGRESS' as TaskStatus,
  DONE: 'DONE' as TaskStatus,
} as const;

export const TASK_PRIORITIES = {
  LOW: 'LOW' as TaskPriority,
  MEDIUM: 'MEDIUM' as TaskPriority,
  HIGH: 'HIGH' as TaskPriority,
} as const;
