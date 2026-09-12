'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Shield,
  Sparkles,
  LogOut,
  User,
  CheckCircle2,
  Cloud,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sound } from '@/lib/sound';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    email?: string | null;
    username: string;
    avatarUrl?: string | null;
    isGuest: boolean;
  };
  onSignOut?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSignOut,
}) => {
  const [authTab, setAuthTab] = useState<'LOGIN' | 'SIGNUP' | 'GOOGLE'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    sound.playClick();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!isSupabaseConfigured) {
        setErrorMessage(
          'Supabase environment variables not configured. Running in guest demo mode.'
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured yet. Playing in offline guest mode.');
      setIsLoading(false);
      return;
    }

    try {
      if (authTab === 'SIGNUP') {
        const { error } = await supabase.auth.signUp({
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
          setSuccessMessage('Registration successful! Check your email or continue.');
          sound.playSkillUnlock();
          setTimeout(() => onClose(), 1500);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          sound.playSkillUnlock();
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    sound.playClick();
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      onSignOut?.();
      onClose();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-cyan-500/50 bg-[#0a0718] p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] font-mono text-slate-200"
          >
            {/* Top decorative neon scanline header */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 shadow-[0_0_10px_rgba(0,240,255,0.8)]" />

            {/* Close Button */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 rounded-xl border border-indigo-900 bg-indigo-950/60 p-2 text-slate-400 hover:border-cyan-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title & Emblem */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                  // NEXUS IDENTITY LINK
                </span>
                <h2 className="text-lg font-extrabold text-white tracking-tight">
                  Hero Authentication & Security
                </h2>
              </div>
            </div>

            {/* Error / Success Messages */}
            {errorMessage && (
              <div className="mb-4 flex items-start gap-2 rounded-2xl border border-rose-500/50 bg-rose-950/50 p-3 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-500/50 bg-emerald-950/50 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {currentUser && !currentUser.isGuest ? (
              /* Authenticated User Profile View */
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt="Avatar"
                        className="h-12 w-12 rounded-2xl border border-emerald-400 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400 bg-emerald-950 text-emerald-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cloud Synchronized // Isolated Data</span>
                      </div>
                      <h3 className="text-base font-bold text-white truncate">
                        {currentUser.username}
                      </h3>
                      {currentUser.email && (
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-950 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-cyan-400" /> PostgreSQL RLS Active
                    </span>
                    <span className="text-emerald-400 font-bold">DATA ISOLATED</span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-950/30 py-3 text-sm font-bold text-rose-300 hover:bg-rose-900/50 hover:border-rose-400 transition-all active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isLoading ? 'Disconnecting...' : 'Sign Out / Disconnect'}</span>
                </button>
              </div>
            ) : (
              /* Auth Form View (Login / Sign Up / Google) */
              <div className="space-y-4">
                {/* Mode Selector */}
                <div className="grid grid-cols-3 gap-1 rounded-2xl border border-indigo-950 bg-[#070414] p-1 text-xs font-bold">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setAuthTab('LOGIN');
                    }}
                    className={`rounded-xl py-1.5 transition-all ${
                      authTab === 'LOGIN'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setAuthTab('SIGNUP');
                    }}
                    className={`rounded-xl py-1.5 transition-all ${
                      authTab === 'SIGNUP'
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setAuthTab('GOOGLE');
                    }}
                    className={`rounded-xl py-1.5 transition-all ${
                      authTab === 'GOOGLE'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Google
                  </button>
                </div>

                {authTab === 'GOOGLE' ? (
                  <div className="space-y-3 pt-1">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="group relative w-full flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:bg-slate-100 active:scale-[0.98] disabled:opacity-50"
                    >
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
                      <span>{isLoading ? 'Connecting...' : 'Sign in with Google'}</span>
                    </button>

                    <div className="rounded-2xl border border-indigo-950 bg-[#120d2c] p-3 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Secure Cloud Session</span>
                      </div>
                      <p>Instant authorization with data isolation across your devices.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEmailAuth} className="space-y-3 pt-1">
                    {authTab === 'SIGNUP' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Operator Handle
                        </label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. CyberKnight"
                          className="w-full rounded-xl border border-indigo-900 bg-[#140e36] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="operator@nexus.io"
                          className="w-full rounded-xl border border-indigo-900 bg-[#140e36] pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Password (min 6 characters)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-indigo-900 bg-[#140e36] pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 py-3 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      <span>
                        {isLoading
                          ? 'Authenticating...'
                          : authTab === 'SIGNUP'
                          ? 'Create Account'
                          : 'Sign In'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  <span>Want full-screen experience?</span>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="text-cyan-400 hover:underline font-bold inline-flex items-center gap-0.5"
                  >
                    <span>Open /login</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
