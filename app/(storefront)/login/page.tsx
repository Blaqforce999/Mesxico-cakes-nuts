'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const supabase = createClient();

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setSuccessMsg('Account created! Please check your email to verify or sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-outline-variant/60 shadow-lg">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-outline hover:text-primary transition-colors font-body mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface">
            {isSignUp ? 'Create Customer Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs sm:text-sm text-outline-variant font-body mt-1.5">
            {isSignUp
              ? 'Sign up to track custom orders and save delivery addresses'
              : 'Sign in to access your orders and profile'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-error-container/40 border border-error/20 flex items-start space-x-2.5 text-xs text-on-error-container font-body">
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-secondary-container/40 border border-secondary/20 flex items-start space-x-2.5 text-xs text-on-secondary-container font-body">
            <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amina Adebayo"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-variant/30 border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-variant/30 border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-variant/30 border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all min-h-[44px] shadow-sm mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs font-semibold text-primary hover:underline font-body"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account yet? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
