import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Bell, Send, Users, User, Stethoscope, ShoppingCart, Calendar, Gift, Sparkles, AlertCircle, Target, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications?sent=true');
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      target: formData.get('target'),
      notificationType: formData.get('notification_type'),
      title: formData.get('title'),
      message: formData.get('message'),
      relatedId: formData.get('related_id') || null,
    };

    try {
      await api.post('/notifications/broadcast', data);
      toast.success('Notification sent successfully');
      setShowForm(false);
      loadNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order':
        return ShoppingCart;
      case 'appointment':
        return Calendar;
      case 'offer':
        return Gift;
      case 'loyalty':
        return Sparkles;
      case 'system':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'order':
        return {
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
        };
      case 'appointment':
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
        };
      case 'offer':
        return {
          gradient: 'from-amber-500 to-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
        };
      case 'loyalty':
        return {
          gradient: 'from-purple-500 to-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
        };
      case 'system':
        return {
          gradient: 'from-slate-500 to-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
        };
      default:
        return {
          gradient: 'from-primary-500 to-primary-600',
          bg: 'bg-primary-50',
          border: 'border-primary-200',
          text: 'text-primary-700',
        };
    }
  };

  const getTargetIcon = (target) => {
    switch (target) {
      case 'all':
        return Users;
      case 'customers':
        return User;
      case 'doctors':
        return Stethoscope;
      default:
        return Target;
    }
  };

  const getTargetLabel = (target) => {
    switch (target) {
      case 'all':
        return 'All Users';
      case 'customers':
        return 'All Customers';
      case 'doctors':
        return 'All Doctors';
      case 'specific':
        return 'Specific User';
      default:
        return target;
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div className="flex-1">
            <h1 className="page-title">Notification Management</h1>
            <p className="page-subtitle">Send broadcast notifications to users and manage notification history</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="!bg-primary-600 hover:!bg-primary-700">
            <Send className="w-4 h-4 inline mr-2" />
            Send Notification
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Sent</p>
                <p className="text-2xl font-black text-slate-900">{notifications.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Recipients</p>
                <p className="text-2xl font-black text-slate-900">
                  {notifications.reduce((sum, n) => sum + (n.sent_count || 0), 0)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">This Month</p>
                <p className="text-2xl font-black text-slate-900">
                  {notifications.filter(n => {
                    const date = new Date(n.created_at);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Sent Notifications */}
        <div className="card">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sent Notifications</h2>
              <p className="text-xs text-slate-500 mt-1">History of all broadcast notifications</p>
            </div>
          </div>
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications sent"
              message="Send broadcast notifications to users"
            />
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const TypeIcon = getTypeIcon(notification.notification_type);
                const TargetIcon = getTargetIcon(notification.target);
                const styles = getTypeStyles(notification.notification_type);
                return (
                  <div
                    key={notification.notification_id}
                    className={`p-5 rounded-xl border-2 ${styles.border} ${styles.bg} hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${styles.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <TypeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 mb-1">{notification.title}</h3>
                            <p className="text-slate-700 leading-relaxed mb-3">{notification.message}</p>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-700">Sent</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <TargetIcon className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-600">Target:</span>
                            <span className={`px-2 py-1 rounded-full font-semibold ${styles.text} ${styles.bg}`}>
                              {getTargetLabel(notification.target)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-600">Recipients:</span>
                            <span className="font-bold text-slate-900">{notification.sent_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-600">Sent:</span>
                            <span className="text-slate-500">{formatDateTime(notification.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Send Notification Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title="Send Broadcast Notification"
          size="lg"
        >
          <form onSubmit={handleSend} className="space-y-5">
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-primary-600" />
                <p className="text-sm font-semibold text-primary-700">Create a new broadcast notification</p>
              </div>
              <p className="text-xs text-primary-600">Fill in the details below to send a notification to selected users</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Target Audience <span className="text-red-500">*</span>
              </label>
              <select name="target" className="input-field" required>
                <option value="">Select target audience</option>
                <option value="all">All Users</option>
                <option value="customers">All Customers</option>
                <option value="doctors">All Doctors</option>
                <option value="specific">Specific User</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Notification Type <span className="text-red-500">*</span>
              </label>
              <select name="notification_type" className="input-field" required>
                <option value="">Select notification type</option>
                <option value="order">Order</option>
                <option value="appointment">Appointment</option>
                <option value="offer">Offer</option>
                <option value="loyalty">Loyalty</option>
                <option value="system">System</option>
              </select>
            </div>

            <Input
              label="Notification Title"
              name="title"
              required
              placeholder="Enter notification title..."
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                rows={4}
                className="input-field"
                required
                placeholder="Enter notification message..."
              />
            </div>

            <Input
              label="Related ID (Optional)"
              type="number"
              name="related_id"
              placeholder="Order ID, Appointment ID, etc."
            />

            <div className="flex space-x-4 pt-2">
              <Button type="submit" className="flex-1 !bg-primary-600 hover:!bg-primary-700">
                <Send className="w-4 h-4 inline mr-2" />
                Send Notification
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
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

export default NotificationManagement;
