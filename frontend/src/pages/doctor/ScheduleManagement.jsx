import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { Plus, Edit, Trash2, Clock, Calendar, CheckCircle, XCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors/schedule');
      setSchedules(response.data.data || []);
    } catch (error) {
      console.error('Error loading schedules:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      day_of_week: formData.get('day_of_week'),
      start_time: formData.get('start_time'),
      end_time: formData.get('end_time'),
      slot_duration: parseInt(formData.get('slot_duration')) || 30,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      const url = editingSchedule ? `/doctors/schedule/${editingSchedule.schedule_id}` : '/doctors/schedule';
      const method = editingSchedule ? 'put' : 'post';
      await api[method](url, data);
      toast.success(editingSchedule ? 'Schedule updated' : 'Schedule added');
      setShowForm(false);
      setEditingSchedule(null);
      loadSchedules();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save schedule');
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await api.delete(`/doctors/schedule/${scheduleId}`);
      toast.success('Schedule deleted');
      loadSchedules();
    } catch (error) {
      toast.error('Failed to delete schedule');
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const daysOfWeek = [
    { value: 'monday', label: 'Monday', color: 'blue' },
    { value: 'tuesday', label: 'Tuesday', color: 'purple' },
    { value: 'wednesday', label: 'Wednesday', color: 'emerald' },
    { value: 'thursday', label: 'Thursday', color: 'amber' },
    { value: 'friday', label: 'Friday', color: 'rose' },
    { value: 'saturday', label: 'Saturday', color: 'violet' },
    { value: 'sunday', label: 'Sunday', color: 'slate' },
  ];

  const getDayColor = (day) => {
    const dayConfig = daysOfWeek.find(d => d.value === day);
    return dayConfig?.color || 'slate';
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Schedule Management</h1>
            <p className="page-subtitle">Manage your weekly availability and appointment slots</p>
          </div>
          <Button onClick={() => {
            setEditingSchedule(null);
            setShowForm(true);
          }} className="!bg-slate-800 hover:!bg-slate-900">
            <Plus className="w-4 h-4 inline mr-2" />
            Add Schedule Slot
          </Button>
        </div>

        {/* Weekly Schedule View */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">Weekly Schedule</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {daysOfWeek.map((day) => {
              const daySchedules = schedules.filter((s) => s.day_of_week === day.value && s.is_active);
              const color = day.color;
              return (
                <div key={day.value} className={`border-2 rounded-xl p-4 bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-200`}>
                  <h3 className="font-bold text-slate-900 capitalize mb-3 text-center">{day.label}</h3>
                  {daySchedules.length === 0 ? (
                    <div className="text-center py-4">
                      <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No slots</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {daySchedules.map((schedule) => (
                        <div key={schedule.schedule_id} className={`p-2 rounded-lg bg-${color}-200 border border-${color}-300`}>
                          <p className="text-xs font-bold text-slate-900">{schedule.start_time} - {schedule.end_time}</p>
                          <p className="text-[10px] text-slate-600">{schedule.slot_duration} min slots</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule List */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">All Schedule Slots</h2>
          </div>
          {schedules.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={Clock}
                title="No schedule slots"
                message="Add schedule slots to set your availability"
              />
            </div>
          ) : (
            <div className="table-shell">
              <table className="table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.schedule_id} className="hover:bg-slate-50 transition-colors">
                      <td>
                        <span className="font-semibold text-slate-900 capitalize">{schedule.day_of_week}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{schedule.start_time}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{schedule.end_time}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-slate-700">{schedule.slot_duration} min</span>
                      </td>
                      <td>
                        <span className={`badge ${schedule.is_active ? 'badge-success' : 'badge-danger'} flex items-center gap-1 w-fit`}>
                          {schedule.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(schedule)}
                            className="!rounded-lg !px-3 !py-1.5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(schedule.schedule_id)}
                            className="!rounded-lg !px-3 !py-1.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Schedule Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingSchedule(null);
          }}
          title={editingSchedule ? 'Edit Schedule Slot' : 'Add Schedule Slot'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Day of Week <span className="text-red-500">*</span>
              </label>
              <select
                name="day_of_week"
                defaultValue={editingSchedule?.day_of_week || ''}
                className="input-field !rounded-xl !py-3"
                required
              >
                <option value="">Select day</option>
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                name="start_time"
                defaultValue={editingSchedule?.start_time || ''}
                required
              />
              <Input
                label="End Time"
                type="time"
                name="end_time"
                defaultValue={editingSchedule?.end_time || ''}
                required
              />
            </div>

            <Input
              label="Slot Duration (minutes)"
              type="number"
              name="slot_duration"
              defaultValue={editingSchedule?.slot_duration || 30}
              min={15}
              step={15}
            />

            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={editingSchedule?.is_active !== false}
                className="mr-3 w-4 h-4"
              />
              <label className="text-sm font-semibold text-slate-700">Active Schedule</label>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 !bg-slate-800 hover:!bg-slate-900">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                {editingSchedule ? 'Update' : 'Add'} Schedule
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingSchedule(null);
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

export default ScheduleManagement;
