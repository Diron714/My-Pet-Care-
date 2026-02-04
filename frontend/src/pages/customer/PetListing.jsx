import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';
import { PawPrint, Search, Filter, RefreshCw, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

// Mock data for fallback
const mockPets = [
  {
    pet_id: 1,
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 6,
    price: 45000,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
  },
  {
    pet_id: 2,
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: 4,
    price: 35000,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  },
  {
    pet_id: 3,
    name: 'Charlie',
    species: 'Dog',
    breed: 'Labrador',
    age: 8,
    price: 40000,
    is_available: false,
    image_url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
  },
  {
    pet_id: 4,
    name: 'Bella',
    species: 'Bird',
    breed: 'Parrot',
    age: 2,
    price: 25000,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  },
];

const PetListing = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: '',
    breed: '',
    minPrice: '',
    maxPrice: '',
    available: true,
  });
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    loadPets();
  }, [filters, search]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.species) params.append('species', filters.species);
      if (filters.breed) params.append('breed', filters.breed);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.available) params.append('available', 'true');
      if (search) params.append('search', search);

      const response = await api.get(`/pets?${params.toString()}`);
      setPets(response.data.data || []);
    } catch (error) {
      console.error('Error loading pets:', error);
      let filtered = [...mockPets];
      if (filters.species) {
        filtered = filtered.filter(p => p.species === filters.species);
      }
      if (search) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.breed.toLowerCase().includes(search.toLowerCase())
        );
      }
      setPets(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (petId) => {
    const result = await addToCart('pet', petId, 1);
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
            <h1 className="page-title">Browse Our Pets</h1>
            <p className="page-subtitle">Find your perfect companion from our diverse selection</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="card p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-lg text-slate-800">Filters</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Species</label>
                  <select
                    value={filters.species}
                    onChange={(e) => setFilters({ ...filters, species: e.target.value })}
                    className="input-field !rounded-xl !py-3"
                  >
                    <option value="">All Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Fish">Fish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Price Range</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="input-field !rounded-xl !py-3"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="input-field !rounded-xl !py-3"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setFilters({ species: '', breed: '', minPrice: '', maxPrice: '', available: true })}
                  className="w-full !rounded-xl !py-3 text-primary-600 hover:text-primary-700"
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
                placeholder="Search pets by name or breed..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field !rounded-xl !py-3 !pl-10 bg-slate-50"
              />
            </div>

            {pets.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={PawPrint}
                  title="No pets found"
                  message="Try adjusting your filters or search terms."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <div key={pet.pet_id} className="group">
                    <div className="card overflow-hidden p-0 border-none shadow-lg hover:shadow-xl transition-all duration-300 relative">
                      <div className="relative h-56 overflow-hidden rounded-t-2xl">
                        {pet.image_url ? (
                          <img
                            src={pet.image_url}
                            alt={pet.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400?text=Pet';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <PawPrint className="w-16 h-16 text-slate-400 opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-2xl" />
                        <span className={`absolute top-4 right-4 badge ${
                          pet.is_available ? 'badge-success' : 'badge-danger'
                        } flex items-center gap-1`}>
                          {pet.is_available ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Available
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Unavailable
                            </>
                          )}
                        </span>
                      </div>
                      <div className="p-5">
                        <Link to={`/customer/pets/${pet.pet_id}`}>
                          <h3 className="font-bold text-xl text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{pet.name}</h3>
                        </Link>
                        <p className="text-slate-500 text-sm mb-3">{pet.species} - <span className="font-semibold">{pet.breed}</span></p>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-2xl font-black text-primary-700">{formatCurrencyLKR(pet.price)}</p>
                          <span className="text-xs font-semibold text-slate-400">{pet.age} months old</span>
                        </div>
                        {pet.is_available && (
                          <Button
                            onClick={() => handleAddToCart(pet.pet_id)}
                            className="w-full !bg-primary-600 hover:!bg-primary-700"
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

export default PetListing;
