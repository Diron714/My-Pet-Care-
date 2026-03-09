import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { getImageSrc, PLACEHOLDER_IMAGE } from '../../utils/helpers';
import { MapPin, CreditCard, Gift, Truck, Shield, CheckCircle, ArrowRight, Percent, DollarSign, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await api.get('/offers');
      setOffers(response.data.data || []);
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  };

  const calculateDiscount = (offer) => {
    if (!offer) return 0;
    if (offer.discount_type === 'percentage') {
      return (cartTotal * offer.discount_value) / 100;
    } else if (offer.discount_type === 'fixed_amount') {
      return Math.min(offer.discount_value, cartTotal);
    }
    return 0;
  };

  const discountAmount = selectedOffer ? calculateDiscount(selectedOffer) : 0;
  const finalAmount = Math.max(0, cartTotal - discountAmount - (loyaltyPointsUsed * 0.01));

  const onSubmit = async (data) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Create order first
      const orderResponse = await api.post('/orders', {
        shipping_address: `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
        payment_method: paymentMethod,
        loyalty_points_used: loyaltyPointsUsed,
      });

      if (orderResponse.data.success) {
        const orderData = orderResponse.data.data;

        // If payment method is card (PayHere), initiate payment
        if (paymentMethod === 'card' && orderData.requires_payment) {
          try {
            // Initiate PayHere payment
            const paymentResponse = await api.post('/payments/payhere/initiate', {
              order_id: orderData.order_id
            });

            if (paymentResponse.data.success) {
              const { payment_data, checkout_url } = paymentResponse.data.data;
              
              // Validate payment data exists
              if (!payment_data || !checkout_url) {
                toast.error('Invalid payment data received');
                setLoading(false);
                return;
              }
              
              // Create and submit form to PayHere
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = checkout_url;
              form.target = '_self'; // Submit in same window
              
              // Add all payment data as hidden fields
              Object.keys(payment_data).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = String(payment_data[key] || ''); // Ensure value is string
                form.appendChild(input);
              });
              
              // Append form to body and submit
              document.body.appendChild(form);
              
              // Log form data for debugging (remove in production)
              if (process.env.NODE_ENV === 'development') {
                console.log('Submitting to PayHere:', {
                  url: checkout_url,
                  fields: Object.keys(payment_data)
                });
              }
              
              form.submit();
              
              // Form will redirect to PayHere, so we don't need to navigate
              return;
            }
          } catch (paymentError) {
            console.error('Payment initiation error:', paymentError);
            toast.error(paymentError.response?.data?.message || 'Failed to initiate payment');
            setLoading(false);
            return;
          }
        } else {
          // For other payment methods, order is complete
          toast.success('Order placed successfully!');
          await clearCart();
          navigate(`/customer/orders/${orderData.order_id}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const displayItems = cartItems;
  const displayTotal = cartTotal;
  const subtotal = displayTotal;
  const shipping = 500;
  const finalDisplayAmount = Math.max(0, subtotal - discountAmount - (loyaltyPointsUsed * 0.01) + shipping);

  if (displayItems.length === 0) {
    return (
      <Layout>
        <div className="page-shell">
          <div className="card text-center py-12">
            <p className="text-slate-600 mb-4 font-semibold">Your cart is empty</p>
            <Button onClick={() => navigate('/customer/products')} className="!bg-slate-800 hover:!bg-slate-900">
              Browse Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Checkout</h1>
            <p className="page-subtitle">Complete your order with secure payment and delivery</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shipping & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="card">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-bold text-slate-900">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Full Address"
                    {...register('address', { required: 'Address is required' })}
                    error={errors.address?.message}
                    required
                    placeholder="Enter your complete address"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      {...register('city', { required: 'City is required' })}
                      error={errors.city?.message}
                      required
                      placeholder="City"
                    />
                    <Input
                      label="State/Province"
                      {...register('state', { required: 'State is required' })}
                      error={errors.state?.message}
                      required
                      placeholder="State"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="ZIP Code"
                      {...register('zip', { required: 'ZIP code is required' })}
                      error={errors.zip?.message}
                      required
                      placeholder="ZIP Code"
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      {...register('phone', { required: 'Phone is required' })}
                      error={errors.phone?.message}
                      required
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: DollarSign, color: 'emerald' },
                    { value: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard, color: 'blue' },
                    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard, color: 'purple' },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.value}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.value
                            ? `bg-${method.color}-50 border-${method.color}-300`
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3 w-4 h-4"
                        />
                        <Icon className={`w-5 h-5 mr-3 ${paymentMethod === method.value ? `text-${method.color}-600` : 'text-slate-400'}`} />
                        <span className="font-semibold capitalize">{method.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Available Offers */}
              {offers.length > 0 && (
                <div className="card">
                  <div className="flex items-center gap-2 mb-6">
                    <Gift className="w-5 h-5 text-slate-600" />
                    <h2 className="text-xl font-bold text-slate-900">Available Offers</h2>
                  </div>
                  <div className="space-y-3">
                    {offers.map((offer) => {
                      const discount = calculateDiscount(offer);
                      return (
                        <label
                          key={offer.offer_id}
                          className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedOffer?.offer_id === offer.offer_id
                              ? 'bg-amber-50 border-amber-300'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                          <input
                            type="radio"
                            name="offer"
                            checked={selectedOffer?.offer_id === offer.offer_id}
                            onChange={() => setSelectedOffer(offer)}
                            className="mt-1 mr-3 w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Gift className="w-4 h-4 text-amber-600" />
                              <p className="font-bold text-slate-900">{offer.title}</p>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{offer.description}</p>
                            <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                              <Percent className="w-4 h-4 text-emerald-600" />
                              <p className="text-sm font-semibold text-emerald-700">
                                Save {formatCurrencyLKR(discount)}
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                  <Truck className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
                </div>

                {/* Cart Items Preview */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {displayItems.map((item) => (
                    <div key={item.cart_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      {item.image_url && (
                        <img
                          src={getImageSrc(item.image_url)}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatCurrencyLKR(item.unitPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyLKR(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span className="flex items-center gap-1">
                        <Percent className="w-4 h-4" />
                        Discount
                      </span>
                      <span className="font-semibold">-{formatCurrencyLKR(discountAmount)}</span>
                    </div>
                  )}
                  {loyaltyPointsUsed > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Loyalty Points
                      </span>
                      <span className="font-semibold">-{formatCurrencyLKR(loyaltyPointsUsed * 0.01)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span className="font-semibold text-slate-900">{formatCurrencyLKR(shipping)}</span>
                  </div>
                  <div className="pt-4 border-t-2 border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-black text-slate-600">{formatCurrencyLKR(finalDisplayAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Use Loyalty Points
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={loyaltyPointsUsed}
                    onChange={(e) => setLoyaltyPointsUsed(parseInt(e.target.value) || 0)}
                    className="input-field"
                    placeholder="Enter points to use"
                  />
                </div>

                <Button type="submit" className="w-full !bg-slate-800 hover:!bg-slate-900 !py-3.5" loading={loading}>
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Place Order
                </Button>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure checkout • SSL encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
