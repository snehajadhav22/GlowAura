'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function LoginContent() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 🌸`);
      router.push(user.role === 'admin' ? '/admin' : next);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900 transition-colors duration-500">
      <div className="w-full max-w-md relative">
        {/* Aesthetic Background Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-200 dark:bg-pink-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-200 dark:bg-purple-500/10 rounded-full blur-3xl opacity-50" />

        <div className="glass-card p-8 relative z-10 bg-white/70 dark:bg-white/5 backdrop-blur-2xl border-white/50 dark:border-white/10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3 hover:rotate-0 transition-all duration-500">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white font-playfair tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">Log in to your GlowAura account ✨</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-pink-500 mb-2 ml-1">Email Address</label>
              <input {...register('email')} type="email" className="input-field !rounded-2xl dark:bg-black/20" placeholder="bestie@example.com" />
              {errors.email && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-black uppercase tracking-widest text-pink-500">Password</label>
                <a href="#" className="text-[10px] font-black uppercase text-gray-400 hover:text-pink-500 transition-colors">Forgot Vibe?</a>
              </div>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'}
                  className="input-field !rounded-2xl pr-12 dark:bg-black/20" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full !py-4 text-base font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 mt-4 shadow-xl shadow-pink-200 dark:shadow-pink-900/20 active:scale-95 transition-all">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in…</> : 'Log In ✨'}
            </button>
          </form>

          {/* Social login attempt */}
          <div className="mt-8 pt-8 border-t border-pink-50 dark:border-white/5">
            <div className="flex bg-pink-50/50 dark:bg-white/5 p-4 rounded-2xl border border-pink-100 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold mr-3 flex-shrink-0">A</div>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Demo Admin Access</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium break-all">admin@glowaura.com / admin123</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 font-medium">
            New here?{' '}
            <Link href="/register" className="text-pink-500 hover:text-purple-600 font-black uppercase tracking-widest text-xs transition-colors">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="animate-spin text-pink-500" size={48} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
