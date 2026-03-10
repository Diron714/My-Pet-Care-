import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';
import { Package, Search, Filter, RefreshCw, ShoppingCart, CheckCircle, XCircle, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '' });
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, [filters, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (search) params.append('search', search);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart('product', productId, 1);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.message);
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Browse Products</h1>
            <p className="page-subtitle">Discover premium pet care products for your beloved companions</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="card p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-lg text-slate-800">Category</h3>
              </div>
              <div className="space-y-5">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="input-field !rounded-xl !py-3"
                >
                  <option value="">All Categories</option>
                  <option value="Food">Food</option>
                  <option value="Toys">Toys</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Grooming">Grooming</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => setFilters({ category: '' })}
                  className="w-full !rounded-xl !py-3 text-slate-600 hover:text-slate-800"
                >
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field !rounded-xl !py-3 !pl-10 bg-slate-50"
              />
            </div>

            {products.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={Package}
                  title="No products found"
                  message="Try adjusting your filters or search terms"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.product_id} className="group">
                    <div className="card overflow-hidden p-0 border-none shadow-lg hover:shadow-xl transition-all duration-300 relative">
                      <div className="relative h-56 overflow-hidden rounded-t-2xl">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400?text=Product';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <Package className="w-16 h-16 text-slate-400 opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-2xl" />
                        <span className={`absolute top-4 right-4 badge ${product.stock_quantity > 0 ? 'badge-success' : 'badge-danger'
                          } flex items-center gap-1`}>
                          {product.stock_quantity > 0 ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Out of Stock
                            </>
                          )}
                        </span>
                      </div>
                      <div className="p-5">
                        <Link to={`/customer/products/${product.product_id}`}>
                          <div className="mb-2">
                            <span className="px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
                              {product.category}
                            </span>
                          </div>
                          <h3 className="font-bold text-xl text-slate-900 mb-1 group-hover:text-slate-800 transition-colors">{product.name}</h3>
                        </Link>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-2xl font-black text-slate-700">{formatCurrencyLKR(product.price)}</p>
                          <span className="text-xs font-semibold text-slate-400">Stock: {product.stock_quantity}</span>
                        </div>
                        {product.stock_quantity > 0 && (
                          <Button
                            onClick={() => handleAddToCart(product.product_id)}
                            className="w-full !bg-slate-800 hover:!bg-slate-900"
                            size="sm"
                          >
                            <ShoppingCart className="w-4 h-4 inline mr-2" />
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductListing;
