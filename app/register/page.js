'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Minimum 6 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ name, email, password }) => {
    setLoading(true);
    try {
      await registerUser(name, email, password);
      toast.success('Account created! Welcome to GlowAura 🌸');
      router.push('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900 transition-colors duration-500 py-12">
      <div className="w-full max-w-md relative">
        {/* Aesthetic Background Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-200 dark:bg-pink-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-200 dark:bg-purple-500/10 rounded-full blur-3xl opacity-50" />

        <div className="glass-card p-8 relative z-10 bg-white/70 dark:bg-white/5 backdrop-blur-2xl border-white/50 dark:border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl -rotate-3 hover:rotate-0 transition-all duration-500">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white font-playfair tracking-tight">Join GlowAura</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">Create your vibe & start glowing ✨</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name', type: 'text', placeholder: 'Sneha Jadhav' },
              { field: 'email', label: 'Email Address', type: 'email', placeholder: 'bestie@example.com' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-black uppercase tracking-widest text-pink-500 mb-2 ml-1">{label}</label>
                <input {...register(field)} type={type} className="input-field !rounded-2xl dark:bg-black/20" placeholder={placeholder} />
                {errors[field] && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-1">{errors[field].message}</p>}
              </div>
            ))}

            {['password', 'confirm'].map((field, i) => (
              <div key={field}>
                <label className="block text-xs font-black uppercase tracking-widest text-pink-500 mb-2 ml-1">
                  {i === 0 ? 'Password' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input {...register(field)} type={showPw ? 'text' : 'password'}
                    className="input-field !rounded-2xl pr-12 dark:bg-black/20" placeholder="••••••••" />
                  {i === 0 && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
                {errors[field] && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-1">{errors[field].message}</p>}
              </div>
            ))}

            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center font-medium py-2">
              By joining, you agree to our{' '}
              <a href="#" className="text-pink-500 hover:text-purple-500 underline decoration-dotted">Terms</a> and{' '}
              <a href="#" className="text-pink-500 hover:text-purple-500 underline decoration-dotted">Privacy</a>.
            </p>

            <button type="submit" disabled={loading}
              className="btn-primary w-full !py-4 text-base font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 mt-4 shadow-xl shadow-pink-200 dark:shadow-pink-900/20 active:scale-95 transition-all">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating… ✨</> : 'Create Vibe ✨'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 font-medium">
            Already a member?{' '}
            <Link href="/login" className="text-pink-500 hover:text-purple-600 font-black uppercase tracking-widest text-xs transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}