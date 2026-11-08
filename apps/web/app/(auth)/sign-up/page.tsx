'use client';

import { useState } from 'react';
import { signUp, signIn } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { linkReferral } from '@/app/actions/referrals';
import { toast } from 'sonner';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await signUp.email({
        email,
        password,
        name: name.trim(),
      });
      if (result.error) {
        setError(result.error.message || 'Failed to sign up');
        toast.error(result.error.message || 'Failed to sign up');
      } else {
        toast.success('Account created successfully! Welcome to ETHShala.');
        try {
          await linkReferral();
        } catch (e) {
          // Non-blocking referral link
        }
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (err: any) {
      setError(err.message || 'Google sign-up failed');
      toast.error('Google sign-up failed');
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      {/* Top Segmented Switcher */}
      <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-[#f0eee6] text-xs font-semibold">
        <Link
          href="/sign-in"
          className="flex items-center justify-center py-2 rounded-lg text-[#666] hover:text-[#111] transition-colors"
        >
          Sign In
        </Link>
        <span className="flex items-center justify-center py-2 rounded-lg bg-[#075945] text-white shadow-sm font-bold">
          Create Account
        </span>
      </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111]">
            Create Account
          </h2>
          <p className="mt-1 text-sm text-[#666]">
            Start learning, earning XP, and building Web3 projects
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{error}</div>
          </div>
        )}

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-[#fcfbf7] hover:border-[#075945] text-[#1c201e] font-semibold text-sm transition-all duration-150 shadow-xs cursor-pointer group"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">
            or register with email
          </span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#faf9f5] border border-gray-200 focus:border-[#075945] focus:ring-4 focus:ring-[#075945]/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111] placeholder:text-[#999] outline-none transition-all"
                placeholder="Alex Rivera"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1.5 uppercase tracking-wider">
              College or Personal Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#faf9f5] border border-gray-200 focus:border-[#075945] focus:ring-4 focus:ring-[#075945]/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111] placeholder:text-[#999] outline-none transition-all"
                placeholder="you@university.edu"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#333] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#faf9f5] border border-gray-200 focus:border-[#075945] focus:ring-4 focus:ring-[#075945]/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#111] placeholder:text-[#999] outline-none transition-all"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#111] transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Perks */}
          <div className="py-1 space-y-1 text-[11px] text-[#666]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#075945] shrink-0" />
              <span>Full curriculum access &amp; hands-on contract sandboxes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#075945] shrink-0" />
              <span>Earn verified on-chain completion credentials</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#064a3a] hover:bg-[#043328] text-white font-bold py-3.5 rounded-xl transition-all duration-150 shadow-md shadow-[#075945]/20 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 text-sm cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Creating your account...
              </span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-gray-200 text-center">
          <p className="text-xs text-[#666]">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-bold text-[#075945] hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

    </div>
  );
}
