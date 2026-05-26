'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { GiGamepad } from 'react-icons/gi';

export default function LoginPage() {
  const router = useRouter();
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [showPass,      setShowPass]      = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Welcome back! 🎮');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message?.includes('invalid') ? 'Invalid email or password' : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome back! 🎮');
      router.push('/');
    } catch {
      toast.error('Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4"
      style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%), #09090b' }}>

      <div className="w-full max-w-md">
        <div className="gaming-card rounded-2xl overflow-hidden border border-dark-border">
          <div className="h-1 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple" />
          <div className="p-8">
            <div className="text-center mb-8">
              <GiGamepad size={42} className="text-neon-green mx-auto mb-3" />
              <h1 className="font-gaming font-black text-2xl text-white">WELCOME BACK</h1>
              <p className="text-gray-400 text-sm mt-1">Login to your Zaib Gaming Zone account</p>
            </div>

            <button onClick={handleGoogle} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-dark-border hover:border-gray-500 bg-dark-surface text-white font-semibold text-sm transition-colors duration-150 hover:bg-dark-border mb-5">
              <FcGoogle size={20} />
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-dark-border" />
              <span className="text-gray-500 text-xs font-gaming">OR</span>
              <div className="flex-1 h-px bg-dark-border" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} className="input-neon pl-10" required />
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password}
                  onChange={(e) => setPassword(e.target.value)} className="input-neon pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-neon w-full">
                {loading ? 'Logging in...' : '⚡ Login'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-neon-green hover:underline font-semibold">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
