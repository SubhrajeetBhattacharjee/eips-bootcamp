'use client';

import { useState, useEffect } from 'react';
import { authClient, signIn } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, KeyRound, ArrowRight, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from 'sonner';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
      });
      setOtpSent(true);
      setResendCooldown(30);
      toast.success('Verification code sent to your email!');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the full 6-digit verification code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signIn.emailOtp({
        email,
        otp: otp.trim(),
      });
      if (result.error) {
        setError(result.error.message || 'Invalid verification code');
        toast.error(result.error.message || 'Invalid verification code');
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please check and try again.');
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      toast.error('Google sign-in failed');
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      {/* Top Segmented Switcher */}
      <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-[#f0eee6] text-xs font-semibold">
        <span className="flex items-center justify-center py-2 rounded-lg bg-[#075945] text-white shadow-sm font-bold">
          Sign In
        </span>
        <Link
          href="/sign-up"
          className="flex items-center justify-center py-2 rounded-lg text-[#666] hover:text-[#111] transition-colors"
        >
          Create Account
        </Link>
      </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111]">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-[#666]">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{error}</div>
          </div>
        )}

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-[#fcfbf7] hover:border-[#075945] text-[#1c201e] font-semibold text-sm transition-all duration-150 shadow-xs cursor-pointer group"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">
            or with email OTP
          </span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {!otpSent ? (
          /* Step 1: Send OTP Form */
          <form onSubmit={handleSendOtp} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#064a3a] hover:bg-[#043328] text-white font-bold py-3.5 rounded-xl transition-all duration-150 shadow-md shadow-[#075945]/20 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 text-sm cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending code...
                </span>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Verify OTP Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            <div className="rounded-xl border border-[#075945]/20 bg-[#075945]/5 p-3 text-center">
              <p className="text-xs text-[#666]">
                We sent a 6-digit verification code to
              </p>
              <p className="mt-1 text-sm font-bold text-[#075945] break-all">
                {email}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333] mb-1.5 uppercase tracking-wider">
                Enter 6-Digit Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888]" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  autoFocus
                  maxLength={6}
                  className="w-full bg-[#faf9f5] border border-gray-200 focus:border-[#075945] focus:ring-4 focus:ring-[#075945]/10 rounded-xl pl-10 pr-4 py-2.5 text-center text-lg font-mono tracking-[0.4em] text-[#111] placeholder:tracking-normal placeholder:font-sans placeholder:text-[#999] outline-none transition-all"
                  placeholder="000000"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#064a3a] hover:bg-[#043328] text-white font-bold py-3.5 rounded-xl transition-all duration-150 shadow-md shadow-[#075945]/20 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 text-sm cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying code...
                </span>
              ) : (
                <>
                  <span>Verify &amp; Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="inline-flex items-center gap-1 text-[#666] hover:text-[#111] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Different email
              </button>

              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={loading || resendCooldown > 0}
                className="text-[#075945] hover:underline disabled:opacity-50 disabled:no-underline font-semibold cursor-pointer"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>

          </form>
        )}

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-gray-200 text-center">
          <p className="text-xs text-[#666]">
            New to ETHShala?{' '}
            <Link href="/sign-up" className="font-bold text-[#075945] hover:underline">
              Create Account
            </Link>
          </p>
          <p className="mt-1.5 text-[11px] text-[#888]">
            🔒 Fast, passwordless &amp; secure on-boarding.
          </p>
        </div>

    </div>
  );
}
