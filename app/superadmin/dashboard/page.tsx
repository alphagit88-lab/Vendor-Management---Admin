"use client";

import { useEffect, useState } from 'react';
import { Users, Store, Package, Activity, ArrowUpRight, ShoppingCart, LayoutDashboard, Download, ShieldAlert } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    admins: { value: 0, change: '0%' },
    staff: { value: 0, change: '0%' },
    shops: { value: 0, change: '0%' },
    items: { value: 0, change: '0%' },
    orders: { value: 0, change: '0%' }
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [statsRes, activityRes] = await Promise.all([
          fetch(`${API_URL}/dashboard/stats`, { headers }),
          fetch(`${API_URL}/dashboard/activities`, { headers })
        ]);

        const statsData = await statsRes.json();
        const activityData = await activityRes.json();

        if (statsData.success) setStats(statsData.data);
        if (activityData.success) setActivities(activityData.data);
      } catch (err) {
        console.error("Error fetching super admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { name: 'Active Admins', value: stats.admins?.value || 0, icon: ShieldAlert, change: stats.admins?.change || '0%', color: 'from-violet-500 to-indigo-600', bg: 'bg-violet-950/40 text-violet-400 border-violet-800/30' },
    { name: 'Active Staff', value: stats.staff?.value || 0, icon: Users, change: stats.staff?.change || '0%', color: 'from-blue-500 to-indigo-500', bg: 'bg-indigo-950/40 text-indigo-400 border-indigo-800/30' },
    { name: 'Registered Shops', value: stats.shops?.value || 0, icon: Store, change: stats.shops?.change || '0%', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30' },
    { name: 'Available Items', value: stats.items?.value || 0, icon: Package, change: stats.items?.change || '0%', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-950/40 text-amber-400 border-amber-800/30' },
    { name: 'Total Orders', value: stats.orders?.value || 0, icon: ShoppingCart, change: stats.orders?.change || '0%', color: 'from-fuchsia-400 to-purple-600', bg: 'bg-fuchsia-950/40 text-fuchsia-400 border-fuchsia-800/30' },
  ];

  if (loading) {
    return (
      <div className="p-2 space-y-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-center gap-6">
          <div className="space-y-3">
            <div className="h-10 w-72 bg-slate-900 rounded-2xl animate-pulse" />
            <div className="h-4 w-56 bg-slate-900/50 rounded-xl animate-pulse" />
          </div>
          <div className="h-8 w-32 bg-slate-900 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-sm animate-pulse flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl animate-pulse" />
                <div className="w-16 h-6 bg-slate-800/50 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-800/30 rounded-full animate-pulse" />
                <div className="h-10 w-32 bg-slate-800 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
              <LayoutDashboard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-200 uppercase tracking-tighter">Initializing Infrastructure Overview</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Querying central databases...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-white tracking-tight">Root Overview</h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Welcome back, System Owner. Here's your global console view.</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/SuperVendor_latest_version.apk"
            download
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-indigo-900/30"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD ANDROID CLIENT</span>
          </a>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-medium text-slate-300 shadow-inner">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Core Engines Operational</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="relative overflow-hidden bg-slate-900 p-6 rounded-2xl border border-slate-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-indigo-950/20 hover:border-slate-700 hover:-translate-y-1">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.05] rounded-bl-full -z-10`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl border ${stat.bg}`}>
                <stat.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-1">{stat.name}</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">
                {stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-950/60 rounded-xl border border-indigo-800/30 text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Global Operation Stream</h2>
          </div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 border border-indigo-900/50 px-3 py-1 rounded-full">System Feed</span>
        </div>

        <div className="divide-y divide-slate-800/80 bg-slate-900/40">
          {activities.length > 0 ? (
            activities.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl border ${
                    item.type === 'user'
                      ? item.role === 'admin'
                        ? 'bg-violet-950/40 text-violet-400 border-violet-900/40'
                        : 'bg-blue-950/40 text-blue-400 border-blue-900/40'
                      : item.type === 'customer'
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
                        : 'bg-amber-950/40 text-amber-400 border-amber-900/40'
                  }`}>
                    {item.type === 'user' ? (
                      item.role === 'admin' ? <ShieldAlert className="w-5 h-5" /> : <Users className="w-5 h-5" />
                    ) : item.type === 'customer' ? (
                      <Store className="w-5 h-5" />
                    ) : (
                      <ShoppingCart className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                    <p className="text-[12px] text-slate-400 font-medium">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center flex flex-col items-center justify-center bg-slate-950/30">
              <Activity className="w-12 h-12 text-slate-700 mb-4" />
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">No Operations Registered</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
