"use client";

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import { API_URL } from '@/lib/config';

type Step = 'identifier' | 'otp' | 'password' | 'done';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get('method') === 'email' ? 'email' : 'phone';
  const returnTo = searchParams.get('return') || '/login';

  const [step, setStep] = useState<Step>('identifier');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [resendAfter, setResendAfter] = useState(0);
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    if (resendAfter <= 0) return;
    const timer = setInterval(() => {
      setResendAfter((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendAfter]);

  const identifierPayload = useCallback(() => {
    if (method === 'email') return { email };
    if (returnTo.includes('superadmin')) return { username };
    return { phone };
  }, [method, email, phone, username, returnTo]);

  const sendOtp = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(identifierPayload()),
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.maskedPhone) {
        if (data.resendAfter) setResendAfter(data.resendAfter);
        setError(data.message || 'Unable to send verification code');
        return;
      }

      setMaskedPhone(data.maskedPhone);
      setResendAfter(data.resendAfter || 60);
      setStep('otp');
    } catch {
      setError('Connection to server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOtp();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...identifierPayload(), otp }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Invalid verification code');
        return;
      }

      setResetToken(data.resetToken);
      setStep('password');
    } catch {
      setError('Connection to server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Unable to reset password');
        return;
      }

      setStep('done');
    } catch {
      setError('Connection to server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitle =
    step === 'identifier'
      ? 'Reset your password'
      : step === 'otp'
        ? 'Enter verification code'
        : step === 'password'
          ? 'Create new password'
          : 'Password updated';

  const stepDescription =
    step === 'identifier'
      ? 'We will send a one-time code to your registered phone number.'
      : step === 'otp'
        ? `Enter the 6-digit code sent to ${maskedPhone || 'your phone'}.`
        : step === 'password'
          ? 'Choose a strong password for your account.'
          : 'You can now sign in with your new password.';

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/50 to-slate-900 pointer-events-none" />
        <div className="z-10 max-w-lg px-8 flex flex-col items-center justify-center">
          <div className="w-52 h-20 relative overflow-hidden bg-white rounded-md shadow-lg border border-gray-100">
            <div className="relative w-full h-full">
              <Image src="/logo.png" alt="SuperVendor" fill sizes="208px" className="object-contain rounded-md" priority />
            </div>
          </div>
          <p className="text-lg text-slate-300 mt-8 mb-8 leading-relaxed text-center">
            Secure password recovery with SMS verification.
          </p>
          <div className="flex gap-4 items-center">
            <div className="w-12 h-1 bg-indigo-500 rounded-full" />
            <div className="w-2 h-1 bg-slate-700 rounded-full" />
            <div className="w-2 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          <Link
            href={returnTo}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{stepTitle}</h2>
            <p className="mt-2 text-sm text-gray-500">{stepDescription}</p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
              <span className="shrink-0 animate-pulse">●</span> {error}
            </div>
          )}

          {step === 'identifier' && (
            <form onSubmit={handleIdentifierSubmit} className="space-y-6">
              {method === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              ) : returnTo.includes('superadmin') ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Enter your registered phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? 'Sending code...' : 'Send verification code'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm tracking-[0.3em] font-semibold shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? 'Verifying...' : 'Verify code'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>

              <div className="text-center text-sm text-gray-500">
                {resendAfter > 0 ? (
                  <span>Resend code in {resendAfter}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading}
                    className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                  >
                    Resend verification code
                  </button>
                )}
              </div>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="block w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? 'Updating password...' : 'Update password'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-gray-500">Your password has been reset successfully.</p>
              <button
                onClick={() => router.push(returnTo)}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
