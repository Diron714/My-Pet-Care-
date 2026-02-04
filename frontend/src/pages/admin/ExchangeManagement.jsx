import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';
import { Package, Check, X, RefreshCw, User, ShoppingBag, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

// Mock data for fallback
const mockExchanges = [
  {
    exchange_id: 1,
    status: 'pending',
    customer: { user: { first_name: 'Sarah', last_name: 'Johnson' } },
    order: { order_number: 'ORD-2024-001' },
    pet: { name: 'Golden Retriever Puppy' },
    reason: 'Pet size mismatch - ordered small but received medium',
    created_at: new Date().toISOString(),
  },
  {
    exchange_id: 2,
    status: 'approved',
    customer: { user: { first_name: 'Michael', last_name: 'Chen' } },
    order: { order_number: 'ORD-2024-002' },
    pet: { name: 'Persian Cat' },
    reason: 'Color preference - customer wants different color',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    exchange_id: 3,
    status: 'pending',
    customer: { user: { first_name: 'Emma', last_name: 'Williams' } },
    order: { order_number: 'ORD-2024-003' },
    pet: { name: 'Labrador Puppy' },
    reason: 'Health concerns - pet not matching description',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

const ExchangeManagement = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadExchanges();
  }, [filter]);

  const loadExchanges = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`/exchanges${params}`);
      setExchanges(response.data.data || []);
    } catch (error) {
      console.error('Error loading exchanges:', error);
      // Use mock data as fallback
      let filtered = [...mockExchanges];
      if (filter !== 'all') {
        filtered = filtered.filter(e => e.status === filter);
      }
      setExchanges(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (exchangeId) => {
    try {
      await api.put(`/exchanges/${exchangeId}/approve`);
      toast.success('Exchange request approved');
      loadExchanges();
    } catch (error) {
      toast.error('Failed to approve exchange');
    }
  };

  const handleReject = async (exchangeId) => {
    if (!window.confirm('Are you sure you want to reject this exchange request?')) return;

    try {
      await api.put(`/exchanges/${exchangeId}/reject`);
      toast.success('Exchange request rejected');
      loadExchanges();
    } catch (error) {
      toast.error('Failed to reject exchange');
    }
  };

  const filters = [
    { value: 'all', label: 'All', icon: Package, color: 'slate' },
    { value: 'pending', label: 'Pending', icon: AlertCircle, color: 'amber' },
    { value: 'approved', label: 'Approved', icon: Check, color: 'emerald' },
    { value: 'rejected', label: 'Rejected', icon: X, color: 'rose' },
    { value: 'completed', label: 'Completed', icon: RefreshCw, color: 'blue' },
  ];

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Exchange Management</h1>
            <p className="page-subtitle">Manage product and pet exchange requests from customers</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? `bg-${f.color}-600 text-white shadow-lg shadow-${f.color}-500/30`
                    : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : `text-${f.color}-600`}`} />
                {f.label}
              </button>
            );
          })}
        </div>

        {exchanges.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Package}
              title="No exchange requests"
              message="No exchange requests found for the selected filter"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {exchanges.map((exchange) => (
              <div key={exchange.exchange_id} className="card hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">
                          Exchange Request #{exchange.exchange_id}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(exchange.status)}`}>
                            {exchange.status}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(exchange.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <User className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Customer</p>
                          <p className="font-semibold text-slate-900">
                            {exchange.customer?.user?.first_name} {exchange.customer?.user?.last_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <ShoppingBag className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Order</p>
                          <p className="font-semibold text-slate-900">#{exchange.order?.order_number}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Exchange Reason
                      </p>
                      <p className="text-slate-700 leading-relaxed">{exchange.reason}</p>
                    </div>

                    {exchange.pet && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                        <span className="font-semibold">Pet:</span>
                        <span>{exchange.pet.name}</span>
                      </div>
                    )}
                  </div>
                  
                  {exchange.status === 'pending' && (
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(exchange.exchange_id)}
                        className="!bg-emerald-600 hover:!bg-emerald-700"
                      >
                        <Check className="w-4 h-4 inline mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(exchange.exchange_id)}
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExchangeManagement;
