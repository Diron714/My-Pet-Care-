import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';
import { Calendar, Clock, User, PawPrint, DollarSign, CheckCircle, XCircle, ArrowRight, Filter } from 'lucide-react';
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
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status: 'accepted',
      });
      toast.success('Appointment accepted');
      loadAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept appointment');
    }
  };

  const handleReject = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to reject this appointment?')) return;

    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status: 'rejected',
      });
      toast.success('Appointment rejected');
      loadAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject appointment');
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status: 'completed',
      });
      toast.success('Appointment marked as completed');
      loadAppointments();
    } catch (error) {
      toast.error('Failed to complete appointment');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'accepted':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      default:
        return Calendar;
    }
  };

  const filters = [
    { value: 'all', label: 'All', icon: Calendar, color: 'slate' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'amber' },
    { value: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'emerald' },
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'blue' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'rose' },
  ];

  if (loading) return <Layout><Loading /></Layout>;

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const todayCount = appointments.filter(a => a.appointment_date === new Date().toISOString().split('T')[0]).length;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Appointments</h1>
            <p className="page-subtitle">Manage your patient appointments and consultations</p>
          </div>
        </div>

        {/* Statistics */}
        {appointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="card card-muted">
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
            <div className="card card-muted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending Requests</p>
                  <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="card card-muted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Today's Appointments</p>
                  <p className="text-2xl font-black text-blue-600">{todayCount}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50'
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
              message="You don't have any appointments yet"
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
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-slate-900">
                          Appointment #{appointment.appointment_number}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {appointment.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold">Customer:</span> {appointment.customer?.user?.first_name}{' '}
                          {appointment.customer?.user?.last_name}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <PawPrint className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold">Pet:</span> {appointment.customer_pet?.name} ({appointment.customer_pet?.species})
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-3 h-3 text-blue-600" />
                              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Date</p>
                            </div>
                            <p className="text-sm font-bold text-blue-900">{formatDate(appointment.appointment_date)}</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-3 h-3 text-purple-600" />
                              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Time</p>
                            </div>
                            <p className="text-sm font-bold text-purple-900">{formatTime(appointment.appointment_time)}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 mt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-emerald-600" />
                              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Fee</p>
                            </div>
                            <p className="text-lg font-black text-emerald-700">{formatCurrencyLKR(appointment.consultation_fee)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <Link to={`/doctor/appointments/${appointment.appointment_id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <ArrowRight className="w-4 h-4 inline mr-1" />
                        View Details
                      </Button>
                    </Link>
                    {appointment.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAccept(appointment.appointment_id)}
                          className="flex-1 !bg-emerald-600 hover:!bg-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(appointment.appointment_id)}
                        >
                          <XCircle className="w-4 h-4 inline mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {appointment.status === 'accepted' && (
                      <Button
                        size="sm"
                        onClick={() => handleComplete(appointment.appointment_id)}
                        className="flex-1 !bg-primary-600 hover:!bg-primary-700"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Mark Complete
                      </Button>
                    )}
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
