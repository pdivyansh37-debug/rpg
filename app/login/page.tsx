'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Sparkles,
  Zap,
  Flame,
  Swords,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Skull,
  Gift,
  User,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { initUserIfMissing } from '@/lib/supabase-service';
import { sound } from '@/lib/sound';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'SIGNIN' | 'SIGNUP' | 'GOOGLE'>('SIGNIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push('/');
      }
    });
  }, [router]);

  // Google OAuth Login
  const handleGoogleSignIn = async () => {
    sound.playClick();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!isSupabaseConfigured) {
        setErrorMessage(
          'Supabase environment variables not configured. You can click "Enter as Guest Operator" below!'
        );
        setIsLoading(false);
        return;
      }

      const redirectOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectOrigin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to initialize Google login');
      setIsLoading(false);
    }
  };

  // Email / Password Login or Sign Up
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured. Please use Guest Mode.');
      setIsLoading(false);
      return;
    }

    try {
      if (authMode === 'SIGNUP') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
            },
          },
        });
        if (error) {
          setErrorMessage(error.message);
        } else {
          if (data.user) {
            await initUserIfMissing(data.user);
          }
          setSuccessMessage('Registration successful! Identity initialized in the matrix.');
          sound.playSkillUnlock();
          setTimeout(() => router.push('/'), 1200);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setErrorMessage(error.message);
        } else {
          if (data.user) {
            await initUserIfMissing(data.user);
          }
          sound.playSkillUnlock();
          router.push('/');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    sound.playClick();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('guest_mode', 'true');
    }
    router.push('/');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070514] font-mono text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between p-4 sm:p-6">
      {/* Background Decorative Cyberpunk Grid & Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Neon Glow Blobs */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-pink-600/20 blur-[130px]" />

        {/* Matrix Grid Lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 mx-auto w-full max-w-4xl flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-amber-400 bg-gradient-to-b from-indigo-950 to-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
            <Shield className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
                // SYSTEM GATEWAY
              </span>
              <span className="rounded border border-pink-500/80 bg-pink-950/70 px-1 py-0.2 text-[8px] font-black text-pink-300">
                PROD-V1
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
              LIFE RPG MATRIX
            </h1>
          </div>
        </div>

        <button
          onClick={handleGuestLogin}
          className="flex items-center gap-1.5 rounded-xl border border-indigo-800 bg-[#120d2c]/80 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-white transition-all shadow-sm"
        >
          <span>Guest Mode</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </header>

      {/* Central Auth Card */}
      <main className="relative z-10 mx-auto w-full max-w-md py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/40 bg-[#0e0a24]/95 p-6 sm:p-7 shadow-[0_0_50px_rgba(0,240,255,0.2)] backdrop-blur-xl"
        >
          {/* Top Neon Scanline */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(0,240,255,0.8)]" />

          {/* Title Header */}
          <div className="text-center space-y-1 mb-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
              [ OPERATOR ACCESS PORTAL ]
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {authMode === 'SIGNUP'
                ? 'Create New Operator'
                : authMode === 'SIGNIN'
                ? 'Sign In to Matrix'
                : 'Google Fast Access'}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              {authMode === 'SIGNUP'
                ? 'Register your profile to preserve quest streaks, HP stakes, and inventory.'
                : 'Sign in to access your personal character sheet, dailies, and boss raids.'}
            </p>
          </div>

          {/* Error / Success Messages */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-rose-500/50 bg-rose-950/60 p-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-500/50 bg-emerald-950/60 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 3-Way Auth Tab Switcher (Sign In, Sign Up, Google) */}
          <div className="grid grid-cols-3 gap-1 rounded-2xl border border-indigo-950 bg-[#070414] p-1 text-[11px] font-bold mb-5">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setAuthMode('SIGNIN');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 transition-all ${
                authMode === 'SIGNIN'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setAuthMode('SIGNUP');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 transition-all ${
                authMode === 'SIGNUP'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setAuthMode('GOOGLE');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 transition-all ${
                authMode === 'GOOGLE'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Google</span>
            </button>
          </div>

          {/* Form Content */}
          {authMode === 'GOOGLE' ? (
            /* Google OAuth Primary View */
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-900 shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all hover:bg-slate-100 hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] active:scale-[0.98] disabled:opacity-50"
              >
                {/* Google 4-color SVG Icon */}
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="rounded-2xl border border-indigo-950/80 bg-[#120c2e] p-3 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant Cloud Sync</span>
                </div>
                <p>One-tap authorization. No password needed. Your habit streaks stay protected.</p>
              </div>
            </div>
          ) : (
            /* Email & Password Form (Sign In or Sign Up) */
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {authMode === 'SIGNUP' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Operator Handle (Username)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. CyberKnight_42"
                      className="w-full rounded-xl border border-indigo-900 bg-[#140e36] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@nexus.io"
                    className="w-full rounded-xl border border-indigo-900 bg-[#140e36] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-indigo-900 bg-[#140e36] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black text-slate-950 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                  authMode === 'SIGNUP'
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                    : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(0,240,255,0.5)]'
                }`}
              >
                <span>
                  {isLoading
                    ? 'Processing...'
                    : authMode === 'SIGNUP'
                    ? 'Create Operator Account'
                    : 'Sign In & Enter Matrix'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Google Alt Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-900 bg-[#100b2b] py-2 text-xs text-slate-300 hover:border-cyan-400 hover:text-white transition-all"
              >
                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Or Continue with Google</span>
              </button>

              <div className="text-center pt-1 text-xs">
                {authMode === 'SIGNIN' ? (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setAuthMode('SIGNUP');
                    }}
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    Need an account? Inscribe now &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setAuthMode('SIGNIN');
                    }}
                    className="text-purple-400 hover:underline font-bold"
                  >
                    Already registered? Sign in &rarr;
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Quick Guest Mode Divider */}
          <div className="relative mt-5 pt-4 border-t border-indigo-950 text-center">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-indigo-800/80 bg-[#120c2e] py-2.5 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-white transition-all shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Enter as Guest Operator (Offline Demo)</span>
            </button>
          </div>
        </motion.div>

        {/* Highlight Badges / Features Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] text-slate-400">
          <div className="rounded-2xl border border-indigo-950 bg-[#0d0920]/80 p-2.5 space-y-1">
            <Flame className="w-4 h-4 text-amber-400 mx-auto" />
            <div className="font-black text-white">Combo Streaks</div>
            <div>Up to +50% XP Boost</div>
          </div>
          <div className="rounded-2xl border border-indigo-950 bg-[#0d0920]/80 p-2.5 space-y-1">
            <Skull className="w-4 h-4 text-rose-400 mx-auto" />
            <div className="font-black text-white">HP Stakes</div>
            <div>Vices Deal Damage</div>
          </div>
          <div className="rounded-2xl border border-indigo-950 bg-[#0d0920]/80 p-2.5 space-y-1">
            <Gift className="w-4 h-4 text-cyan-400 mx-auto" />
            <div className="font-black text-white">Loot Crates</div>
            <div>Random Drops</div>
          </div>
          <div className="rounded-2xl border border-indigo-950 bg-[#0d0920]/80 p-2.5 space-y-1">
            <Swords className="w-4 h-4 text-purple-400 mx-auto" />
            <div className="font-black text-white">World Boss</div>
            <div>Syndicate Raids</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[11px] text-slate-500 py-2">
        <span>Life RPG // 16-Bit Habit Progression Engine &copy; 2026</span>
      </footer>
    </div>
  );
}
