'use client';

import { useState } from 'react';
import { signUp, signIn } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User } from "lucide-react";
import { linkReferral } from '@/app/actions/referrals';
import { toast } from 'sonner';

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
        toast.error(result.error.message || 'Failed to sign up');
      } else {
        toast.success('Account created successfully!');
        // Link referral if cookie exists
        await linkReferral();
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
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
    }
  };
  return (
    <>
      <div className="relative
            z-10
            w-full
            max-w-md
            overflow-hidden
            rounded-3xl
            border
            border-border/50
            bg-card/70
            backdrop-blur-xl
            shadow-[0_20px_80px_rgba(0,0,0,0.25)]
            p-8">
        {/* Internal Glow */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-emerald-500/5
            via-transparent
            to-cyan-500/5
            pointer-events-none
          "
        />

        <div className="relative z-10">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-400">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Start earning XP and tracking your progress.
            </p>
          </div>
        
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
              <div className="relative">
                <User
                  className="
                    absolute
                    left-4
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-accent border border-border rounded-lg pl-10 py-2 text-foreground focus:outline-none focus:border-emerald-500/50"
                  placeholder="Satoshi Nakamoto"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email</label>
              <div className="relative">
                <Mail
                  className="
                    absolute
                    left-4
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-accent border border-border rounded-lg pl-11 py-2 text-foreground focus:outline-none focus:border-emerald-500/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Password</label>
              <div className="relative">
                <Lock
                  className="
                    absolute
                    left-4
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-accent border border-border rounded-lg pl-11 py-2 text-foreground focus:outline-none focus:border-emerald-500/50"
                  placeholder="••••••••"
                />
              </div>
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
            <div className="h-px bg-accent flex-1"></div>
            <span className="text-muted-foreground text-xs">OR</span>
            <div className="h-px bg-accent flex-1"></div>
          </div>

          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2 bg-background hover:bg-accent font-bold py-2.5 rounded-lg transition-all mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/sign-in" className="text-emerald-400 hover:text-emerald-300">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
