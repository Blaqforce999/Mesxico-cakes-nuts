'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useModalStore } from '@/lib/modal-store';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
  );
}

export function AuthModal() {
  const isAuthModalOpen = useModalStore((state) => state.isAuthModalOpen);
  const closeAuthModal = useModalStore((state) => state.closeAuthModal);
  const authModalMode = useModalStore((state) => state.authModalMode);
  const setAuthModalMode = useModalStore((state) => state.setAuthModalMode);

  const [authMethod, setAuthMethod] = useState<'choice' | 'email'>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isAuthModalOpen]);

  // Reset errors and method when opening or toggling mode
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setAuthMethod('choice');
  }, [authModalMode, isAuthModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign in failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const supabase = createClient();

    try {
      if (authModalMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            },
          },
        });
        if (error) throw error;
        setSuccessMsg('Account created successfully! You can now sign in.');
        setTimeout(() => {
          setAuthModalMode('signin');
          setAuthMethod('choice');
          setSuccessMsg('');
        }, 2000);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('Welcome back!');
        setTimeout(() => {
          closeAuthModal();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop — Only closes when user clicks the X icon; touchAction none prevents scroll */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        style={{ touchAction: 'none' }}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-surface p-6 sm:p-8 rounded-3xl border border-outline-variant/60 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface hover:bg-surface-variant hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center mb-6 pt-2">
          <h3 className="font-display font-bold text-2xl text-on-surface">
            {authModalMode === 'signin' ? 'Sign In to Mesxico' : 'Create an Account'}
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant font-body mt-1">
            {authModalMode === 'signin'
              ? 'Welcome back! Choose how you would like to sign in.'
              : 'Join Mesxico for faster checkout and scheduled bakes.'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-error-container/40 border border-error/30 text-on-error-container text-xs font-body flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs font-body flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: Initial Choice (Google vs Email) — no password yet */}
        {authMethod === 'choice' ? (
          <div className="space-y-4">
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full min-h-[48px] px-5 py-2.5 rounded-full border border-outline-variant bg-surface hover:bg-surface-variant text-on-surface font-semibold font-body text-sm flex items-center justify-center space-x-3 transition-all shadow-2xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GoogleIcon className="w-5 h-5" />
              )}
              <span>{authModalMode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}</span>
            </button>

            {/* Visual Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/60" />
              </div>
              <span className="relative bg-surface px-4 text-xs uppercase tracking-wider text-outline font-body font-semibold">
                or
              </span>
            </div>

            {/* Continue with Email Button */}
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setAuthMethod('email');
              }}
              className="w-full min-h-[48px] px-5 py-2.5 rounded-full bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] font-semibold font-body text-sm flex items-center justify-center space-x-2.5 transition-all shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>{authModalMode === 'signin' ? 'Continue with Email' : 'Sign up with Email'}</span>
            </button>
          </div>
        ) : (
          /* Step 2: Email & Credentials Form — password field appears here */
          <div>
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setAuthMethod('choice');
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-outline hover:text-primary transition-colors mb-4 cursor-pointer font-body"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Other sign in options</span>
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              {authModalMode === 'signup' && (
                <>
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g., Tunde Balogun"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    placeholder="e.g., 0801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </>
              )}

              <Input
                label="Email Address"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full min-h-[48px] space-x-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Please wait...</span>
                    </>
                  ) : (
                    <span>{authModalMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Bottom Toggle Note */}
        <div className="text-center mt-6 text-xs text-on-surface-variant font-body">
          {authModalMode === 'signin' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setAuthMethod('choice');
                }}
                className="text-primary font-semibold hover:underline ml-1 cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signin');
                  setAuthMethod('choice');
                }}
                className="text-primary font-semibold hover:underline ml-1 cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
