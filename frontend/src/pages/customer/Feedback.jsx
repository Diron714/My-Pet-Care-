import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSchema } from '../../utils/validators';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { Star, Plus, Package, Stethoscope, Lightbulb, MessageSquare, CheckCircle, Clock, XCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';

// Mock data for fallback
const mockFeedbacks = [
  {
    feedback_id: 1,
    feedback_type: 'product',
    item_name: 'Premium Dog Food',
    rating: 5,
    comment: 'My dog absolutely loves this food! Great quality and fast delivery.',
    status: 'approved',
    admin_response: 'Thank you for your wonderful feedback!',
    created_at: new Date().toISOString(),
  },
  {
    feedback_id: 2,
    feedback_type: 'doctor',
    item_name: 'Dr. James Anderson',
    rating: 4,
    comment: 'Very professional and caring. My pet received excellent treatment.',
    status: 'pending',
    admin_response: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    feedback_id: 3,
    feedback_type: 'service',
    item_name: 'Grooming Service',
    rating: 5,
    comment: 'Outstanding service! My pet looks amazing after the grooming session.',
    status: 'approved',
    admin_response: 'We are thrilled to hear that!',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [feedbackType, setFeedbackType] = useState('product');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(feedbackSchema),
  });

  const selectedType = watch('feedbackType');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feedback');
      setFeedbacks(response.data.data || []);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setFeedbacks(mockFeedbacks);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/feedback', data);
      if (response.data.success) {
        toast.success('Feedback submitted successfully');
        setShowForm(false);
        reset();
        loadFeedbacks();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const getFeedbackTypeIcon = (type) => {
    switch (type) {
      case 'product': return Package;
      case 'service': return Lightbulb;
      case 'doctor': return Stethoscope;
      default: return MessageSquare;
    }
  };

  const getFeedbackTypeColors = (type) => {
    switch (type) {
      case 'product': return { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'service': return { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
      case 'doctor': return { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      default: return { gradient: 'from-slate-500 to-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      case 'pending': return 'badge-warning';
      default: return 'badge-primary';
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Feedback & Ratings</h1>
            <p className="page-subtitle">Share your experience and help us improve</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="!bg-primary-600 hover:!bg-primary-700">
            <Plus className="w-4 h-4 inline mr-2" />
            Submit Feedback
          </Button>
        </div>

        {feedbacks.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Star}
              title="No feedback submitted"
              message="Share your experience with us"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {feedbacks.map((feedback) => {
              const TypeIcon = getFeedbackTypeIcon(feedback.feedback_type);
              const typeColors = getFeedbackTypeColors(feedback.feedback_type);
              return (
                <div key={feedback.feedback_id} className="card hover:shadow-xl transition-all duration-300">
                  <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl bg-gradient-to-r ${typeColors.gradient}`} />
                  <div className="flex items-start gap-4 mb-4 mt-2">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${typeColors.gradient} flex items-center justify-center shadow-lg`}>
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-slate-900 capitalize">
                          {feedback.feedback_type} Feedback
                        </h3>
                        <span className={`badge ${getStatusBadgeClass(feedback.status)} capitalize`}>
                          {feedback.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-600 mb-2">{feedback.item_name}</p>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-semibold text-slate-700 ml-1">({feedback.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  {feedback.comment && (
                    <div className={`p-4 ${typeColors.bg} rounded-xl border ${typeColors.border} mb-3`}>
                      <p className="text-slate-700 leading-relaxed">{feedback.comment}</p>
                    </div>
                  )}
                  {feedback.admin_response && (
                    <div className="p-4 bg-primary-50 rounded-xl border border-primary-200 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-primary-600" />
                        <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Admin Response</p>
                      </div>
                      <p className="text-sm text-primary-800">{feedback.admin_response}</p>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(feedback.created_at)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Feedback Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            reset();
          }}
          title="Submit Feedback"
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Feedback Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('feedbackType')}
                value={feedbackType}
                onChange={(e) => {
                  register('feedbackType').onChange(e);
                  setFeedbackType(e.target.value);
                }}
                className="input-field"
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
                <option value="doctor">Doctor</option>
              </select>
              {errors.feedbackType && (
                <p className="mt-1 text-sm text-red-600">{errors.feedbackType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {selectedType === 'doctor' ? 'Doctor' : selectedType === 'product' ? 'Product' : 'Service'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <select {...register('itemId', { valueAsNumber: true })} className="input-field">
                <option value="">Select {selectedType}</option>
                {/* Items would be loaded based on type */}
              </select>
              {errors.itemId && (
                <p className="mt-1 text-sm text-red-600">{errors.itemId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <select {...register('rating', { valueAsNumber: true })} className="input-field">
                <option value="">Select rating</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} {rating === 1 ? 'Star' : 'Stars'}
                  </option>
                ))}
              </select>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Comment</label>
              <textarea
                {...register('comment')}
                rows={4}
                className="input-field"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 !bg-primary-600 hover:!bg-primary-700">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Submit Feedback
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
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

export default Feedback;
