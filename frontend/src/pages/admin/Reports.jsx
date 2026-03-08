import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { FileText, Download, Calendar, DollarSign, ShoppingCart, Users, Sparkles, TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'sales', label: 'Sales Report', icon: DollarSign, color: 'emerald' },
    { id: 'appointments', label: 'Appointment Report', icon: Calendar, color: 'blue' },
    { id: 'customers', label: 'Customer Report', icon: Users, color: 'purple' },
    { id: 'loyalty', label: 'Loyalty Report', icon: Sparkles, color: 'amber' },
  ];

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      loadReport();
    }
  }, [activeTab, dateRange]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('from', dateRange.from);
      params.append('to', dateRange.to);

      const response = await api.get(`/admin/reports/${activeTab}?${params.toString()}`);
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select date range first');
      return;
    }
    try {
      const params = new URLSearchParams();
      params.append('from', dateRange.from);
      params.append('to', dateRange.to);
      params.append('format', 'csv');

      const response = await api.get(`/admin/reports/${activeTab}/export?${params.toString()}`, {
        responseType: 'blob',
      });
      const disposition = response.headers['content-disposition'];
      const filenameMatch = disposition && /filename="?([^";\n]+)"?/.exec(disposition);
      const filename = filenameMatch ? filenameMatch[1] : `${activeTab}-report-${dateRange.from}-to-${dateRange.to}.csv`;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to export report');
    }
  };

  const getTabStyles = (tab) => {
    const colors = {
      emerald: {
        active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30',
        inactive: 'text-emerald-600 border-emerald-200 hover:bg-emerald-50',
        gradient: 'from-emerald-500 to-emerald-600',
      },
      blue: {
        active: 'bg-blue-600 text-white shadow-lg shadow-blue-500/30',
        inactive: 'text-blue-600 border-blue-200 hover:bg-blue-50',
        gradient: 'from-blue-500 to-blue-600',
      },
      purple: {
        active: 'bg-purple-600 text-white shadow-lg shadow-purple-500/30',
        inactive: 'text-purple-600 border-purple-200 hover:bg-purple-50',
        gradient: 'from-purple-500 to-purple-600',
      },
      amber: {
        active: 'bg-amber-600 text-white shadow-lg shadow-amber-500/30',
        inactive: 'text-amber-600 border-amber-200 hover:bg-amber-50',
        gradient: 'from-amber-500 to-amber-600',
      },
    };
    return colors[tab.color] || colors.emerald;
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">Generate comprehensive reports and analyze business performance</p>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Select Date Range</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={loadReport}
                disabled={!dateRange.from || !dateRange.to}
                className="w-full !bg-slate-800 hover:!bg-slate-900"
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-3 border-b border-slate-100 pb-4">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const styles = getTabStyles(tab);
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive
                      ? styles.active
                      : `bg-white border-2 ${styles.inactive}`
                    }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Report Content */}
        {reportData ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeTab === 'sales' && (
                <>
                  <div className="card card-muted group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales</p>
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${getTabStyles(tabs[0]).gradient} flex items-center justify-center shadow-lg`}>
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 mb-1">{formatCurrencyLKR(reportData.totalSales || 0)}</p>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                      <ArrowUpRight className="w-3 h-3" />
                      {reportData.growth || 0}% growth
                    </div>
                  </div>
                  <div className="card card-muted group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</p>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 mb-1">{reportData.totalOrders || 0}</p>
                    <p className="text-xs text-slate-500">Avg: {formatCurrencyLKR(reportData.averageOrderValue || 0)}</p>
                  </div>
                </>
              )}
              {activeTab === 'appointments' && (
                <>
                  <div className="card card-muted group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</p>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 mb-1">{reportData.totalAppointments || 0}</p>
                    <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
                      <ArrowUpRight className="w-3 h-3" />
                      {reportData.growth || 0}% growth
                    </div>
                  </div>
                  <div className="card card-muted group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-emerald-600 mb-1">{reportData.completed || 0}</p>
                    <p className="text-xs text-slate-500">{Math.round(((reportData.completed || 0) / (reportData.totalAppointments || 1)) * 100)}% completion rate</p>
                  </div>
                </>
              )}
              {activeTab === 'customers' && (
                <>
                  <div className="card card-muted group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customers</p>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 mb-1">{reportData.totalCustomers || 0}</p>
                    <div className="flex items-center gap-2 text-xs text-purple-600 font-semibold">
                      <ArrowUpRight className="w-3 h-3" />
                      {reportData.growth || 0}% growth
                    </div>
                  </div>
                  <div className="card card-muted group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Customers</p>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-emerald-600 mb-1">{reportData.newCustomers || 0}</p>
                    <p className="text-xs text-slate-500">Active: {reportData.activeCustomers || 0}</p>
                  </div>
                </>
              )}
              {activeTab === 'loyalty' && (
                <>
                  <div className="card card-muted group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Points</p>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 mb-1">{reportData.totalPoints?.toLocaleString() || 0}</p>
                    <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold">
                      <ArrowUpRight className="w-3 h-3" />
                      {reportData.growth || 0}% growth
                    </div>
                  </div>
                  <div className="card card-muted group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Members</p>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-blue-600 mb-1">{reportData.activeMembers || 0}</p>
                    <p className="text-xs text-slate-500">Redeemed: {reportData.pointsRedeemed?.toLocaleString() || 0}</p>
                  </div>
                </>
              )}
            </div>

            {/* Report Details */}
            <div className="card">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{tabs.find(t => t.id === activeTab)?.label}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {dateRange.from && dateRange.to && `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 inline mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Detailed Data */}
              <div className="space-y-6">
                {activeTab === 'sales' && reportData.topProducts && (
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      Top Products
                    </h3>
                    <div className="space-y-3">
                      {reportData.topProducts.map((product, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{product.name}</p>
                              <p className="text-sm text-slate-500">{product.orders} orders</p>
                            </div>
                            <p className="text-lg font-black text-emerald-600">{formatCurrencyLKR(product.sales)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'appointments' && reportData.topDoctors && (
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Top Doctors
                    </h3>
                    <div className="space-y-3">
                      {reportData.topDoctors.map((doctor, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900">{doctor.name}</p>
                            <p className="text-lg font-black text-blue-600">{doctor.appointments} appointments</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'customers' && reportData.topSegments && (
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      Customer Segments
                    </h3>
                    <div className="space-y-3">
                      {reportData.topSegments.map((segment, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900">{segment.segment}</p>
                            <p className="text-lg font-black text-purple-600">{segment.count} customers</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'loyalty' && reportData.topTiers && (
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      Loyalty Tiers
                    </h3>
                    <div className="space-y-3">
                      {reportData.topTiers.map((tier, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900">{tier.tier}</p>
                            <p className="text-lg font-black text-amber-600">{tier.members} members</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Analytics */}
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                    Visual Analytics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeTab === 'sales' && reportData.topProducts && reportData.topProducts.length > 0 && (
                      <div className="h-64 rounded-2xl border border-slate-200 p-4 bg-white">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Top Products by Sales</p>
                        <ResponsiveContainer width="100%" height="90%">
                          <BarChart data={reportData.topProducts.slice(0, 8)} layout="vertical" margin={{ left: 80, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" tickFormatter={(v) => `LKR ${(v / 1000).toFixed(0)}k`} />
                            <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 10 }} />
                            <Tooltip formatter={(value) => [formatCurrencyLKR(value), 'Sales']} />
                            <Bar dataKey="sales" fill="#10b981" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {activeTab === 'loyalty' && reportData.topTiers && reportData.topTiers.length > 0 && (
                      <div className="h-64 rounded-2xl border border-slate-200 p-4 bg-white">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Loyalty Tier Distribution</p>
                        <ResponsiveContainer width="100%" height="90%">
                          <PieChart>
                            <Pie data={reportData.topTiers} dataKey="members" nameKey="tier" cx="50%" cy="50%" outerRadius={80} label={({ tier, members }) => `${tier}: ${members}`}>
                              {reportData.topTiers.map((_, i) => (
                                <Cell key={i} fill={['#f59e0b', '#6366f1', '#10b981', '#ec4899'][i % 4]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, 'Members']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {activeTab === 'appointments' && reportData.topDoctors && reportData.topDoctors.length > 0 && (
                      <div className="h-64 rounded-2xl border border-slate-200 p-4 bg-white">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Top Doctors by Appointments</p>
                        <ResponsiveContainer width="100%" height="90%">
                          <BarChart data={reportData.topDoctors.slice(0, 8)} margin={{ left: 0, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="appointments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {activeTab === 'customers' && reportData.topSegments && reportData.topSegments.length > 0 && (
                      <div className="h-64 rounded-2xl border border-slate-200 p-4 bg-white">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Customer Segments</p>
                        <ResponsiveContainer width="100%" height="90%">
                          <PieChart>
                            <Pie data={reportData.topSegments} dataKey="count" nameKey="segment" cx="50%" cy="50%" outerRadius={80} label={({ segment, count }) => `${segment}: ${count}`}>
                              {reportData.topSegments.map((_, i) => (
                                <Cell key={i} fill={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][i % 4]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, 'Customers']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {((activeTab === 'sales' && !reportData.topProducts?.length) ||
                      (activeTab === 'loyalty' && !reportData.topTiers?.length) ||
                      (activeTab === 'appointments' && !reportData.topDoctors?.length) ||
                      (activeTab === 'customers' && !reportData.topSegments?.length)) && (
                      <div className="h-64 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 md:col-span-2">
                        <PieChartIcon className="w-12 h-12 text-slate-300 mb-2" />
                        <p className="text-sm font-semibold">No chart data for this report</p>
                        <p className="text-xs">Select a date range with data to see charts</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold mb-2">No Report Generated</p>
              <p className="text-sm text-slate-500">Select a date range and click "Generate Report" to view analytics</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
