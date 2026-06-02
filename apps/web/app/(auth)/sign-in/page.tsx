'use client';

import { useState } from 'react';
import { authClient, signIn } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
      });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn.emailOtp({
        email,
        otp,
      });
      if (result.error) {
        setError(result.error.message || 'Invalid OTP');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
      <div className="w-full max-w-md p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">Sign In</h2>
        
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 text-center tracking-[0.5em]"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-zinc-400 hover:text-white text-sm"
            >
              Use a different email
            </button>
          </form>
        )}

        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-zinc-500 text-xs">OR</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <button
          onClick={() => alert('Metamask integration coming soon!')}
          className="w-full flex items-center justify-center gap-2 bg-[#F6851B]/10 border border-[#F6851B]/20 text-[#F6851B] font-bold py-2.5 rounded-lg hover:bg-[#F6851B]/20 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 32 32">
            <path d="M28.452 7.711l-5.659-1.89-6.326-4.22-6.505 4.357-5.518 1.761-3.69 11.758 7.424 5.922-1.748 4.795 9.878 1.488 10.155-1.488-1.785-4.795 7.61-5.914zM16.324 3.754l4.572 3.041 3.204 1.059-8.081 5.929-7.85-5.929 3.234-1.029z" fill="#E2761B"/>
            <path d="M2.541 19.387l2.678-8.525 5.562-1.777-6.025 8.785 1.488 4.089z" fill="#E4761B"/>
            <path d="M29.614 19.387l-3.553-2.148 1.347-4.104-5.839-8.777 5.703 1.903 2.502 8.525z" fill="#E4761B"/>
            <path d="M12.753 28.536l3.371 1.785 3.527-1.882-1.168-5.385-2.21-1.071-2.455 1.071z" fill="#E4761B"/>
          </svg>
          Continue with Metamask
        </button>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account? <Link href="/sign-up" className="text-emerald-400 hover:text-emerald-300">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
