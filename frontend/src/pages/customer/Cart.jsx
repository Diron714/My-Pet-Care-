import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { getImageSrc, PLACEHOLDER_IMAGE } from '../../utils/helpers';
import { Trash2, Plus, Minus, ShoppingCart, Package, DollarSign, ArrowRight, Tag, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const Cart = () => {
  const { cartItems, loading, cartTotal, updateCartItem, removeFromCart, loadCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(cartId);
      toast.success('Item removed from cart');
    } else {
      await updateCartItem(cartId, newQuantity);
    }
  };

  const handleRemove = async (cartId) => {
    await removeFromCart(cartId);
    toast.success('Item removed from cart');
  };

  if (loading) return <Layout><Loading /></Layout>;

  const displayItems = cartItems;
  const displayTotal = cartTotal;
  const subtotal = displayTotal;
  const discount = 0;
  const shipping = 500;
  const total = subtotal - discount + shipping;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Shopping Cart</h1>
            <p className="page-subtitle">Review your items and proceed to checkout</p>
          </div>
        </div>

        {displayItems.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              message="Start shopping to add items to your cart"
              action={
                <Link to="/customer/products">
                  <Button className="!bg-slate-800 hover:!bg-slate-900">
                    <Package className="w-4 h-4 inline mr-2" />
                    Browse Products
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {displayItems.map((item) => (
                <div key={item.cart_id} className="card hover:shadow-xl transition-all duration-300 border-l-4 border-l-slate-600">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-200">
                      {item.image_url ? (
                        <img
                          src={getImageSrc(item.image_url)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                          <Package className="w-12 h-12 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-slate-500 capitalize">{item.item_type}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.cart_id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 border-2 border-slate-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                              className="p-2 hover:bg-slate-100 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-slate-600" />
                            </button>
                            <span className="px-4 py-2 font-semibold text-slate-900 min-w-[3rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                              className="p-2 hover:bg-slate-100 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>

                          {/* Unit Price */}
                          <div className="text-sm">
                            <p className="text-slate-500">Unit Price</p>
                            <p className="font-semibold text-slate-700">{formatCurrencyLKR(item.unitPrice)}</p>
                          </div>
                        </div>

                        {/* Total Price */}
                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total</p>
                          <p className="text-xl font-black text-slate-600">
                            {formatCurrencyLKR((item.unitPrice || 0) * (item.quantity || 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                  <ShoppingCart className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyLKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Discount
                    </span>
                    <span className="font-semibold text-emerald-600">{formatCurrencyLKR(discount)}</span>
                  </div>
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
                      <span className="text-2xl font-black text-slate-600">{formatCurrencyLKR(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/customer/checkout')}
                    className="w-full !bg-slate-800 hover:!bg-slate-900 !py-3.5"
                  >
                    <ArrowRight className="w-4 h-4 inline mr-2" />
                    Proceed to Checkout
                  </Button>
                  <Link to="/customer/products">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Package className="w-4 h-4" />
                    <span>Secure checkout • Free returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
