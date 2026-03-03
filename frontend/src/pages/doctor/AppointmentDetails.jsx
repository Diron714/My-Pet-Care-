import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDate, formatTime } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Calendar,
  ClipboardList,
  Stethoscope,
  FilePlus,
  History,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Activity,
  Zap,
  PawPrint,
  Phone,
  Clock,
  DollarSign,
  Pill,
  AlertCircle
} from 'lucide-react';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [healthHistory, setHealthHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState({
    diagnosis: '',
    prescription: '',
    treatmentNotes: '',
  });

  useEffect(() => {
    loadAppointmentDetails();
  }, [id]);

  const loadAppointmentDetails = async () => {
    try {
      setLoading(true);
      const appointmentRes = await api.get(`/appointments/${id}`);
      const appointmentData = appointmentRes.data.data;
      setAppointment(appointmentData);

      const historyRes = await api.get(`/health-records/pet/${appointmentData.customer_pet_id}`);
      setHealthHistory(historyRes.data.data || []);
      if (appointmentRes.data.data.doctor_notes) {
        setNotes({
          diagnosis: appointmentRes.data.data.diagnosis || '',
          prescription: appointmentRes.data.data.prescription || '',
          treatmentNotes: appointmentRes.data.data.treatment_notes || '',
        });
      }
    } catch (error) {
      console.error('Error loading appointment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await api.put(`/appointments/${id}/status`, {
        status: appointment.status,
        doctor_notes: notes.treatmentNotes || notes.diagnosis || notes.prescription || '',
      });
      toast.success('Consultation notes synchronized');
      loadAppointmentDetails();
    } catch (error) {
      toast.error('Synchronization failure');
    } finally {
      setSaving(false);
    }
  };

  const handleAccept = async () => {
    try {
      await api.put(`/appointments/${id}/status`, {
        status: 'accepted',
      });
      toast.success('Appointment accepted');
      loadAppointmentDetails();
    } catch (error) {
      toast.error('Failed to accept session');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Confirm rejection of this session?')) return;
    try {
      await api.put(`/appointments/${id}/status`, {
        status: 'rejected',
      });
      toast.success('Appointment rejected');
      navigate('/doctor/appointments');
    } catch (error) {
      toast.error('Failed to reject session');
    }
  };

  const handleComplete = async () => {
    try {
      await api.put(`/appointments/${id}/status`, {
        status: 'completed',
      });
      toast.success('Consultation officially completed');
      loadAppointmentDetails();
    } catch (error) {
      toast.error('Failed to finalize session');
    }
  };

  const handleAddToHealthRecords = async () => {
    if (!notes.diagnosis && !notes.prescription) {
      toast.error('Diagnosis or Prescription data required');
      return;
    }
    try {
      await api.post('/health-records', {
        appointment_id: id,
        customer_pet_id: appointment.customer_pet_id,
        diagnosis: notes.diagnosis,
        prescription: notes.prescription,
        treatment_notes: notes.treatmentNotes,
      });
      toast.success('Added to clinical ledger');
    } catch (error) {
      toast.error('Record update failed');
    }
  };

  if (loading) return <Layout><Loading /></Layout>;
  if (!appointment) return <Layout><div className="text-center py-24 font-black text-slate-300 uppercase tracking-widest">Appointment Not Located</div></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-3">
            <button
              onClick={() => navigate('/doctor/appointments')}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-all font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Appointments
            </button>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                  Session #{appointment.appointment_number}
                </h1>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    Verified Record
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Consultation Schedule</p>
                <p className="text-lg font-black text-blue-900">{formatDate(appointment.appointment_date)}</p>
                <p className="text-sm font-bold text-blue-700">{formatTime(appointment.appointment_time)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* PATIENT INTELLIGENCE COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

              <div className="flex items-center gap-2 mb-8">
                <User className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Subject Identity</h3>
              </div>

              <div className="space-y-6 relative z-10">
                {appointment.customer_pet?.image_url && (
                  <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-2 border-white/20 mx-auto">
                    <img
                      src={appointment.customer_pet.image_url}
                      alt={appointment.customer_pet.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=Pet';
                      }}
                    />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-3xl font-black tracking-tight leading-none mb-2">{appointment.customer_pet?.name}</p>
                  <p className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                    {appointment.customer_pet?.species} — {appointment.customer_pet?.breed}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                    <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Age</p>
                    <p className="text-lg font-black text-white">{appointment.customer_pet?.age} MO</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                    <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-lg font-black text-emerald-400 uppercase">Active</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Owner Specifications
                  </p>
                  <div className="space-y-2">
                    <p className="text-base font-black text-white leading-tight">
                      {appointment.customer?.user?.first_name} {appointment.customer?.user?.last_name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Phone className="w-3 h-3" />
                      <span>{appointment.customer?.user?.phone}</span>
                    </div>
                    <div className="p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Fee</span>
                        <span className="text-lg font-black text-white">{formatCurrencyLKR(appointment.consultation_fee)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Health History */}
            {healthHistory.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2 mb-6">
                  <History className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-bold text-slate-900">Recent Medical History</h2>
                </div>
                <div className="space-y-4">
                  {healthHistory.slice(0, 3).map((record) => (
                    <div key={record.record_id} className="relative pl-6 border-l-2 border-primary-200 group">
                      <div className="absolute left-[-5px] top-0 w-3 h-3 rounded-full bg-primary-500 group-hover:bg-primary-600 transition-colors" />
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{formatDate(record.record_date)}</p>
                      <p className="text-sm font-semibold text-slate-700 line-clamp-2 leading-relaxed">
                        {record.diagnosis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONSULTATION SUITE */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Clinical Assessment</h2>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Diagnosis Details
                  </label>
                  <textarea
                    value={notes.diagnosis}
                    onChange={(e) => setNotes({ ...notes, diagnosis: e.target.value })}
                    rows={4}
                    className="input-field !rounded-xl !py-4"
                    placeholder="Enter professional clinical observations..."
                  />
                </div>

                <div className="group">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Prescription Specifications
                  </label>
                  <textarea
                    value={notes.prescription}
                    onChange={(e) => setNotes({ ...notes, prescription: e.target.value })}
                    rows={4}
                    className="input-field !rounded-xl !py-4"
                    placeholder="Document necessary medications and dosages..."
                  />
                </div>

                <div className="group">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Observation Notes
                  </label>
                  <textarea
                    value={notes.treatmentNotes}
                    onChange={(e) => setNotes({ ...notes, treatmentNotes: e.target.value })}
                    rows={4}
                    className="input-field !rounded-xl !py-4"
                    placeholder="Internal treatment and follow-up guidance..."
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="w-full !bg-primary-600 hover:!bg-primary-700 !py-4"
                    loading={saving}
                  >
                    <ShieldCheck className="w-5 h-5 inline mr-2" />
                    Save Clinical Progress
                  </Button>
                </div>
              </div>
            </div>

            {/* CONTROL MATRIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appointment.status === 'pending' && (
                <>
                  <Button onClick={handleAccept} className="!bg-emerald-600 hover:!bg-emerald-700 !py-4">
                    <CheckCircle2 className="w-5 h-5 inline mr-2" />
                    Accept Session
                  </Button>
                  <Button onClick={handleReject} variant="danger" className="!py-4">
                    <XCircle className="w-5 h-5 inline mr-2" />
                    Reject Session
                  </Button>
                </>
              )}

              {appointment.status === 'accepted' && (
                <Button onClick={handleComplete} className="col-span-full !bg-primary-600 hover:!bg-primary-700 !py-4">
                  <CheckCircle2 className="w-5 h-5 inline mr-2" />
                  Finalize Medical Process
                </Button>
              )}

              {(notes.diagnosis || notes.prescription) && (
                <Button
                  onClick={handleAddToHealthRecords}
                  variant="outline"
                  className="col-span-full !py-4"
                >
                  <FilePlus className="w-4 h-4 inline mr-2" />
                  Push to Global Ledger
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentDetails;
