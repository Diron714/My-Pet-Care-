import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { Package, ShoppingCart, Plus, Minus, ArrowLeft, CheckCircle, XCircle, Star, Tag, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

// Mock data for fallback
const mockProduct = {
  product_id: 1,
  name: 'Premium Dog Food 5kg',
  category: 'Food',
  price: 3500,
  stock_quantity: 50,
  description: 'High-quality premium dog food made with natural ingredients. Rich in protein and essential nutrients for your dog\'s health and vitality. Suitable for all dog breeds and ages.',
  image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
  rating: 4.8,
  total_reviews: 124,
};

const mockRelatedProducts = [
  {
    product_id: 2,
    name: 'Interactive Dog Toy',
    category: 'Toys',
    price: 1200,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
  {
    product_id: 3,
    name: 'Cat Litter Box Premium',
    category: 'Accessories',
    price: 2500,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
  {
    product_id: 4,
    name: 'Pet Grooming Kit',
    category: 'Grooming',
    price: 4500,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
];

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      const [productRes, relatedRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products?category=${product?.category}&limit=4`),
      ]);
      setProduct(productRes.data.data);
      setRelatedProducts(relatedRes.data.data?.filter(p => p.product_id !== parseInt(id)) || []);
    } catch (error) {
      console.error('Error loading product details:', error);
      setProduct(mockProduct);
      setRelatedProducts(mockRelatedProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock_quantity < quantity) {
      toast.error('Insufficient stock');
      return;
    }
    const result = await addToCart('product', product.product_id, quantity);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.message);
    }
  };

  if (loading) return <Layout><Loading /></Layout>;
  if (!product) return <Layout><div className="text-center py-12">Product not found</div></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <Link to="/customer/products" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden border-4 border-slate-200 shadow-xl">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800?text=Product';
                  }}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                  <Package className="w-24 h-24 text-primary-600 opacity-50" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                  product.stock_quantity > 0
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
                }`}>
                  {product.stock_quantity > 0 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      In Stock
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Out of Stock
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div>
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary-100 text-primary-700">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4">{product.name}</h1>
            
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-slate-700">{(product.rating || 0).toFixed(1)}</span>
                <span className="text-slate-500">({product.total_reviews || 0} reviews)</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="p-5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-1">Price</p>
                    <p className="text-3xl font-black text-primary-900">{formatCurrencyLKR(product.price)}</p>
                  </div>
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                    <Tag className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-blue-600" />
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Stock</p>
                  </div>
                  <p className="font-bold text-blue-900">{product.stock_quantity} available</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Delivery</p>
                  </div>
                  <p className="font-bold text-emerald-900">2-3 days</p>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Description</h3>
                <p className="text-slate-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
                >
                  <Minus className="w-5 h-5 text-slate-600" />
                </button>
                <span className="text-xl font-bold text-slate-900 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="w-12 h-12 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {product.stock_quantity > 0 ? (
              <Button onClick={handleAddToCart} className="w-full !bg-primary-600 hover:!bg-primary-700 !py-4">
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Add to Cart
              </Button>
            ) : (
              <Button disabled className="w-full !py-4">
                <XCircle className="w-5 h-5 inline mr-2" />
                Out of Stock
              </Button>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.product_id} to={`/customer/products/${relatedProduct.product_id}`}>
                  <div className="card hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-l-primary-500">
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      {relatedProduct.image_url ? (
                        <img
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400?text=Product';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                          <Package className="w-16 h-16 text-primary-600 opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{relatedProduct.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{relatedProduct.category}</p>
                      <p className="text-lg font-black text-primary-600">{formatCurrencyLKR(relatedProduct.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
