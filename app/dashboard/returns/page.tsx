"use client";
import { useState, useEffect } from 'react';
import { RotateCcw, Search, Trash2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';

export default function ReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReturns = async () => {
    try {
      const res = await fetch(`${API_URL}/returns`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setReturns(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const filteredReturns = returns.filter(r => 
    r.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/returns/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchReturns();
        setShowDeleteConfirm(false);
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && returns.length === 0) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-400 mx-auto">
        <div className="flex justify-between items-center mb-12 gap-6">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-4 w-48 bg-slate-50 rounded-xl animate-pulse" />
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-50 border-t-indigo-600 rounded-full animate-spin" />
              <RotateCcw className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Loading credits data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Credits Management</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Track credited items from customers.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by product or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
            />
          </div>
          {searchTerm && (
            <span className="ml-4 text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300">
              Found {filteredReturns.length} results
            </span>
          )}
        </div>

        <div className="">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Item</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Customer</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Sales Person</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Quantity</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Reason</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Timestamp</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredReturns.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-800">
                    {r.item_number} - {r.item_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {r.customer_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {r.user_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-indigo-600">
                    {r.quantity}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {r.reason || '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button 
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                      title="Delete Credit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReturns.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center">
              <RotateCcw className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No credits yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Track credited items once submitted from mobile.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Credit Record"
        message="Are you sure you want to delete this credit record? This will permanently remove it."
      />
    </div>
  );
}
