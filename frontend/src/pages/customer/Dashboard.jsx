import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Package, Calendar, Gift, Bell, ShoppingCart, Heart, Users, MessageSquare, Star, Clock, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeOrders: 0,
    upcomingAppointments: 0,
    loyaltyPoints: 0,
    loyaltyTier: 'bronze',
    unreadNotifications: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, ordersRes, appointmentsRes] = await Promise.all([
        api.get('/customers/dashboard'),
        api.get('/orders?limit=3'),
        api.get('/appointments?limit=3'),
      ]);

      setStats(dashboardRes.data.data || stats);
      setRecentOrders(ordersRes.data.data || []);
      setRecentAppointments(appointmentsRes.data.data || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum':
        return { gradient: 'from-purple-500 to-purple-600', text: 'text-purple-700' };
      case 'gold':
        return { gradient: 'from-amber-500 to-amber-600', text: 'text-amber-700' };
      case 'silver':
        return { gradient: 'from-slate-400 to-slate-500', text: 'text-slate-700' };
      case 'bronze':
        return { gradient: 'from-orange-500 to-orange-600', text: 'text-orange-700' };
      default:
        return { gradient: 'from-slate-500 to-slate-600', text: 'text-slate-700' };
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  const tierColors = getTierColor(stats.loyaltyTier);

  const quickActions = [
    { path: '/customer/pets', label: 'Browse Pets', icon: Heart, color: 'rose' },
    { path: '/customer/products', label: 'Browse Products', icon: Package, color: 'blue' },
    { path: '/customer/doctors', label: 'View Doctors', icon: Users, color: 'emerald' },
    { path: '/customer/orders', label: 'My Orders', icon: ShoppingCart, color: 'primary' },
    { path: '/customer/appointments/book', label: 'Book Appointment', icon: Calendar, color: 'purple' },
    { path: '/customer/pet-profiles', label: 'My Pets', icon: Heart, color: 'pink' },
    { path: '/customer/chat', label: 'Chat', icon: MessageSquare, color: 'indigo' },
    { path: '/customer/feedback', label: 'Feedback', icon: Star, color: 'amber' },
    { path: '/customer/reminders', label: 'Reminders', icon: Clock, color: 'violet' },
  ];

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Customer Dashboard</h1>
            <p className="page-subtitle">Welcome back! Here's a quick overview of your pet care journey.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Orders</p>
                <p className="text-3xl font-black text-slate-900">{stats.activeOrders}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-100/50">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Upcoming Appointments</p>
                <p className="text-3xl font-black text-slate-900">{stats.upcomingAppointments}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100/50">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Loyalty Points</p>
                <p className="text-3xl font-black text-slate-900">{stats.loyaltyPoints}</p>
                <p className="text-xs text-slate-500 capitalize mt-1">
                  Tier: <span className={`font-semibold ${tierColors.text}`}>{stats.loyaltyTier}</span>
                </p>
              </div>
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${tierColors.gradient} flex items-center justify-center shadow-lg`}>
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Unread Notifications</p>
                <p className="text-3xl font-black text-slate-900">{stats.unreadNotifications}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-100/50">
                <Bell className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const getActionColor = (color) => {
                const colors = {
                  rose: 'from-rose-500 to-rose-600',
                  blue: 'from-blue-500 to-blue-600',
                  emerald: 'from-emerald-500 to-emerald-600',
                  primary: 'from-primary-500 to-primary-600',
                  purple: 'from-purple-500 to-purple-600',
                  pink: 'from-pink-500 to-pink-600',
                  indigo: 'from-indigo-500 to-indigo-600',
                  amber: 'from-amber-500 to-amber-600',
                  violet: 'from-violet-500 to-violet-600',
                };
                return colors[color] || colors.primary;
              };
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="action-chip group"
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getActionColor(action.color)} flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-center font-medium text-slate-700 group-hover:text-primary-800">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="card">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
              <Link to="/customer/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <EmptyState title="No recent orders" message="Looks like you haven't placed any orders yet." />
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.order_id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Order #{order.order_number}</p>
                        <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
                        <p className="text-xs font-semibold text-primary-600 mt-1">{formatCurrencyLKR(order.final_amount)}</p>
                      </div>
                    </div>
                    <span className={`badge ${order.order_status === 'delivered' ? 'badge-success' : order.order_status === 'processing' ? 'badge-warning' : 'badge-info'}`}>
                      {order.order_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Appointments */}
          <div className="card">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-800">Upcoming Appointments</h2>
              <Link to="/customer/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {recentAppointments.length === 0 ? (
              <EmptyState title="No upcoming appointments" message="Time to book a check-up for your pet!" />
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.appointment_id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          Dr. {appointment.doctor?.user?.first_name} {appointment.doctor?.user?.last_name}
                        </p>
                        <p className="text-sm text-slate-500">{formatDate(appointment.appointment_date)} at {appointment.appointment_time}</p>
                      </div>
                    </div>
                    <span className={`badge ${appointment.status === 'accepted' ? 'badge-success' : 'badge-warning'}`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
