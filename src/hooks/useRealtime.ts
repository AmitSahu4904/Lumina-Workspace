import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabase';
import useAuth from './useAuth';
import queryKeys from '../constants/queryKeys';

export const useRealtime = (projectId?: string) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !user) return;

    // Authenticate the Realtime client session with the user's active JWT token
    // This allows PostgreSQL Row Level Security (RLS) to apply to client-side Realtime broadcasts!
    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });

  }, [token, user]);

  useEffect(() => {
    if (!user || !projectId) return;

    // Create a Supabase Realtime channel dedicated to this project workspace
    const channel = supabase.channel(`project-collab:${projectId}`);

    channel
      // 1. Listen for Tasks table updates
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          // Trigger React Query cache invalidation
          queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
          queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

          // Send toast notifications for events triggered by OTHER members only
          const createdBy = payload.new ? (payload.new as any).created_by : null;
          if (createdBy && createdBy !== user.id) {
            if (payload.eventType === 'INSERT') {
              toast(`New task "${(payload.new as any).title}" added by another user`, { icon: '📝' });
            } else if (payload.eventType === 'UPDATE') {
              // Notify user if they have just been assigned to this task
              const isNewlyAssigned = 
                (payload.new as any).assigned_to === user.id && 
                (payload.old as any)?.assigned_to !== user.id;

              if (isNewlyAssigned) {
                toast.success(`You have been assigned to task "${(payload.new as any).title}"!`, { icon: '🎯' });
              } else {
                toast(`Task "${(payload.new as any).title}" was updated`, { icon: '🔄' });
              }
            } else if (payload.eventType === 'DELETE') {
              toast('A task was deleted from the board', { icon: '🗑️' });
            }
          }
        }
      )
      // 2. Listen for Project Members changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_members',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: queryKeys.members.list(projectId) });
          queryClient.invalidateQueries({ queryKey: ['projects'] });

          const targetUserId = payload.new ? (payload.new as any).user_id : (payload.old as any)?.user_id;
          
          if (targetUserId && targetUserId !== user.id) {
            if (payload.eventType === 'INSERT') {
              toast('A new member joined the project workspace', { icon: '👥' });
            } else if (payload.eventType === 'DELETE') {
              toast('A member left the project workspace', { icon: '🚶' });
            }
          }
        }
      )
      // 3. Listen for Projects changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['projects'] });
          queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

          const ownerId = payload.new ? (payload.new as any).owner_id : null;
          if (ownerId && ownerId !== user.id) {
            if (payload.eventType === 'UPDATE') {
              toast(`Project details updated by owner`, { icon: '⚙️' });
            } else if (payload.eventType === 'DELETE') {
              toast.error('This project workspace has been deleted by the owner.');
            }
          }
        }
      )
      .subscribe();

    // Clean up channel subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, user, queryClient]);
};

export default useRealtime;
