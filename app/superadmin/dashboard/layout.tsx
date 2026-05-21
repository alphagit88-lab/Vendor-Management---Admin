"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, LogOut, ShieldAlert, Settings } from 'lucide-react';

export default function SuperAdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/superadmin/login');
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'super_admin') {
          router.push('/superadmin/login');
        } else {
          setUser({ name: payload.name || 'Super Admin', role: payload.role || 'super_admin' });
        }
      } catch (e) {
        router.push('/superadmin/login');
      }
    }
  }, [router]);

  if (!mounted) return null;

  const navLinks = [
    { name: 'Root Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/superadmin/dashboard/users', icon: Users },
  ];

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-indigo-900 selection:text-indigo-200">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
        <div>
          <div className="h-24 flex items-center justify-center px-4 border-b border-slate-800">
            <Link href="/superadmin/dashboard" className="w-full">
              <div className="relative w-full h-16 bg-slate-950 rounded-xl shadow-md border border-slate-800 overflow-hidden p-1 flex items-center justify-center gap-3">
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src="/logon.jpeg"
                    alt="VendorOS Logo"
                    fill
                    sizes="40px"
                    className="object-contain rounded-md"
                    priority
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14px] font-black tracking-tight text-white uppercase leading-none">VendorOS</span>
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">Root Console</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="px-4 py-6">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Core Infrastructure</p>
            <nav className="flex flex-col gap-1.5 border-none">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-indigo-950/80 text-indigo-200 shadow-sm ring-1 ring-indigo-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={`text-[15px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{link.name}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 m-4 rounded-xl">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="p-1.5 bg-indigo-950/80 rounded-lg border border-indigo-500/20 text-indigo-400">
              <ShieldAlert className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-slate-200 uppercase tracking-tight">{user?.name}</span>
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Root Owner</span>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/superadmin/login');
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-900/50 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-y-auto w-full text-slate-100 bg-slate-950">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
