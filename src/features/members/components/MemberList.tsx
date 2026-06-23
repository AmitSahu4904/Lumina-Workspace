import React from 'react';
import { Trash2, Shield, User } from 'lucide-react';
import { ProjectMember } from '../../../types/models';
import useAuth from '../../../hooks/useAuth';

interface MemberListProps {
  members: ProjectMember[];
  projectOwnerId: string;
  onRemoveMember: (userId: string) => void;
  isRemoving: boolean;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  projectOwnerId,
  onRemoveMember,
  isRemoving,
}) => {
  const { user } = useAuth();
  const isCurrentUserOwner = projectOwnerId === user?.id;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                User
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Role
              </th>
              {isCurrentUserOwner && (
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
            {members.map((member) => {
              const isTargetOwner = member.user_id === projectOwnerId;
              const initials = getInitials(member.profile.name);

              return (
                <tr 
                  key={member.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {member.profile.avatar_url ? (
                        <img
                          src={member.profile.avatar_url}
                          alt={member.profile.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 flex items-center justify-center text-xs font-bold font-sans border border-slate-200 dark:border-zinc-700">
                          {initials}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {member.profile.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-zinc-400">
                    {member.profile.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isTargetOwner
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30'
                          : 'bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-100 dark:border-zinc-700/50'
                      }`}
                    >
                      {isTargetOwner ? (
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <User className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{member.role}</span>
                    </span>
                  </td>
                  {isCurrentUserOwner && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!isTargetOwner && (
                        <button
                          onClick={() => onRemoveMember(member.user_id)}
                          disabled={isRemoving}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
