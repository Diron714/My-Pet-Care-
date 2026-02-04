import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit, Trash2, Package, Search, Filter, RefreshCw, CheckCircle, XCircle, DollarSign, ShoppingBag, Utensils, Gamepad2, Sparkles, Scissors, Heart, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

// Mock data for fallback
const mockProducts = [
  {
    product_id: 1,
    name: 'Premium Dog Food 5kg',
    category: 'Food',
    description: 'High-quality premium dog food with all essential nutrients. Made with real meat and vegetables.',
    price: 3500,
    stock_quantity: 25,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
  {
    product_id: 2,
    name: 'Interactive Dog Toy',
    category: 'Toys',
    description: 'Durable interactive toy that keeps your dog entertained and mentally stimulated.',
    price: 1200,
    stock_quantity: 15,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
  {
    product_id: 3,
    name: 'Cat Litter Box Premium',
    category: 'Accessories',
    description: 'Large, easy-to-clean litter box with odor control. Perfect for indoor cats.',
    price: 2500,
    stock_quantity: 8,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
  {
    product_id: 4,
    name: 'Pet Grooming Kit',
    category: 'Grooming',
    description: 'Complete grooming kit with brush, comb, nail clippers, and shampoo. Everything you need for pet care.',
    price: 4500,
    stock_quantity: 12,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
  {
    product_id: 5,
    name: 'Veterinary Supplements',
    category: 'Health',
    description: 'Essential vitamins and supplements for optimal pet health. Recommended by veterinarians.',
    price: 2800,
    stock_quantity: 0,
    is_available: false,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
  {
    product_id: 6,
    name: 'Dog Leash & Collar Set',
    category: 'Accessories',
    description: 'Premium leather leash and collar set. Adjustable and comfortable for your pet.',
    price: 1800,
    stock_quantity: 20,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
];

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    available: '',
    search: '',
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.available) params.append('available', filters.available);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      // Use mock data as fallback
      let filtered = [...mockProducts];
      
      if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      if (filters.available === 'true') {
        filtered = filtered.filter(p => p.is_available === true);
      } else if (filters.available === 'false') {
        filtered = filtered.filter(p => p.is_available === false);
      }
      if (filters.search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      stock_quantity: parseInt(formData.get('stock_quantity')),
      is_available: formData.get('is_available') === 'on',
    };

    try {
      const url = editingProduct ? `/products/${editingProduct.product_id}` : '/products';
      const method = editingProduct ? 'put' : 'post';
      await api[method](url, data);
      toast.success(editingProduct ? 'Product updated' : 'Product added');
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food':
        return Utensils;
      case 'Toys':
        return Gamepad2;
      case 'Accessories':
        return Sparkles;
      case 'Grooming':
        return Scissors;
      case 'Health':
        return Heart;
      default:
        return Package;
    }
  };

  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Food':
        return {
          gradient: 'from-amber-500 to-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
        };
      case 'Toys':
        return {
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
        };
      case 'Accessories':
        return {
          gradient: 'from-purple-500 to-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
        };
      case 'Grooming':
        return {
          gradient: 'from-pink-500 to-pink-600',
          bg: 'bg-pink-50',
          border: 'border-pink-200',
          text: 'text-pink-700',
        };
      case 'Health':
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
        };
      default:
        return {
          gradient: 'from-slate-500 to-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
        };
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  const availableProducts = products.filter(p => p.is_available).length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
  const lowStock = products.filter(p => p.stock_quantity < 10 && p.stock_quantity > 0).length;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div className="flex-1">
            <h1 className="page-title">Product Management</h1>
            <p className="page-subtitle">Manage product inventory, pricing, and availability</p>
          </div>
          <Button onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }} className="!bg-primary-600 hover:!bg-primary-700">
            <Plus className="w-4 h-4 inline mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Products</p>
                <p className="text-2xl font-black text-slate-900">{products.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Available</p>
                <p className="text-2xl font-black text-emerald-600">{availableProducts}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Stock</p>
                <p className="text-2xl font-black text-blue-600">{totalStock}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Low Stock</p>
                <p className="text-2xl font-black text-amber-600">{lowStock}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
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
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-field"
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Toys">Toys</option>
                <option value="Accessories">Accessories</option>
                <option value="Grooming">Grooming</option>
                <option value="Health">Health</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Availability</label>
              <select
                value={filters.available}
                onChange={(e) => setFilters({ ...filters, available: e.target.value })}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilters({ category: '', available: '', search: '' })}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="card">
            <EmptyState 
              icon={Package}
              title="No products found" 
              message="No products match the selected filters"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const CategoryIcon = getCategoryIcon(product.category);
              const categoryStyles = getCategoryStyles(product.category);
              
              return (
                <div 
                  key={product.product_id} 
                  className={`card hover:shadow-xl transition-all duration-300 border-l-4 ${categoryStyles.border} overflow-hidden`}
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-2xl -mx-6 -mt-6 mb-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${categoryStyles.gradient} flex items-center justify-center`}>
                        <CategoryIcon className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        product.is_available
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {product.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-700">
                          Low Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Product Name and Category */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-slate-900 mb-1">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${categoryStyles.gradient} flex items-center justify-center`}>
                            <CategoryIcon className="w-4 h-4 text-white" />
                          </div>
                          <p className={`text-sm font-semibold ${categoryStyles.text}`}>{product.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Price</p>
                        <p className="text-lg font-black text-emerald-700">{formatCurrencyLKR(product.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Stock</p>
                        <p className={`text-lg font-black ${
                          product.stock_quantity > 0 
                            ? product.stock_quantity < 10 
                              ? 'text-amber-700' 
                              : 'text-emerald-700'
                            : 'text-rose-700'
                        }`}>
                          {product.stock_quantity}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.product_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Product Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-primary-600" />
                <p className="text-sm font-semibold text-primary-700">
                  {editingProduct ? 'Update product information' : 'Add a new product to the inventory'}
                </p>
              </div>
              <p className="text-xs text-primary-600">Fill in all the details below to {editingProduct ? 'update' : 'add'} the product</p>
            </div>

            <Input
              label="Product Name"
              name="name"
              defaultValue={editingProduct?.name || ''}
              required
              placeholder="e.g., Premium Dog Food 5kg"
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select name="category" className="input-field" required defaultValue={editingProduct?.category || ''}>
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Toys">Toys</option>
                <option value="Accessories">Accessories</option>
                <option value="Grooming">Grooming</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                rows={3}
                className="input-field"
                defaultValue={editingProduct?.description || ''}
                placeholder="Describe the product features, benefits, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (LKR)"
                type="number"
                step="0.01"
                name="price"
                defaultValue={editingProduct?.price || ''}
                required
                placeholder="e.g., 3500"
              />
              <Input
                label="Stock Quantity"
                type="number"
                name="stock_quantity"
                defaultValue={editingProduct?.stock_quantity || 0}
                required
                placeholder="e.g., 25"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
              <input type="file" accept="image/*" className="input-field" />
              <p className="text-xs text-slate-500 mt-1">Upload a high-quality image of the product</p>
            </div>

            <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                name="is_available"
                defaultChecked={editingProduct?.is_available !== false}
                className="mr-3 w-4 h-4"
                id="is_available"
              />
              <label htmlFor="is_available" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Make this product available for purchase
              </label>
            </div>

            <div className="flex space-x-4 pt-2">
              <Button type="submit" className="flex-1 !bg-primary-600 hover:!bg-primary-700">
                <Package className="w-4 h-4 inline mr-2" />
                {editingProduct ? 'Update' : 'Add'} Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
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

export default ProductManagement;
