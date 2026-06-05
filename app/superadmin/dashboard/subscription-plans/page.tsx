"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Zap, Package2, Users, FileText, Users2, Truck, Warehouse, CheckSquare } from 'lucide-react';
import { API_URL } from '@/lib/config';
import ConfirmModal from '@/components/ConfirmModal';

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    product_limit: '0', 
    sales_person_limit: '0',
    price: '0.00',
    description: '',
    customer_limit: '0',
    van_limit: '0',
    warehouse_limit: '0',
    has_category_management: false
  });
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API_URL}/subscription-plans`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (err) {
      console.error("Error fetching subscription plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(plan => {
    const term = searchTerm.toLowerCase();
    return (
      plan.name?.toLowerCase().includes(term) ||
      plan.description?.toLowerCase().includes(term)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `${API_URL}/subscription-plans/${editId}` : `${API_URL}/subscription-plans`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          product_limit: parseInt(formData.product_limit) || 0,
          sales_person_limit: parseInt(formData.sales_person_limit) || 0,
          price: parseFloat(formData.price) || 0.00,
          customer_limit: parseInt(formData.customer_limit) || 0,
          van_limit: parseInt(formData.van_limit) || 0,
          warehouse_limit: parseInt(formData.warehouse_limit) || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchPlans();
        setShowModal(false);
        setFormData({ name: '', product_limit: '0', sales_person_limit: '0', price: '0.00', description: '', customer_limit: '0', van_limit: '0', warehouse_limit: '0', has_category_management: false });
        setIsEdit(false);
        setEditId(null);
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      alert(isEdit ? "Error updating subscription plan" : "Error adding subscription plan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: any) => {
    setFormData({
      name: plan.name,
      product_limit: String(plan.product_limit),
      sales_person_limit: String(plan.sales_person_limit),
      price: String(plan.price || '0.00'),
      description: plan.description || '',
      customer_limit: String(plan.customer_limit || '0'),
      van_limit: String(plan.van_limit || '0'),
      warehouse_limit: String(plan.warehouse_limit || '0'),
      has_category_management: plan.has_category_management || false
    });
    setEditId(plan.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/subscription-plans/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchPlans();
        setShowDeleteConfirm(false);
        setDeleteId(null);
      } else {
        alert(data.message || 'Deletion failed');
      }
    } catch (err) {
      alert("Error deleting subscription plan");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && plans.length === 0) {
    return (
      <div className="p-2 space-y-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-12 gap-6">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-slate-900 rounded-2xl animate-pulse" />
            <div className="h-4 w-48 bg-slate-900/50 rounded-xl animate-pulse" />
          </div>
          <div className="h-12 w-40 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
        </div>
        
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Subscription Plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-white tracking-tight">
            Subscription Plans
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            Manage and configure subscription tiers for administrator accounts.
          </p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setEditId(null);
            setFormData({ name: '', product_limit: '0', sales_person_limit: '0', price: '0.00', description: '', customer_limit: '0', van_limit: '0', warehouse_limit: '0', has_category_management: false });
            setShowModal(true);
          }}
          className="bg-indigo-600 shadow-lg shadow-indigo-900/30 text-white flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm hover:bg-indigo-500 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          Create Plan
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 mb-4 bg-slate-900/40">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map(plan => {
          return (
            <div 
              key={plan.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl transition-all hover:shadow-indigo-950/20 hover:border-indigo-500/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Subscription Tier</p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleEdit(plan)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                    title="Edit Plan"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(plan.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Price</span>
                  </div>
                  <span className="text-lg font-bold text-amber-400">${Number(plan.price || 0).toFixed(2)}</span>
                </div>

                {plan.description && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-3 h-3 text-indigo-400" />
                      <span className="text-xs font-semibold text-slate-400">Description</span>
                    </div>
                    <p className="text-xs text-slate-300">{plan.description}</p>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Package2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-400">Product Limit</span>
                  </div>
                  <span className="text-sm font-bold text-white">{plan.product_limit}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-400">Customer Limit</span>
                  </div>
                  <span className="text-sm font-bold text-white">{plan.customer_limit}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-400">Van Limit</span>
                  </div>
                  <span className="text-sm font-bold text-white">{plan.van_limit}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-400">Warehouse Limit</span>
                  </div>
                  <span className="text-sm font-bold text-white">{plan.warehouse_limit}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-400">Category Management</span>
                  </div>
                  <span className={`text-xs font-bold ${plan.has_category_management ? 'text-green-400' : 'text-slate-500'}`}>
                    {plan.has_category_management ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPlans.length === 0 && !loading && (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <Zap className="w-12 h-12 text-slate-700 mb-4 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No subscription plans yet</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">Get started by creating your first subscription plan tier.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-slate-200">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-indigo-400" />
                {isEdit ? 'Update Subscription Plan' : 'Create Subscription Plan'}
              </h2>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 flex-1 overflow-y-auto font-medium">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Plan Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                    placeholder="E.g. Basic, Pro, Enterprise" 
                    required
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Description</label>
                  <textarea
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium resize-none h-20"
                    placeholder="Describe what this plan includes..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                        placeholder="0.00"
                        value={formData.price} 
                        onChange={e => setFormData({ ...formData, price: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Product Limit</label>
                    <div className="relative">
                      <Package2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="number" 
                        min="0"
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                        placeholder="0"
                        value={formData.product_limit} 
                        onChange={e => setFormData({ ...formData, product_limit: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Customer Limit</label>
                    <div className="relative">
                      <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="number" 
                        min="0"
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                        placeholder="0"
                        value={formData.customer_limit} 
                        onChange={e => setFormData({ ...formData, customer_limit: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Van Limit</label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="number" 
                        min="0"
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                        placeholder="0"
                        value={formData.van_limit} 
                        onChange={e => setFormData({ ...formData, van_limit: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Warehouse Limit</label>
                    <div className="relative">
                      <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="number" 
                        min="0"
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                        placeholder="0"
                        value={formData.warehouse_limit} 
                        onChange={e => setFormData({ ...formData, warehouse_limit: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Salespersons Limit</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="number" 
                        min="0"
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                        placeholder="0"
                        value={formData.sales_person_limit} 
                        onChange={e => setFormData({ ...formData, sales_person_limit: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="has_category_management"
                    checked={formData.has_category_management}
                    onChange={(e) => setFormData({ ...formData, has_category_management: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 bg-slate-950 border-slate-700 rounded focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <label htmlFor="has_category_management" className="text-sm font-medium text-slate-200">
                    Enable Category Management
                  </label>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 flex justify-end gap-3 bg-slate-900 mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-bold text-slate-400 rounded-lg hover:bg-slate-800 transition uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-900/30 transition disabled:opacity-50 uppercase text-[10px] tracking-widest">
                  {loading ? 'Processing...' : (isEdit ? 'Update Plan' : 'Create Plan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Subscription Plan"
        message="Are you sure you want to delete this subscription plan? Any admins assigned to this plan will lose their plan and revert to no plan."
      />
    </div>
  );
}
