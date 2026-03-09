import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { Calendar, Users, CheckCircle, MessageSquare, Settings, Clock, ArrowUpRight, ArrowDownRight, Stethoscope, Activity } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingRequests: 0,
    completedThisWeek: 0,
    unreadMessages: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const [dashboardRes, appointmentsRes] = await Promise.all([
        api.get('/doctors/dashboard'),
        api.get(`/appointments?date=${today}`),
      ]);

      const apiStats = dashboardRes.data.data || {};
      setStats({
        todayAppointments: apiStats.upcoming_appointments || 0,
        pendingRequests: apiStats.pending_requests || 0,
        completedThisWeek: apiStats.total_appointments || 0,
        unreadMessages: 0,
      });
      setTodayAppointments(appointmentsRes.data.data || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  const quickActions = [
    { path: '/doctor/profile', label: 'Manage Profile', icon: Settings },
    { path: '/doctor/schedule', label: 'View Schedule', icon: Calendar },
    { path: '/doctor/appointments', label: 'Manage Appointments', icon: Calendar },
    { path: '/doctor/health-records', label: 'Health Records', icon: Users },
    { path: '/doctor/chat', label: 'Chat', icon: MessageSquare },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted':
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Doctor Dashboard</h1>
            <p className="page-subtitle">Overview of your appointments, patient records, and messages</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card card-muted group hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 font-medium">Today's Appointments</p>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{stats.todayAppointments}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center text-emerald-500 font-semibold">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 5.2%
              </span>
              <span className="text-slate-400">vs yesterday</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              Confirmed: <span className="font-semibold">3</span> | Pending: <span className="font-semibold">2</span>
            </p>
          </div>

          <div className="card card-muted group hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 font-medium">Pending Requests</p>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{stats.pendingRequests}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center text-rose-500 font-semibold">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> 1.1%
              </span>
              <span className="text-slate-400">vs last week</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              New: <span className="font-semibold">2</span> | Total: <span className="font-semibold">15</span>
            </p>
          </div>

          <div className="card card-muted group hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 font-medium">Completed This Week</p>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{stats.completedThisWeek}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center text-emerald-500 font-semibold">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 7.5%
              </span>
              <span className="text-slate-400">vs last week</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              Total: <span className="font-semibold">20</span> | Records: <span className="font-semibold">18</span>
            </p>
          </div>

          <div className="card card-muted group hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 font-medium">Unread Messages</p>
              <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <MessageSquare className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{stats.unreadMessages}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center text-emerald-500 font-semibold">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 2.0%
              </span>
              <span className="text-slate-400">vs yesterday</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              New: <span className="font-semibold">5</span> | Total: <span className="font-semibold">10</span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="action-chip group"
                >
                  <Icon className="w-7 h-7 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-center font-medium text-slate-700 group-hover:text-slate-800">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="card">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-slate-800">Today's Appointments</h2>
            <Link to="/doctor/appointments" className="text-slate-600 hover:text-slate-800 text-sm font-medium">
              View All &rarr;
            </Link>
          </div>
          {todayAppointments.length === 0 ? (
            <EmptyState title="No appointments scheduled for today" message="Enjoy your day off or prepare for upcoming sessions!" />
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.appointment_id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {appointment.appointment_time} - {appointment.customer?.user?.first_name}{' '}
                        {appointment.customer?.user?.last_name}
                      </p>
                      <p className="text-sm text-slate-500">
                        Pet: <span className="font-medium">{appointment.customer_pet?.name}</span> | Status: <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>{appointment.status}</span>
                      </p>
                    </div>
                  </div>
                  <Link to={`/doctor/appointments/${appointment.appointment_id}`}>
                    <button className="text-slate-600 hover:text-slate-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                      View Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
