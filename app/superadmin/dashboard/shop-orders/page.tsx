"use client";

import { useEffect, useState } from "react";
import { Search, Eye, X, ShoppingBag, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";

type ShopOrderItem = {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type ShopOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  status: string;
  subtotal: number;
  totalAmount: number;
  currency: string;
  paidAt: string | null;
  createdAt: string;
  items?: ShopOrderItem[];
};

const STATUS_OPTIONS = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-950 text-amber-300",
  paid: "bg-emerald-950 text-emerald-300",
  processing: "bg-blue-950 text-blue-300",
  shipped: "bg-indigo-950 text-indigo-300",
  delivered: "bg-teal-950 text-teal-300",
  cancelled: "bg-slate-800 text-slate-400",
  failed: "bg-rose-950 text-rose-300",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function ShopOrdersPage() {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/shop/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error("Error fetching shop orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(term) ||
      order.customerName?.toLowerCase().includes(term) ||
      order.customerEmail?.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openOrderDetail = async (orderId: number) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_URL}/shop/orders/admin/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.data);
        setNewStatus(data.data.status);
      }
    } catch (err) {
      console.error("Error fetching order detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`${API_URL}/shop/orders/${selectedOrder.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.data);
        fetchOrders();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch {
      alert("Error updating order status");
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Shop Orders</h1>
        <p className="text-slate-400 mt-1">View and manage shop orders from Stripe checkout.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, customer, or email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">No shop orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-900/50">
                  <td className="px-5 py-4 font-semibold text-white">{order.orderNumber}</td>
                  <td className="px-5 py-4">
                    <p className="text-white">{order.customerName}</p>
                    <p className="text-slate-500 text-xs">{order.customerEmail}</p>
                  </td>
                  <td className="px-5 py-4 text-indigo-300 font-semibold">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        statusStyles[order.status] || "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openOrderDetail(order.id)}
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

      {(selectedOrder || detailLoading) && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading order...
              </div>
            ) : selectedOrder ? (
              <div className="p-5 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Order Number</p>
                    <p className="text-white font-semibold mt-1">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                    <span
                      className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        statusStyles[selectedOrder.status] || "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Customer</p>
                    <p className="text-white mt-1">{selectedOrder.customerName}</p>
                    <p className="text-slate-400 text-sm">{selectedOrder.customerEmail}</p>
                    {selectedOrder.customerPhone && (
                      <p className="text-slate-400 text-sm">{selectedOrder.customerPhone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Dates</p>
                    <p className="text-slate-300 text-sm mt-1">Created: {formatDate(selectedOrder.createdAt)}</p>
                    <p className="text-slate-300 text-sm">Paid: {formatDate(selectedOrder.paidAt)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Shipping Address</p>
                  <p className="text-slate-300 mt-1 whitespace-pre-line">{selectedOrder.shippingAddress}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-3">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-slate-950 border border-slate-800 rounded-lg px-4 py-3"
                      >
                        <div>
                          <p className="text-white font-medium">{item.productName}</p>
                          <p className="text-slate-500 text-xs">
                            {item.quantity} × ${item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-indigo-300 font-semibold">${item.lineTotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-slate-800">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-indigo-300 text-lg">
                      ${Number(selectedOrder.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-800">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={statusUpdating || newStatus === selectedOrder.status}
                    className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
                  >
                    {statusUpdating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
