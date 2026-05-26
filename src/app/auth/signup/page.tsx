'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { GiGamepad } from 'react-icons/gi';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [needPhone, setNeedPhone] = useState(false);
  const [googlePhone, setGooglePhone] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error('All fields are required');
      return;
    }
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name, phone);
      toast.success('Account created! Welcome to Zaib Gaming Zone 🎮');
      router.push('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') toast.error('Email already registered. Please login.');
      else if (err.code === 'auth/weak-password') toast.error('Password must be at least 6 characters.');
      else toast.error('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googlePhone || googlePhone.length < 10) {
      toast.error('Please enter your phone number');
      return;
    }
    setGoogleLoading(true);
    try {
      await signInWithGoogle(googlePhone);
      toast.success('Welcome to Zaib Gaming Zone! 🎮');
      router.push('/');
    } catch (err) {
      toast.error('Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gaming-grid pt-16 px-4 py-8">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,255,0.15) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md">
        <div className="gaming-card rounded-2xl overflow-hidden border border-dark-border">
          <div className="h-1 bg-gradient-to-r from-neon-blue via-neon-green to-neon-purple" />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <GiGamepad size={42} className="text-neon-blue mx-auto mb-3" />
              <h1 className="font-gaming font-black text-2xl text-white">CREATE ACCOUNT</h1>
              <p className="text-gray-400 text-sm mt-1">Join Zaib Gaming Zone & get your Gamer ID</p>
            </div>

            {/* Google */}
            {!needPhone ? (
              <>
                <button
                  onClick={() => setNeedPhone(true)}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-dark-border hover:border-gray-500 bg-dark-surface text-white font-semibold text-sm transition-all duration-200 hover:bg-dark-border mb-5"
                >
                  <FcGoogle size={20} />
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-dark-border" />
                  <span className="text-gray-500 text-xs font-gaming">OR</span>
                  <div className="flex-1 h-px bg-dark-border" />
                </div>

                {/* Full sign up form */}
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-neon pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-neon pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-neon pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password (min 6 chars) *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-neon pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>

                  <button type="submit" disabled={loading} className="btn-neon w-full">
                    {loading ? 'Creating account...' : '🎮 Create Account'}
                  </button>
                </form>
              </>
            ) : (
              /* Google phone collection */
              <form onSubmit={handleGoogle} className="space-y-4">
                <p className="text-gray-400 text-sm text-center mb-4">
                  We need your phone number before continuing with Google.
                </p>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={googlePhone}
                    onChange={(e) => setGooglePhone(e.target.value)}
                    className="input-neon pl-10"
                    required
                  />
                </div>
                <button type="submit" disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-dark-bg font-bold text-sm transition-all hover:opacity-90">
                  <FcGoogle size={20} />
                  {googleLoading ? 'Signing in...' : 'Continue with Google'}
                </button>
                <button type="button" onClick={() => setNeedPhone(false)}
                  className="text-gray-400 text-xs text-center w-full hover:text-white transition-colors">
                  ← Go back
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-neon-green hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Features hint */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {['🎮 Book Consoles', '🏆 Join Tournaments', '📊 Track History'].map((feat) => (
            <div key={feat} className="text-center text-xs text-gray-500 gaming-card rounded-xl py-2 px-1">
              {feat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
