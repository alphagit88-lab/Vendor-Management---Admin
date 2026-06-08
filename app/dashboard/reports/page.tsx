"use client";
import { useState, useEffect } from 'react';
import { FileText, FileSpreadsheet, TrendingUp, BarChart3, ShoppingCart, Users, Truck, Calendar } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

type ReportTab = 'item-sale' | 'sale-report' | 'top-items' | 'top-salespeople' | 'top-customers';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('item-sale');
  const [loading, setLoading] = useState(true);
  
  // Common filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  // Report data
  const [itemSaleData, setItemSaleData] = useState<any[]>([]);
  const [saleReportData, setSaleReportData] = useState<any[]>([]);
  const [topItemsData, setTopItemsData] = useState<any[]>([]);
  const [topSalespeopleData, setTopSalespeopleData] = useState<any[]>([]);
  const [topCustomersData, setTopCustomersData] = useState<any[]>([]);
  const [monthlyCustomersData, setMonthlyCustomersData] = useState<any[]>([]);
  const [monthlySalespeopleData, setMonthlySalespeopleData] = useState<any[]>([]);

  // Tab sub-navigation
  const [saleReportSubTab, setSaleReportSubTab] = useState<'time-period' | 'monthly-customers' | 'monthly-salespeople'>('time-period');

  const fetchItemSaleReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`${API_URL}/reports/item-sale?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      if (result.success) setItemSaleData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaleReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (year) params.append('year', year);

      // Fetch all sale report data
      const [timeRes, monthlyCustRes, monthlySalesRes] = await Promise.all([
        fetch(`${API_URL}/reports/time-period?${new URLSearchParams({ startDate: startDate || '', endDate: endDate || '' })}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_URL}/reports/monthly-customers?year=${year}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_URL}/reports/monthly-salespeople?year=${year}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const timeResult = await timeRes.json();
      const monthlyCustResult = await monthlyCustRes.json();
      const monthlySalesResult = await monthlySalesRes.json();

      if (timeResult.success) setSaleReportData(timeResult.data);
      if (monthlyCustResult.success) setMonthlyCustomersData(monthlyCustResult.data);
      if (monthlySalesResult.success) setMonthlySalespeopleData(monthlySalesResult.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`${API_URL}/reports/top-items?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      if (result.success) setTopItemsData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSalespeople = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`${API_URL}/reports/top-salespeople?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      if (result.success) setTopSalespeopleData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`${API_URL}/reports/top-customers?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      if (result.success) setTopCustomersData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = (title: string, headers: string[], data: any[][]) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFontSize(16);
    doc.text(title, 14, 15);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [22, 65, 116], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const exportToExcel = (title: string, data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
  };

  useEffect(() => {
    switch (activeTab) {
      case 'item-sale':
        fetchItemSaleReport();
        break;
      case 'sale-report':
        fetchSaleReport();
        break;
      case 'top-items':
        fetchTopItems();
        break;
      case 'top-salespeople':
        fetchTopSalespeople();
        break;
      case 'top-customers':
        fetchTopCustomers();
        break;
    }
  }, [activeTab, startDate, endDate, year]);

  const tabs = [
    { id: 'item-sale', label: 'Item Sale', icon: ShoppingCart },
    { id: 'sale-report', label: 'Sale Report', icon: TrendingUp },
    { id: 'top-items', label: 'Top Items', icon: BarChart3 },
    { id: 'top-salespeople', label: 'Top Salespeople', icon: Users },
    { id: 'top-customers', label: 'Top Customers', icon: Truck },
  ];

  const saleReportSubTabs = [
    { id: 'time-period', label: 'Time Period', icon: Calendar },
    { id: 'monthly-customers', label: 'Monthly by Customer', icon: Users },
    { id: 'monthly-salespeople', label: 'Monthly by Salesperson', icon: Users },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Reports</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">View detailed reports on sales, items, and customers.</p>
      </div>

      {/* Main Tabs */}
      <div className="bg-white rounded-t-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-x border-t border-gray-100">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ReportTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4 bg-gray-50/50">
          {/* Date range filters for all tabs except sale-report's monthly views */}
          {!(activeTab === 'sale-report' && (saleReportSubTab === 'monthly-customers' || saleReportSubTab === 'monthly-salespeople')) ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          ) : null}
          {/* Year filter for sale-report's monthly views */}
          {(activeTab === 'sale-report' && (saleReportSubTab === 'monthly-customers' || saleReportSubTab === 'monthly-salespeople')) ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year</label>
              <input
                type="number"
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow w-32"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2020"
                max="2030"
              />
            </div>
          ) : null}
        </div>

        {/* Sale Report Sub Tabs */}
        {activeTab === 'sale-report' && (
          <div className="flex border-b border-gray-100 bg-gray-50/30">
            {saleReportSubTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSaleReportSubTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    saleReportSubTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Report Content */}
        <div className="p-4 min-h-[50vh]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : (
            renderReportContent()
          )}
        </div>
      </div>
    </div>
  );

  function renderReportContent() {
    switch (activeTab) {
      case 'item-sale':
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  const headers = ['Item Code', 'Item Name', 'Current Inventory', 'Total Sold', 'Cost Price', 'Avg Sale Price', 'Total Revenue', 'Total Profit'];
                  const data = itemSaleData.map(item => [
                    item.item_number || '—',
                    item.description_name,
                    item.current_inventory || 0,
                    item.total_sold || 0,
                    `$${parseFloat(item.cost_price || 0).toFixed(2)}`,
                    `$${parseFloat(item.average_sale_price || 0).toFixed(2)}`,
                    `$${parseFloat(item.total_revenue || 0).toFixed(2)}`,
                    `$${parseFloat(item.total_profit || 0).toFixed(2)}`
                  ]);
                  exportToPDF('Item Sale Report', headers, data);
                }}
                disabled={itemSaleData.length === 0}
                className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => exportToExcel('Item Sale Report', itemSaleData)}
                disabled={itemSaleData.length === 0}
                className="ml-3 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Item Code</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Item Name</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Current Inventory</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Total Sold</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Cost Price</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Avg Sale Price</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Total Revenue</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Total Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {itemSaleData.map((item) => (
                  <tr key={item.item_id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-600">{item.item_number || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{item.description_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-700">{item.current_inventory || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-blue-600">{item.total_sold || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">${parseFloat(item.cost_price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">${parseFloat(item.average_sale_price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-blue-700">${parseFloat(item.total_revenue || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-emerald-600">${parseFloat(item.total_profit || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {itemSaleData.length === 0 && <div className="p-12 text-center text-gray-500">No data available</div>}
          </div>
        );

      case 'sale-report':
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  let headers: string[], data: any[][];
                  if (saleReportSubTab === 'time-period') {
                    headers = ['Order #', 'Customer', 'Salesperson', 'Total Amount', 'Status', 'Date'];
                    data = saleReportData.map(item => [
                      item.order_number,
                      item.customer_name,
                      item.salesperson_name || '—',
                      `$${parseFloat(item.total_amount).toFixed(2)}`,
                      item.status,
                      new Date(item.created_at).toLocaleString()
                    ]);
                  } else if (saleReportSubTab === 'monthly-customers') {
                    headers = ['Customer', 'Month', 'Year', 'Orders', 'Total Sales'];
                    data = monthlyCustomersData.map(item => [
                      item.name || item.dba,
                      item.month || '—',
                      item.year || '—',
                      item.order_count || 0,
                      `$${parseFloat(item.total_sales || 0).toFixed(2)}`
                    ]);
                  } else {
                    headers = ['Salesperson', 'Month', 'Year', 'Orders', 'Total Sales'];
                    data = monthlySalespeopleData.map(item => [
                      item.salesperson_name,
                      item.month || '—',
                      item.year || '—',
                      item.order_count || 0,
                      `$${parseFloat(item.total_sales || 0).toFixed(2)}`
                    ]);
                  }
                  exportToPDF('Sale Report', headers, data);
                }}
                disabled={(saleReportSubTab === 'time-period' && saleReportData.length === 0) ||
                         (saleReportSubTab === 'monthly-customers' && monthlyCustomersData.length === 0) ||
                         (saleReportSubTab === 'monthly-salespeople' && monthlySalespeopleData.length === 0)}
                className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => {
                  if (saleReportSubTab === 'time-period') {
                    exportToExcel('Sale Report - Time Period', saleReportData);
                  } else if (saleReportSubTab === 'monthly-customers') {
                    exportToExcel('Sale Report - Monthly by Customer', monthlyCustomersData);
                  } else {
                    exportToExcel('Sale Report - Monthly by Salesperson', monthlySalespeopleData);
                  }
                }}
                disabled={(saleReportSubTab === 'time-period' && saleReportData.length === 0) ||
                         (saleReportSubTab === 'monthly-customers' && monthlyCustomersData.length === 0) ||
                         (saleReportSubTab === 'monthly-salespeople' && monthlySalespeopleData.length === 0)}
                className="ml-3 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </button>
            </div>

            {saleReportSubTab === 'time-period' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Order #</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Customer</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Salesperson</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Total Amount</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Status</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {saleReportData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono font-bold text-gray-900">{item.order_number}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-700">{item.customer_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.salesperson_name || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-blue-600">${parseFloat(item.total_amount).toFixed(2)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {saleReportSubTab === 'monthly-customers' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Customer</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Month</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Year</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Orders</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Total Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {monthlyCustomersData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{item.name || item.dba}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-700">{item.month || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-700">{item.year || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-blue-600">{item.order_count || 0}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-emerald-600">${parseFloat(item.total_sales || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {saleReportSubTab === 'monthly-salespeople' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Salesperson</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Month</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Year</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Orders</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Total Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {monthlySalespeopleData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{item.salesperson_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-700">{item.month || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-700">{item.year || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-blue-600">{item.order_count || 0}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-emerald-600">${parseFloat(item.total_sales || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {((saleReportSubTab === 'time-period' && saleReportData.length === 0) ||
              (saleReportSubTab === 'monthly-customers' && monthlyCustomersData.length === 0) ||
              (saleReportSubTab === 'monthly-salespeople' && monthlySalespeopleData.length === 0)) && (
              <div className="p-12 text-center text-gray-500">No data available</div>
            )}
          </div>
        );

      case 'top-items':
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  const headers = ['Item Code', 'Item Name', 'Total Sold', 'Total Revenue'];
                  const data = topItemsData.map(item => [
                    item.item_number || '—',
                    item.description_name,
                    item.total_quantity_sold,
                    `$${parseFloat(item.total_revenue).toFixed(2)}`
                  ]);
                  exportToPDF('Top Selling Items', headers, data);
                }}
                disabled={topItemsData.length === 0}
                className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => exportToExcel('Top Selling Items', topItemsData)}
                disabled={topItemsData.length === 0}
                className="ml-3 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Rank</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Item Code</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Item Name</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Total Sold</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topItemsData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-200 text-gray-700' : index === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-600">{item.item_number || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{item.description_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-blue-600">{item.total_quantity_sold}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-emerald-600">${parseFloat(item.total_revenue).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {topItemsData.length === 0 && <div className="p-12 text-center text-gray-500">No data available</div>}
          </div>
        );

      case 'top-salespeople':
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  const headers = ['Rank', 'Salesperson', 'Total Orders', 'Total Sales'];
                  const data = topSalespeopleData.map((item, index) => [
                    index + 1,
                    item.name,
                    item.total_orders,
                    `$${parseFloat(item.total_sales || 0).toFixed(2)}`
                  ]);
                  exportToPDF('Top Salespeople', headers, data);
                }}
                disabled={topSalespeopleData.length === 0}
                className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => exportToExcel('Top Salespeople', topSalespeopleData)}
                disabled={topSalespeopleData.length === 0}
                className="ml-3 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Rank</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Salesperson</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Total Orders</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Total Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topSalespeopleData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-200 text-gray-700' : index === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-blue-600">{item.total_orders}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-emerald-600">${parseFloat(item.total_sales || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {topSalespeopleData.length === 0 && <div className="p-12 text-center text-gray-500">No data available</div>}
          </div>
        );

      case 'top-customers':
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  const headers = ['Rank', 'Customer', 'Account ID', 'Orders', 'Total Spent'];
                  const data = topCustomersData.map((item, index) => [
                    index + 1,
                    item.customer_name,
                    item.account_id || '—',
                    item.order_count,
                    `$${parseFloat(item.total_spent).toFixed(2)}`
                  ]);
                  exportToPDF('Top Customers', headers, data);
                }}
                disabled={topCustomersData.length === 0}
                className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => exportToExcel('Top Customers', topCustomersData)}
                disabled={topCustomersData.length === 0}
                className="ml-3 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Rank</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Customer</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest">Account ID</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-center">Orders</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-[#164174] uppercase tracking-widest text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topCustomersData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-200 text-gray-700' : index === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{item.customer_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.account_id || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-blue-600">{item.order_count}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-emerald-600">${parseFloat(item.total_spent).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {topCustomersData.length === 0 && <div className="p-12 text-center text-gray-500">No data available</div>}
          </div>
        );

      default:
        return null;
    }
  }
}
