export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  projects: {
    all: (search?: string) => ['projects', { search }] as const,
    detail: (id: string) => ['projects', 'detail', id] as const,
  },
  members: {
    list: (projectId: string) => ['projects', projectId, 'members'] as const,
  },
  tasks: {
    list: (projectId: string, filters?: Record<string, any>) => 
      ['projects', projectId, 'tasks', filters || {}] as const,
  },
  users: {
    search: (email: string, excludeProjectId?: string) => 
      ['users', 'search', { email, excludeProjectId }] as const,
  },
};

export default queryKeys;
