"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Users, Eye, EyeOff, ShieldAlert, AlertTriangle } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', username: '', email: '', password: '', role: 'staff', inventory_location: '', admin_id: '' });
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeAdminId, setActiveAdminId] = useState<number | 'unassigned' | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        
        setActiveAdminId(prev => {
          if (prev !== null) return prev;
          const firstAdmin = data.data.find((u: any) => u.role === 'admin');
          return firstAdmin ? firstAdmin.id : 'unassigned';
        });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const admins = users.filter(u => u.role === 'admin');
  const staff = users.filter(u => u.role === 'staff');
  const unassignedStaff = staff.filter(u => !u.admin_id);

  const filteredAdmins = admins.filter(admin => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    const adminMatches = (
      admin.name?.toLowerCase().includes(term) ||
      admin.phone?.toLowerCase().includes(term) ||
      admin.email?.toLowerCase().includes(term) ||
      admin.inventory_location?.toLowerCase().includes(term)
    );
    if (adminMatches) return true;

    const hasMatchingSalesperson = staff.some(s => 
      s.admin_id === admin.id && (
        s.name?.toLowerCase().includes(term) ||
        s.phone?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.inventory_location?.toLowerCase().includes(term)
      )
    );
    return hasMatchingSalesperson;
  });

  const scopedStaff = staff.filter(s => {
    if (activeAdminId === 'unassigned') {
      if (s.admin_id) return false;
    } else {
      if (s.admin_id !== activeAdminId) return false;
    }

    const term = searchTerm.toLowerCase();
    if (!term) return true;

    return (
      s.name?.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.inventory_location?.toLowerCase().includes(term)
    );
  });

  const selectedAdmin = admins.find(a => a.id === activeAdminId);
  const selectedAdminName = selectedAdmin ? selectedAdmin.name : 'Administrator';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `${API_URL}/users/${editId}` : `${API_URL}/users`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const requestData = {
        ...formData,
        username: formData.role === 'admin' ? '' : formData.username,
        admin_id: formData.role === 'staff' && formData.admin_id ? parseInt(formData.admin_id) : null,
        inventory_location: formData.role === 'admin' ? '' : formData.inventory_location
      };
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
        setShowModal(false);
        setShowPassword(false);
        setFormData({ name: '', phone: '', username: '', email: '', password: '', role: 'staff', inventory_location: '', admin_id: '' });
        setIsEdit(false);
        setEditId(null);
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      alert(isEdit ? "Error updating user" : "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name,
      username: user.username || '',
      phone: user.phone,
      email: user.email || '',
      password: '',
      role: user.role,
      inventory_location: user.inventory_location || '',
      admin_id: user.admin_id ? String(user.admin_id) : ''
    });
    setEditId(user.id);
    setIsEdit(true);
    setShowPassword(false);
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
      const res = await fetch(`${API_URL}/users/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        if (deleteId === activeAdminId) {
          setActiveAdminId(null);
        }
        fetchUsers();
        setShowDeleteConfirm(false);
        setDeleteId(null);
      } else {
        alert(data.message || 'Deletion failed');
      }
    } catch (err) {
      alert("Error deleting user");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && users.length === 0) {
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
              <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Assembling Team Matrix...</p>
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
            User Directory
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            Manage administrators and their associated sales teams.
          </p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setEditId(null);
            setShowPassword(false);
            setFormData({ name: '', phone: '', username: '', email: '', password: '', role: 'admin', inventory_location: '', admin_id: '' });
            setShowModal(true);
          }}
          className="bg-indigo-600 shadow-lg shadow-indigo-900/30 text-white flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm hover:bg-indigo-500 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Administrator
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 mb-4 bg-slate-900/40">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, phone, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Administrators
            </h2>
            <span className="text-xs bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
              {admins.length} registered
            </span>
          </div>

          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            <div 
              onClick={() => setActiveAdminId('unassigned')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                activeAdminId === 'unassigned'
                  ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-950/20'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/30'
              }`}
            >
              <div>
                <div className="text-sm font-bold text-slate-200">Unassigned Staff</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Salespeople without parent administrator</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                unassignedStaff.length > 0 
                  ? 'bg-amber-950/60 text-amber-400 border-amber-900/40' 
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}>
                {unassignedStaff.length}
              </span>
            </div>

            {filteredAdmins.map(admin => {
              const adminStaffCount = staff.filter(u => u.admin_id === admin.id).length;
              const isSelected = activeAdminId === admin.id;
              return (
                <div 
                  key={admin.id}
                  onClick={() => setActiveAdminId(admin.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-950/20'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/30'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-200 truncate">{admin.name}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-medium truncate">{admin.phone}</div>
                    <div className="text-xs text-slate-500 font-medium truncate">{admin.email || '—'}</div>
                    {admin.inventory_location && (
                      <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{admin.inventory_location}</div>
                    )}
                  </div>
                  <div className="flex flex-col items-end justify-between h-full gap-4 shrink-0 self-stretch">
                    <span className="text-xs bg-slate-900 border border-slate-800 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                      {adminStaffCount} staff
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(admin);
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition"
                        title="Edit Admin"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(admin.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                        title="Delete Admin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredAdmins.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs italic">
                No administrators match the search criteria.
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl min-h-[60vh] flex flex-col">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/40">
            <div>
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                {activeAdminId === 'unassigned' 
                  ? 'Unassigned Salespeople' 
                  : `Sales Team: ${selectedAdminName}`
                }
              </h2>
              <p className="text-xs text-slate-450 mt-0.5">
                {activeAdminId === 'unassigned' 
                  ? 'Staff members not assigned to any administrator.' 
                  : `Manage salespeople assigned to ${selectedAdminName}.`
                }
              </p>
            </div>
            <button
              onClick={() => {
                setIsEdit(false);
                setEditId(null);
                setShowPassword(false);
                setFormData({ 
                  name: '', 
                  phone: '', 
                  username: '', 
                  email: '', 
                  password: '', 
                  role: 'staff', 
                  inventory_location: '', 
                  admin_id: typeof activeAdminId === 'number' ? String(activeAdminId) : '' 
                });
                setShowModal(true);
              }}
              className="bg-indigo-600 shadow-md shadow-indigo-900/30 text-white flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-500 transition-all font-semibold shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Salesperson
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/20">
                {scopedStaff.map(staff => (
                  <tr key={staff.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-200">{staff.name}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-300">{staff.phone}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-sm text-slate-400 font-medium">{staff.email || '—'}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {staff.inventory_location ? (
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{staff.inventory_location}</span>
                      ) : (
                        <span className="text-xs text-slate-650 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleEdit(staff)}
                          className="p-1.5 text-indigo-400 hover:bg-slate-800 rounded transition"
                          title="Edit Salesperson"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(staff.id)}
                          className="p-1.5 text-rose-400 hover:bg-slate-800 rounded transition"
                          title="Delete Salesperson"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {scopedStaff.length === 0 && (
              <div className="p-16 text-center flex flex-col items-center justify-center">
                <Users className="w-12 h-12 text-slate-700 mb-4" />
                <h3 className="text-base font-bold text-slate-300">No salespeople assigned</h3>
                <p className="text-slate-500 mt-2 max-w-sm text-xs">Click "+ Add Salesperson" to assign staff members to this administrator.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-slate-200">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-indigo-400" />
                {isEdit ? 'Modify Personnel Record' : (formData.role === 'admin' ? 'Provision New Administrator' : 'Provision New Salesperson')}
              </h2>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" className="px-8 py-6 space-y-6 flex-1 overflow-y-auto font-medium">
              {/* Dummy inputs to prevent Chrome autofill */}
              <input type="text" name="chrome-autofill-dummy-username" style={{ position: 'absolute', top: '-1000px', left: '-1000px', width: '1px', height: '1px', opacity: 0 }} tabIndex={-1} readOnly />
              <input type="password" name="chrome-autofill-dummy-password" style={{ position: 'absolute', top: '-1000px', left: '-1000px', width: '1px', height: '1px', opacity: 0 }} tabIndex={-1} readOnly />

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    autoComplete="off"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                    placeholder="E.g. Jane Doe" 
                    required
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>

                <div className={formData.role === 'staff' ? "grid grid-cols-2 gap-4" : ""}>
                  <div className={formData.role === 'staff' ? "" : "w-full"}>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Access Role</label>
                    <select
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium"
                      value={formData.role}
                      onChange={e => {
                        const newRole = e.target.value;
                        setFormData({ 
                          ...formData, 
                          role: newRole,
                          admin_id: newRole === 'admin' ? '' : formData.admin_id,
                          inventory_location: newRole === 'admin' ? '' : formData.inventory_location,
                          username: newRole === 'admin' ? '' : formData.username
                        });
                      }}
                      disabled={isEdit}
                    >
                      <option value="staff">Staff Member / Salesperson</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  {formData.role === 'staff' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Username</label>
                      <input 
                        type="text" 
                        autoComplete="off"
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                        placeholder="janedoe" 
                        value={formData.username} 
                        onChange={e => setFormData({ ...formData, username: e.target.value })} 
                      />
                    </div>
                  )}
                </div>

                {formData.role === 'staff' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Parent Administrator</label>
                    <select
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium"
                      value={formData.admin_id}
                      onChange={e => setFormData({ ...formData, admin_id: e.target.value })}
                    >
                      <option value="">None (Unassigned)</option>
                      {admins.map(admin => (
                        <option key={admin.id} value={admin.id}>{admin.name} ({admin.phone})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      autoComplete="off"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                      placeholder="jane@company.com" 
                      required
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="text" 
                      autoComplete="off"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                      placeholder="0771234567" 
                      required
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                    />
                  </div>
                </div>

                {formData.role !== 'admin' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Assigned Location</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-medium" 
                      placeholder="e.g. Kandy, Colombo, Galle"
                      value={formData.inventory_location} 
                      onChange={e => setFormData({ ...formData, inventory_location: e.target.value })} 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">{isEdit ? 'Change Password (Leave blank to keep current)' : 'Account Password'}</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      autoComplete="new-password"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-lg transition text-sm outline-none text-white font-mono" 
                      placeholder={isEdit ? "••••••••" : "Enter password"} 
                      required={!isEdit}
                      value={formData.password} 
                      onChange={e => setFormData({ ...formData, password: e.target.value })} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 flex justify-end gap-3 bg-slate-900 mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-bold text-slate-400 rounded-lg hover:bg-slate-800 transition uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-900/30 transition disabled:opacity-50 uppercase text-[10px] tracking-widest">
                  {loading ? 'Processing...' : (isEdit ? 'Save Changes' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowDeleteConfirm(false)} />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-slate-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-950/40 border border-rose-900/30 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Revoke Account Access</h2>
                  <p className="text-sm text-slate-400 mt-1">Are you sure you want to delete this user? They will immediately lose access to the system.</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirm(false)} 
                disabled={isDeleting}
                className="px-5 py-2 text-sm font-semibold text-slate-400 rounded-xl hover:bg-slate-900 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-500 shadow-md transition disabled:opacity-50"
              >
                {isDeleting ? "Revoking..." : "Revoke Access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
