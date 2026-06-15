"use client";

import { useEffect, useState } from "react";
import { Search, Eye, X, CreditCard, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";

type SubscriptionPayment = {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  subscriptionPlanId: number;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  purchaseType: string;
  stripeSessionId: string | null;
  paidAt: string | null;
  createdAt: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-950 text-amber-300",
  paid: "bg-emerald-950 text-emerald-300",
  cancelled: "bg-slate-800 text-slate-400",
  failed: "bg-rose-950 text-rose-300",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function SubscriptionPaymentsPage() {
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<SubscriptionPayment | null>(null);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_URL}/subscriptions/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setPayments(data.data);
    } catch (err) {
      console.error("Error fetching subscription payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      payment.planName?.toLowerCase().includes(term) ||
      payment.userName?.toLowerCase().includes(term) ||
      payment.userEmail?.toLowerCase().includes(term) ||
      String(payment.id).includes(term);
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Subscription Payments</h1>
        <p className="text-slate-400 mt-1">
          One-time subscription purchases via Stripe. Separate from shop orders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Payments</p>
          <p className="text-2xl font-bold text-white mt-1">{payments.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase">Paid</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {payments.filter((p) => p.status === "paid").length}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase">Revenue (Paid)</p>
          <p className="text-2xl font-bold text-indigo-300 mt-1">${totalPaid.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by admin, email, plan..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading payments...</p>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <CreditCard className="w-12 h-12 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">No subscription payments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Admin</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Paid At</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-900/50">
                  <td className="px-5 py-4 text-slate-400">#{payment.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-white font-medium">{payment.userName || "—"}</p>
                    <p className="text-slate-500 text-xs">{payment.userEmail}</p>
                  </td>
                  <td className="px-5 py-4 text-white">{payment.planName}</td>
                  <td className="px-5 py-4 text-indigo-300 font-semibold">
                    ${Number(payment.amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-slate-400 capitalize">{payment.purchaseType}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        statusStyles[payment.status] || "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(payment.paidAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPayment && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Payment Details</h2>
              <button onClick={() => setSelectedPayment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Payment ID</p>
                  <p className="text-white mt-1">#{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                  <span
                    className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      statusStyles[selectedPayment.status] || "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Admin User</p>
                <p className="text-white mt-1">{selectedPayment.userName}</p>
                <p className="text-slate-400">{selectedPayment.userEmail}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Plan</p>
                <p className="text-white mt-1">{selectedPayment.planName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Amount</p>
                  <p className="text-indigo-300 font-bold text-lg mt-1">
                    ${Number(selectedPayment.amount).toFixed(2)} {selectedPayment.currency.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Purchase Type</p>
                  <p className="text-white mt-1 capitalize">{selectedPayment.purchaseType}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Created</p>
                <p className="text-slate-300 mt-1">{formatDate(selectedPayment.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Paid At</p>
                <p className="text-slate-300 mt-1">{formatDate(selectedPayment.paidAt)}</p>
              </div>
              {selectedPayment.stripeSessionId && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Stripe Session</p>
                  <p className="text-slate-400 mt-1 font-mono text-xs break-all">
                    {selectedPayment.stripeSessionId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
