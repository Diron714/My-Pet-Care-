import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';
import { Calendar, Plus, Clock, User, PawPrint, DollarSign, CheckCircle, XCircle, AlertCircle, Filter, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`/appointments${params}`);
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status: 'cancelled',
      });
      toast.success('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'accepted':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const filters = [
    { value: 'all', label: 'All', icon: Calendar, color: 'slate' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'amber' },
    { value: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'emerald' },
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'blue' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'rose' },
  ];

  const getFilterStyles = (color) => {
    const styles = {
      slate: { active: 'bg-slate-600 text-white shadow-lg shadow-slate-500/30', inactive: 'text-slate-600 border-slate-200 hover:bg-slate-50' },
      amber: { active: 'bg-amber-600 text-white shadow-lg shadow-amber-500/30', inactive: 'text-amber-600 border-amber-200 hover:bg-amber-50' },
      emerald: { active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30', inactive: 'text-emerald-600 border-emerald-200 hover:bg-emerald-50' },
      blue: { active: 'bg-blue-600 text-white shadow-lg shadow-blue-500/30', inactive: 'text-blue-600 border-blue-200 hover:bg-blue-50' },
      rose: { active: 'bg-rose-600 text-white shadow-lg shadow-rose-500/30', inactive: 'text-rose-600 border-rose-200 hover:bg-rose-50' },
    };
    return styles[color] || styles.slate;
  };

  if (loading) return <Layout><Loading /></Layout>;

  const upcomingAppointments = appointments.filter(a => ['pending', 'accepted'].includes(a.status)).length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div className="flex-1">
            <h1 className="page-title">My Appointments</h1>
            <p className="page-subtitle">Manage your pet's veterinary appointments and consultations</p>
          </div>
          <Link to="/customer/appointments/book">
            <Button className="!bg-primary-600 hover:!bg-primary-700">
              <Plus className="w-4 h-4 inline mr-2" />
              Book New Appointment
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Appointments</p>
                <p className="text-2xl font-black text-slate-900">{appointments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Upcoming</p>
                <p className="text-2xl font-black text-emerald-600">{upcomingAppointments}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Completed</p>
                <p className="text-2xl font-black text-blue-600">{completedAppointments}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.value;
            const styles = getFilterStyles(f.color);
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive
                    ? styles.active
                    : `bg-white border-2 ${styles.inactive}`
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                {f.label}
              </button>
            );
          })}
        </div>

        {appointments.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Calendar}
              title="No appointments found"
              message="Book your first appointment with our doctors"
              action={
                <Link to="/customer/appointments/book">
                  <Button>Book Appointment</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {appointments.map((appointment) => {
              const StatusIcon = getStatusIcon(appointment.status);
              return (
                <div key={appointment.appointment_id} className="card hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Stethoscope className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-slate-900">
                          {appointment.appointment_number}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Doctor Info */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Doctor</p>
                          <p className="font-bold text-slate-900">
                            Dr. {appointment.doctor?.user?.first_name} {appointment.doctor?.user?.last_name}
                          </p>
                          <p className="text-sm text-slate-600">{appointment.doctor?.specialization}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pet Info */}
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <PawPrint className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Pet</p>
                          <p className="font-bold text-emerald-900">{appointment.customer_pet?.name}</p>
                          <p className="text-sm text-emerald-700">{appointment.customer_pet?.species} - {appointment.customer_pet?.breed}</p>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Date</p>
                        </div>
                        <p className="text-sm font-bold text-blue-900">{formatDate(appointment.appointment_date)}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Time</p>
                        </div>
                        <p className="text-sm font-bold text-purple-900">{formatTime(appointment.appointment_time)}</p>
                      </div>
                    </div>

                    {/* Fee */}
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-amber-600" />
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Consultation Fee</p>
                        </div>
                        <p className="text-lg font-black text-amber-700">{formatCurrencyLKR(appointment.consultation_fee)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link to={`/customer/appointments/${appointment.appointment_id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {appointment.status === 'pending' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(appointment.appointment_id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
