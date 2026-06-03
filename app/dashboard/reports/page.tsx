"use client";
import { useState, useEffect } from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);

  // Filters
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchCustomers = async () => {
    setCustomersLoading(true);
    try {
      const res = await fetch(`${API_URL}/customers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCustomersLoading(false);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCustomerId) {
        const customer = customers.find(c => c.id === parseInt(selectedCustomerId));
        if (customer) params.append('customerName', customer.name);
      }
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`${API_URL}/reports/combined?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFontSize(16);
    doc.text('Reports', 14, 15);

    const tableData = data.map(item => [
      item.number,
      item.load_number || '—',
      item.customer_name,
      item.user_name,
      `$${parseFloat(item.total_credits || 0).toFixed(2)}`,
      `$${parseFloat(item.total_deposit || 0).toFixed(2)}`,
      `$${parseFloat(item.total_amount).toFixed(2)}`,
      item.status,
      new Date(item.created_at).toLocaleString()
    ]);

    autoTable(doc, {
      head: [['Order #', 'Load #', 'Service Shop', 'Sales Person', 'Credits', 'Deposits', 'Total Value', 'Status', 'Timestamp']],
      body: tableData,
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [22, 65, 116], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    doc.save('reports.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
      'Order #': item.number,
      'Load #': item.load_number || '—',
      'Service Shop': item.customer_name,
      'Sales Person': item.user_name,
      'Credits': `$${parseFloat(item.total_credits || 0).toFixed(2)}`,
      'Deposits': `$${parseFloat(item.total_deposit || 0).toFixed(2)}`,
      'Total Value': `$${parseFloat(item.total_amount).toFixed(2)}`,
      'Status': item.status,
      'Timestamp': new Date(item.created_at).toLocaleString()
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'reports.xlsx');
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      fetchReport();
    }
  }, [selectedCustomerId, startDate, endDate, customers]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Reports</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">View all orders and returns with export options.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden min-h-[60vh] flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer:</label>
            <select 
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">All Customers</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date:</label>
            <input 
              type="date" 
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date:</label>
            <input 
              type="date" 
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          <div className="ml-auto flex gap-3">
            <button 
              onClick={exportToPDF}
              disabled={data.length === 0}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
                data.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Export as PDF
            </button>
            <button 
              onClick={exportToExcel}
              disabled={data.length === 0}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
                data.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export as Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Order #</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Load #</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Service Shop</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Sales Person</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Credits</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Deposits</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Total Value</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Status</th>
                <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-left font-sans">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-mono font-bold text-gray-900">
                    {item.number}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-xs font-mono text-gray-500">
                    {item.load_number || '—'}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-semibold text-gray-700">
                    {item.customer_name}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-600">
                    {item.user_name}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-red-500">
                    -${parseFloat(item.total_credits || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-emerald-600">
                    +${parseFloat(item.total_deposit || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-sm font-bold text-blue-600">
                    ${parseFloat(item.total_amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                      item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      item.status === 'returned' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && !loading && (
            <div className="p-16 text-center flex flex-col items-center">
              <h3 className="text-lg font-bold text-slate-900">No matching records</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Adjust your search criteria to find specific records.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
