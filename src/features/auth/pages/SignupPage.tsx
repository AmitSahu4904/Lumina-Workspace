import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signupFormSchema, SignupFormValues } from '../schemas/auth';
import useAuthActions from '../hooks/useAuthActions';
import ROUTES from '../../../constants/routes';

export const SignupPage: React.FC = () => {
  const { signup, isSigningUp } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    signup(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl transition-all">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            Create Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Sign up to collaborate in Lumina Workspace
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white"
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white"
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
              Password (min. 8 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {isSigningUp ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-slate-900 dark:text-white hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
