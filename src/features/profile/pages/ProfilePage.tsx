import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, User, Mail, ShieldAlert } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { useProfileMutations } from '../hooks/useProfile';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { updateName, uploadAvatar, isUpdatingName, isUploadingAvatar } = useProfileMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      name: user?.name || '',
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleNameSubmit = async (values: ProfileFormValues) => {
    await updateName(values.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAvatarUpload = async () => {
    if (selectedFile) {
      await uploadAvatar(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in text-slate-800 dark:text-zinc-100 pb-10">
      {/* Page Title */}
      <div className="space-y-1 text-left">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
          Profile Settings
        </h2>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage your personal details and avatar preferences.
        </p>
      </div>

      {/* Profile Card details */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-8">
        
        {/* Avatar Upload segment */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            {previewUrl || user.avatar_url ? (
              <img
                src={previewUrl || user.avatar_url || ''}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 dark:border-zinc-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center text-2xl font-bold font-sans border border-slate-200 dark:border-zinc-800">
                {getInitials(user.name)}
              </div>
            )}
            
            {/* Overlay Camera Icon on Hover */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6" />
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">Profile Photo</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Click the avatar to select a new image. JPG, PNG, or GIF. Max 5MB.
            </p>
            {selectedFile && (
              <div className="flex items-center space-x-2 pt-1.5 justify-center sm:justify-start">
                <button
                  onClick={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 text-xs font-bold rounded-lg disabled:opacity-50 transition-colors"
                >
                  {isUploadingAvatar ? 'Uploading...' : 'Save Avatar'}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="px-3 py-1.5 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 text-slate-600 dark:text-zinc-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form update name segment */}
        <form onSubmit={handleSubmit(handleNameSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white text-sm"
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1 opacity-70">
              <label className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center space-x-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email (readonly)</span>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-zinc-800/20 border border-slate-200 dark:border-zinc-750 rounded-xl text-slate-500 dark:text-zinc-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="submit"
              disabled={isUpdatingName}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl focus:outline-none transition-all disabled:opacity-50 shadow-md"
            >
              {isUpdatingName ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
