import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { Star, Check, X, MessageSquare, Package, Stethoscope, ShoppingBag, Filter, User, Calendar, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';

// Mock data for fallback
const mockFeedbacks = [
  {
    feedback_id: 1,
    feedback_type: 'product',
    item_name: 'Premium Dog Food 5kg',
    rating: 5,
    comment: 'Excellent quality! My dog loves it. Highly recommend to all pet owners.',
    status: 'pending',
    customer: { user: { first_name: 'Sarah', last_name: 'Johnson' } },
    created_at: new Date().toISOString(),
  },
  {
    feedback_id: 2,
    feedback_type: 'service',
    item_name: 'Pet Grooming Service',
    rating: 4,
    comment: 'Great service! The staff was professional and my pet looks amazing.',
    status: 'approved',
    customer: { user: { first_name: 'Michael', last_name: 'Chen' } },
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    feedback_id: 3,
    feedback_type: 'doctor',
    item_name: 'Dr. James Anderson',
    rating: 5,
    comment: 'Outstanding veterinarian! Very knowledgeable and caring. My pet received excellent care.',
    status: 'pending',
    customer: { user: { first_name: 'Emma', last_name: 'Williams' } },
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    feedback_id: 4,
    feedback_type: 'product',
    item_name: 'Cat Litter Box',
    rating: 3,
    comment: 'Good product but could be larger. Works well for small cats.',
    status: 'approved',
    customer: { user: { first_name: 'David', last_name: 'Martinez' } },
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    feedback_id: 5,
    feedback_type: 'service',
    item_name: 'Pet Training Session',
    rating: 2,
    comment: 'Not satisfied with the training. Expected more progress.',
    status: 'rejected',
    customer: { user: { first_name: 'Lisa', last_name: 'Brown' } },
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
];

const FeedbackModeration = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    rating: '',
  });

  useEffect(() => {
    loadFeedbacks();
  }, [filters]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.rating) params.append('rating', filters.rating);

      const response = await api.get(`/feedback?${params.toString()}`);
      setFeedbacks(response.data.data || []);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      // Use mock data as fallback
      let filtered = [...mockFeedbacks];
      if (filters.type) {
        filtered = filtered.filter(f => f.feedback_type === filters.type);
      }
      if (filters.status) {
        filtered = filtered.filter(f => f.status === filters.status);
      }
      if (filters.rating) {
        filtered = filtered.filter(f => f.rating === parseInt(filters.rating));
      }
      setFeedbacks(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (feedbackId) => {
    try {
      await api.put(`/feedback/${feedbackId}/status`, { status: 'approved' });
      toast.success('Feedback approved');
      loadFeedbacks();
    } catch (error) {
      toast.error('Failed to approve feedback');
    }
  };

  const handleReject = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to reject this feedback?')) return;

    try {
      await api.put(`/feedback/${feedbackId}/status`, { status: 'rejected' });
      toast.success('Feedback rejected');
      loadFeedbacks();
    } catch (error) {
      toast.error('Failed to reject feedback');
    }
  };

  const handleAddResponse = async () => {
    if (!adminResponse.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      await api.post(`/feedback/${selectedFeedback.feedback_id}/response`, {
        adminResponse,
      });
      toast.success('Response added');
      setShowResponseModal(false);
      setSelectedFeedback(null);
      setAdminResponse('');
      loadFeedbacks();
    } catch (error) {
      toast.error('Failed to add response');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'product':
        return Package;
      case 'service':
        return ShoppingBag;
      case 'doctor':
        return Stethoscope;
      default:
        return MessageSquare;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'product':
        return {
          gradient: 'from-blue-500 to-blue-600',
          border: 'border-l-blue-500',
        };
      case 'service':
        return {
          gradient: 'from-purple-500 to-purple-600',
          border: 'border-l-purple-500',
        };
      case 'doctor':
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          border: 'border-l-emerald-500',
        };
      default:
        return {
          gradient: 'from-slate-500 to-slate-600',
          border: 'border-l-slate-500',
        };
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Feedback Moderation</h1>
            <p className="page-subtitle">Review and moderate customer feedback for products, services, and doctors</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                className="input-field"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilters({ type: '', status: '', rating: '' })}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {feedbacks.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={MessageSquare}
              title="No feedback found"
              message="No feedback to moderate for the selected filters"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {feedbacks.map((feedback) => {
              const TypeIcon = getTypeIcon(feedback.feedback_type);
              const typeStyles = getTypeStyles(feedback.feedback_type);
              return (
                <div 
                  key={feedback.feedback_id} 
                  className={`card hover:shadow-xl transition-all duration-300 border-l-4 ${typeStyles.border}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${typeStyles.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <TypeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-slate-900 capitalize">
                              {feedback.feedback_type} Feedback
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              feedback.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : feedback.status === 'rejected'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {feedback.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                              {feedback.status === 'approved' && <ThumbsUp className="w-3 h-3 inline mr-1" />}
                              {feedback.status === 'rejected' && <ThumbsDown className="w-3 h-3 inline mr-1" />}
                              {feedback.status}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-600 mb-1">{feedback.item_name || 'N/A'}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <User className="w-3 h-3" />
                            <span>{feedback.customer?.user?.first_name} {feedback.customer?.user?.last_name}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(feedback.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < feedback.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-slate-600">({feedback.rating}/5)</span>
                      </div>

                      {/* Comment */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Customer Comment
                        </p>
                        <p className="text-slate-700 leading-relaxed">{feedback.comment || 'No comment provided'}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      {feedback.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(feedback.feedback_id)}
                            className="!bg-emerald-600 hover:!bg-emerald-700"
                          >
                            <Check className="w-4 h-4 inline mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(feedback.feedback_id)}
                          >
                            <X className="w-4 h-4 inline mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          setShowResponseModal(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Respond
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedFeedback && (
          <Modal
            isOpen={showResponseModal}
            onClose={() => {
              setShowResponseModal(false);
              setSelectedFeedback(null);
              setAdminResponse('');
            }}
            title="Add Admin Response"
            size="lg"
          >
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer Feedback</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < selectedFeedback.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">({selectedFeedback.rating}/5)</span>
                </div>
                <p className="text-slate-800 leading-relaxed">{selectedFeedback.comment}</p>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold">Item:</span> {selectedFeedback.item_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold">Customer:</span> {selectedFeedback.customer?.user?.first_name} {selectedFeedback.customer?.user?.last_name}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Response</label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows={4}
                  className="input-field"
                  placeholder="Enter your response to the customer..."
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAddResponse} className="flex-1">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Add Response
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedFeedback(null);
                    setAdminResponse('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default FeedbackModeration;
