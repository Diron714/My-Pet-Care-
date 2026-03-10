import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Package, Calendar, Gift, Bell, ShoppingCart, Heart, Users, MessageSquare, Star, Clock, ArrowRight, ChevronRight, PawPrint } from 'lucide-react';

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
    { path: '/customer/pets', label: 'Browse Pets', icon: Heart },
    { path: '/customer/products', label: 'Products', icon: Package },
    { path: '/customer/doctors', label: 'Doctors', icon: Users },
    { path: '/customer/orders', label: 'My Orders', icon: ShoppingCart },
    { path: '/customer/appointments/book', label: 'Book Appointment', icon: Calendar },
    { path: '/customer/pet-profiles', label: 'My Pets', icon: Heart },
    { path: '/customer/chat', label: 'Chat', icon: MessageSquare },
    { path: '/customer/feedback', label: 'Feedback', icon: Star },
    { path: '/customer/reminders', label: 'Reminders', icon: Clock },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/60 via-white to-blue-50/40 pointer-events-none" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 mb-3">
                  Care for your <span className="text-slate-500 font-semibold">pet</span>
                </h1>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                  with expert vets and delivery to your door
                </h2>
                <p className="text-slate-500 text-base lg:text-lg max-w-lg mb-8 leading-relaxed">
                  Book appointments, order products, and get advice from trusted veterinarians. Everything your pet needs in one place.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/customer/appointments/book"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-slate-800 text-white font-semibold text-base shadow-lg hover:bg-slate-900 transition-colors"
                  >
                    Book appointment
                  </Link>
                  <Link
                    to="/customer/products"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-base hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    Shop products
                  </Link>
                </div>
                <div className="flex items-center gap-2 mt-8">
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                  <ChevronRight className="w-5 h-5 text-slate-400 ml-1" />
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-white/50" />
                  <PawPrint className="relative w-48 h-48 lg:w-64 lg:h-64 text-slate-300/80" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </section>

          {/* Stats strip */}
          <section className="py-6 border-y border-slate-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.activeOrders}</p>
                  <p className="text-sm text-slate-500">Active orders</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.upcomingAppointments}</p>
                  <p className="text-sm text-slate-500">Upcoming appointments</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${tierColors.gradient} flex items-center justify-center flex-shrink-0`}>
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.loyaltyPoints}</p>
                  <p className="text-sm text-slate-500 capitalize">Loyalty · {stats.loyaltyTier}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.unreadNotifications}</p>
                  <p className="text-sm text-slate-500">Unread notifications</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick actions - horizontal nav style */}
          <section className="py-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick actions</h2>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-700 font-medium bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-600" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Recent Orders & Appointments */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Recent orders</h2>
                <Link to="/customer/orders" className="text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="p-6">
                {recentOrders.length === 0 ? (
                  <EmptyState title="No recent orders" message="Looks like you haven't placed any orders yet." />
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.order_id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">#{order.order_number}</p>
                            <p className="text-sm text-slate-500">{formatDate(order.created_at)} · {formatCurrencyLKR(order.final_amount)}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${order.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : order.order_status === 'processing' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {order.order_status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Upcoming appointments</h2>
                <Link to="/customer/appointments" className="text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="p-6">
                {recentAppointments.length === 0 ? (
                  <EmptyState title="No upcoming appointments" message="Time to book a check-up for your pet!" />
                ) : (
                  <div className="space-y-4">
                    {recentAppointments.map((appointment) => (
                      <div key={appointment.appointment_id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              Dr. {appointment.doctor?.user?.first_name} {appointment.doctor?.user?.last_name}
                            </p>
                            <p className="text-sm text-slate-500">{formatDate(appointment.appointment_date)} at {appointment.appointment_time}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${appointment.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
