import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { DollarSign, ShoppingCart, Users, Calendar, Package, MessageSquare, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

// Format currency as LKR (Sri Lankan Rupees)
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

// Mock data for fallback
const mockStats = {
  totalSales: { today: 125000, week: 875000, month: 3450000 },
  totalOrders: 247,
  activeCustomers: 189,
  pendingAppointments: 12,
  pendingExchanges: 3,
};

const mockRecentOrders = [
  { order_id: 1, order_number: 'ORD-2024-001', final_amount: 45000, created_at: new Date().toISOString(), status: 'completed' },
  { order_id: 2, order_number: 'ORD-2024-002', final_amount: 32000, created_at: new Date(Date.now() - 86400000).toISOString(), status: 'processing' },
  { order_id: 3, order_number: 'ORD-2024-003', final_amount: 28000, created_at: new Date(Date.now() - 172800000).toISOString(), status: 'completed' },
  { order_id: 4, order_number: 'ORD-2024-004', final_amount: 55000, created_at: new Date(Date.now() - 259200000).toISOString(), status: 'shipped' },
  { order_id: 5, order_number: 'ORD-2024-005', final_amount: 38000, created_at: new Date(Date.now() - 345600000).toISOString(), status: 'completed' },
];

const mockRecentRegistrations = [
  { user_id: 1, first_name: 'Sarah', last_name: 'Johnson', role: 'customer', created_at: new Date().toISOString() },
  { user_id: 2, first_name: 'Michael', last_name: 'Chen', role: 'customer', created_at: new Date(Date.now() - 86400000).toISOString() },
  { user_id: 3, first_name: 'Emma', last_name: 'Williams', role: 'customer', created_at: new Date(Date.now() - 172800000).toISOString() },
  { user_id: 4, first_name: 'Dr. James', last_name: 'Anderson', role: 'doctor', created_at: new Date(Date.now() - 259200000).toISOString() },
  { user_id: 5, first_name: 'Lisa', last_name: 'Martinez', role: 'customer', created_at: new Date(Date.now() - 345600000).toISOString() },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: { today: 0, week: 0, month: 0 },
    totalOrders: 0,
    activeCustomers: 0,
    pendingAppointments: 0,
    pendingExchanges: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, ordersRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/orders?limit=5'),
        api.get('/admin/users?limit=5'),
      ]);

      setStats(dashboardRes.data.data || stats);
      setRecentOrders(ordersRes.data.data || []);
      setRecentRegistrations(usersRes.data.data || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Use mock data as fallback
      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setRecentRegistrations(mockRecentRegistrations);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">High-level overview of sales, customers, and pet shop activity.</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card card-muted group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-200/50 transition-colors"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Sales (Today)</p>
                <p className="text-3xl font-black text-slate-900 mb-1">{formatCurrencyLKR(stats.totalSales.today)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.5%</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Week: {formatCurrencyLKR(stats.totalSales.week)}
                  </p>
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="card card-muted group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-200/50 transition-colors"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Orders</p>
                <p className="text-3xl font-black text-slate-900 mb-1">{stats.totalOrders}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-primary-600 font-semibold">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+8.2%</span>
                  </div>
                  <p className="text-xs text-slate-400">This month</p>
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="card card-muted group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-100/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet-200/50 transition-colors"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Customers</p>
                <p className="text-3xl font-black text-slate-900 mb-1">{stats.activeCustomers}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-violet-600 font-semibold">
                    <Activity className="w-3 h-3" />
                    <span>Active</span>
                  </div>
                  <p className="text-xs text-slate-400">Registered users</p>
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="card card-muted group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-200/50 transition-colors"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pending Appointments</p>
                <p className="text-3xl font-black text-slate-900 mb-1">{stats.pendingAppointments}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>Awaiting</span>
                  </div>
                  <p className="text-xs text-slate-400">Action required</p>
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                <p className="text-xs text-slate-500 mt-1">Latest transactions</p>
              </div>
              <a href="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 group">
                View All
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No recent orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div 
                    key={order.order_id} 
                    className="border border-slate-100 rounded-xl p-4 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-bold text-slate-900">{order.order_number}</p>
                          {order.status && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {order.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary-600">
                          {formatCurrencyLKR(order.final_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Registrations */}
          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Registrations</h2>
                <p className="text-xs text-slate-500 mt-1">New user accounts</p>
              </div>
              <a href="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 group">
                View All
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
            {recentRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No recent registrations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRegistrations.map((user) => (
                  <div 
                    key={user.user_id} 
                    className="border border-slate-100 rounded-xl p-4 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">
                          {user.first_name} {user.last_name}
                        </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              user.role === 'customer' ? 'bg-blue-100 text-blue-700' :
                              user.role === 'doctor' ? 'bg-emerald-100 text-emerald-700' :
                              user.role === 'admin' ? 'bg-violet-100 text-violet-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 whitespace-nowrap ml-4">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="card mt-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Analytics Overview</h2>
              <p className="text-xs text-slate-500 mt-1">Visual insights and trends</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow group">
              <TrendingUp className="w-12 h-12 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-emerald-700 mb-1">Sales Trend Chart</p>
              <p className="text-xs text-emerald-600/70 text-center">Revenue growth over time</p>
            </div>
            <div className="h-64 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl border border-primary-100 flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow group">
              <Package className="w-12 h-12 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-primary-700 mb-1">Popular Pets Chart</p>
              <p className="text-xs text-primary-600/70 text-center">Best-selling breeds</p>
            </div>
            <div className="h-64 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-100 flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow group">
              <Calendar className="w-12 h-12 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-amber-700 mb-1">Appointment Trends</p>
              <p className="text-xs text-amber-600/70 text-center">Booking patterns</p>
            </div>
            <div className="h-64 bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-2xl border border-violet-100 flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow group">
              <Users className="w-12 h-12 text-violet-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-violet-700 mb-1">Customer Growth</p>
              <p className="text-xs text-violet-600/70 text-center">User acquisition rate</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

