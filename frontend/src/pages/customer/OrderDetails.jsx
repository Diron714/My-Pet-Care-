import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { Download, ArrowLeft, ShoppingCart, MapPin, CreditCard, Package, Truck, CheckCircle, XCircle, DollarSign, Percent, Sparkles, Calendar } from 'lucide-react';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success('Order cancelled successfully');
      loadOrderDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/orders/${id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order.order_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'shipped':
        return Truck;
      case 'processing':
      case 'confirmed':
        return Package;
      case 'cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  if (loading) return <Layout><Loading /></Layout>;
  if (!order) return <Layout><div className="text-center py-12">Order not found</div></Layout>;

  const StatusIcon = getStatusIcon(order.order_status);

  return (
    <Layout>
      <div className="page-shell">
        <Link to="/customer/orders" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="card mb-6 border-l-4 border-l-primary-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Order #{order.order_number}</h1>
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(order.created_at)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${getStatusColor(order.order_status)}`}>
                <StatusIcon className="w-4 h-4" />
                {order.order_status}
              </span>
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold uppercase tracking-wider ${getStatusColor(order.payment_status)}`}>
                {order.payment_status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">Shipping Address</h3>
              </div>
              <p className="text-blue-700">{order.shipping_address}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-purple-900">Payment Method</h3>
              </div>
              <p className="text-purple-700 capitalize">{order.payment_method?.replace('_', ' ')}</p>
            </div>
          </div>

          {order.transaction_reference && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">Transaction Reference: <span className="font-mono">{order.transaction_reference}</span></p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-slate-900">Order Items</h2>
          </div>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.order_item_id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-slate-200 flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=Item';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{item.item_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Quantity: <span className="font-semibold">{item.quantity}</span></span>
                    <span>Unit Price: <span className="font-semibold">{formatCurrencyLKR(item.unit_price)}</span></span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-primary-600">{formatCurrencyLKR(item.subtotal)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrencyLKR(order.total_amount)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between items-center text-emerald-600">
                <span className="flex items-center gap-1">
                  <Percent className="w-4 h-4" />
                  Discount
                </span>
                <span className="font-semibold">-{formatCurrencyLKR(order.discount_amount)}</span>
              </div>
            )}
            {order.loyalty_points_used > 0 && (
              <div className="flex justify-between items-center text-emerald-600">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Loyalty Points
                </span>
                <span className="font-semibold">-{formatCurrencyLKR(order.loyalty_points_used * 0.01)}</span>
              </div>
            )}
            <div className="pt-4 border-t-2 border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-primary-600">{formatCurrencyLKR(order.final_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownloadInvoice} variant="outline" className="!bg-white hover:!bg-slate-50">
            <Download className="w-4 h-4 inline mr-2" />
            Download Invoice
          </Button>
          {order.order_status === 'pending' && (
            <Button onClick={handleCancel} variant="danger">
              <XCircle className="w-4 h-4 inline mr-2" />
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
