import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reminderSchema } from '../../utils/validators';
import api from '../../services/api';
import { formatDate, formatTime } from '../../utils/formatters';
import { Clock, Plus, Edit, Trash2, Check, Calendar, Syringe, Pill, Utensils, AlertCircle, Filter, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [filter, setFilter] = useState('all');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(reminderSchema),
  });

  useEffect(() => {
    loadReminders();
  }, [filter]);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const params = filter === 'upcoming' ? '?upcoming=true' : filter === 'completed' ? '?completed=true' : '';
      const response = await api.get(`/reminders${params}`);
      setReminders(response.data.data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const url = editingReminder ? `/reminders/${editingReminder.reminder_id}` : '/reminders';
      const method = editingReminder ? 'put' : 'post';

      // Map form fields (camelCase) to API payload (snake_case)
      const payload = {
        reminder_type: data.reminderType,
        title: data.title,
        description: data.description,
        reminder_date: data.reminderDate,
        reminder_time: data.reminderTime || null,
      };

      const response = await api[method](url, payload);

      if (response.data.success) {
        toast.success(editingReminder ? 'Reminder updated' : 'Reminder created');
        setShowForm(false);
        setEditingReminder(null);
        reset();
        loadReminders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save reminder');
    }
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setValue('reminderType', reminder.reminder_type);
    setValue('title', reminder.title);
    setValue('description', reminder.description);
    setValue('reminderDate', reminder.reminder_date);
    setValue('reminderTime', reminder.reminder_time);
    setShowForm(true);
  };

  const handleDelete = async (reminderId) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;

    try {
      await api.delete(`/reminders/${reminderId}`);
      toast.success('Reminder deleted');
      loadReminders();
    } catch (error) {
      toast.error('Failed to delete reminder');
    }
  };

  const handleComplete = async (reminderId) => {
    try {
      await api.put(`/reminders/${reminderId}/complete`);
      toast.success('Reminder marked as completed');
      loadReminders();
    } catch (error) {
      toast.error('Failed to complete reminder');
    }
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'vaccination': return Syringe;
      case 'medication': return Pill;
      case 'food': return Utensils;
      case 'appointment': return Calendar;
      default: return Clock;
    }
  };

  const getReminderColors = (type) => {
    switch (type) {
      case 'vaccination': return { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'medication': return { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
      case 'food': return { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 'appointment': return { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      default: return { gradient: 'from-slate-500 to-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  const upcomingCount = reminders.filter(r => !r.is_completed).length;
  const completedCount = reminders.filter(r => r.is_completed).length;

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'upcoming') return !r.is_completed;
    if (filter === 'completed') return r.is_completed;
    return true;
  });

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Reminders</h1>
            <p className="page-subtitle">Never miss important pet care tasks and appointments</p>
          </div>
          <Button onClick={() => {
            setEditingReminder(null);
            reset();
            setShowForm(true);
          }} className="!bg-primary-600 hover:!bg-primary-700">
            <Plus className="w-4 h-4 inline mr-2" />
            Add Reminder
          </Button>
        </div>

        {/* Statistics */}
        {reminders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="card card-muted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-2xl font-black text-slate-900">{reminders.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="card card-muted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Upcoming</p>
                  <p className="text-2xl font-black text-blue-600">{upcomingCount}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="card card-muted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Completed</p>
                  <p className="text-2xl font-black text-emerald-600">{completedCount}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { value: 'all', label: 'All', icon: Clock, color: 'slate' },
            { value: 'upcoming', label: 'Upcoming', icon: Calendar, color: 'blue' },
            { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'emerald' },
          ].map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 capitalize ${isActive
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

        {filteredReminders.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Clock}
              title="No reminders"
              message="Create reminders to stay on top of your pet's care"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReminders.map((reminder) => {
              const ReminderIcon = getReminderIcon(reminder.reminder_type);
              const colors = getReminderColors(reminder.reminder_type);
              return (
                <div
                  key={reminder.reminder_id}
                  className={`card hover:shadow-xl transition-all duration-300 border-l-4 ${reminder.is_completed ? 'opacity-60 border-l-slate-400' : `border-l-${colors.gradient.split('-')[1]}-500`
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                        <ReminderIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{reminder.title}</h3>
                        <p className="text-xs text-slate-500 capitalize">{reminder.reminder_type}</p>
                      </div>
                    </div>
                    {reminder.is_completed && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>
                  {reminder.description && (
                    <div className={`p-3 ${colors.bg} rounded-xl border ${colors.border} mb-4`}>
                      <p className="text-sm text-slate-700">{reminder.description}</p>
                    </div>
                  )}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">Date:</span> {formatDate(reminder.reminder_date)}
                    </div>
                    {reminder.reminder_time && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold">Time:</span> {formatTime(reminder.reminder_time)}
                      </div>
                    )}
                  </div>
                  {!reminder.is_completed && (
                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(reminder)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleComplete(reminder.reminder_id)}
                        className="flex-1"
                      >
                        <Check className="w-4 h-4 inline mr-1" />
                        Complete
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(reminder.reminder_id)}
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Reminder Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingReminder(null);
            reset();
          }}
          title={editingReminder ? 'Edit Reminder' : 'Add Reminder'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Reminder Type <span className="text-red-500">*</span>
              </label>
              <select {...register('reminderType')} className="input-field">
                <option value="">Select type</option>
                <option value="vaccination">Vaccination</option>
                <option value="medication">Medication</option>
                <option value="food">Food</option>
                <option value="appointment">Appointment</option>
              </select>
              {errors.reminderType && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.reminderType.message}
                </p>
              )}
            </div>

            <Input
              label="Title"
              {...register('title')}
              error={errors.title?.message}
              required
              placeholder="e.g., Vaccination Due"
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Optional description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                {...register('reminderDate')}
                error={errors.reminderDate?.message}
                required
              />
              <Input
                label="Time (Optional)"
                type="time"
                {...register('reminderTime')}
                error={errors.reminderTime?.message}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 !bg-primary-600 hover:!bg-primary-700">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                {editingReminder ? 'Update' : 'Create'} Reminder
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingReminder(null);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Reminders;
