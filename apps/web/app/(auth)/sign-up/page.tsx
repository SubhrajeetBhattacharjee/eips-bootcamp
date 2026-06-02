'use client';

import { useState } from 'react';
import { signUp, signIn } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); // Even with OTP, sometimes a password helps, or we can just send OTP for signup too!
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Better Auth emailOTP plugin can be used for both sign in and sign up.
  // Actually, better auth lets us use `signUp.email` if password is provided,
  // or we can just stick to `signIn.emailOtp` if the user is new, it auto-registers them!
  // Wait, email OTP plugin requires `signUp.emailOtp`? No, `signIn.emailOtp` registers the user if they don't exist.
  // So we just collect their name first.
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Create user with password for now, since standard emailOTP sign up requires a bit more config
      // Or we can just use the standard signUp with a random password if we rely on OTP.
      const result = await signUp.email({
        email,
        password,
        name,
      });
      if (result.error) {
        setError(result.error.message || 'Failed to sign up');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
      <div className="w-full max-w-md p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">Create Account</h2>
        
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50"
              placeholder="Satoshi Nakamoto"
            />
          </div>
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
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-zinc-500 text-xs">OR</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <button
          onClick={handleGoogleSignUp}
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

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account? <Link href="/sign-in" className="text-emerald-400 hover:text-emerald-300">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
