"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Lock, User, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function SuperAdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        if (data.user.role !== 'super_admin') {
          setError('Access denied: Only the system owner (Super Admin) is authorized to access this workspace.');
          setLoading(false);
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/superadmin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-slate-100 font-sans">
      {/* Premium Visual Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-radial from-slate-900 via-slate-950 to-black relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        
        <div className="z-10 max-w-lg px-8 flex flex-col items-center justify-center text-center">
          <div className="relative p-0 bg-slate-900/80 rounded-xl shadow-2xl border border-indigo-500/30 backdrop-blur-xl animate-pulse">
            <div className="w-52 h-20 relative overflow-hidden">
              <Image
                src="/logo.png"
                alt="SuperVendor Logo"
                fill
                sizes="208px"
                className="object-contain rounded-md filter brightness-95"
                priority
              />
            </div>
            <div className="absolute -top-3 -right-3 bg-indigo-500 text-white rounded-full p-1.5 shadow-lg border border-indigo-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <p className="text-slate-400 mt-6 mb-8 leading-relaxed max-w-md">
            Execute global configuration, manage system operators, and overview database metrics from a single secure workspace.
          </p>

          <div className="flex gap-4 items-center justify-center">
            <div className="w-12 h-1 bg-indigo-500 rounded-full" />
            <div className="w-2 h-1 bg-indigo-900 rounded-full" />
            <div className="w-2 h-1 bg-indigo-950 rounded-full" />
          </div>
        </div>
      </div>

      {/* Login Form Panel */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-slate-950">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="relative p-0 bg-slate-900/80 rounded-xl shadow-xl border border-indigo-500/20">
                <div className="w-48 h-16 relative overflow-hidden">
                  <Image src="/logo.png" alt="SuperVendor Logo" fill sizes="192px" className="object-contain rounded-md" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">System Owner Sign in</h2>
            <p className="mt-2 text-sm text-slate-400">Authenticate to access root system configurations.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-rose-200 bg-rose-950/40 border border-rose-800/60 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-semibold block mb-0.5">Authentication Failed</span>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-3 py-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-sm text-white shadow-inner placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter superadmin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Root Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="block w-full pl-11 pr-11 py-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-sm text-white shadow-inner placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <Link
                    href="/forgot-password?return=/superadmin/login"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-indigo-500/20 rounded-2xl shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Decrypting Credentials...' : 'Sign in securely'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
