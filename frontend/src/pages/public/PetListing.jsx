import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { getImageSrc } from '../../utils/helpers';

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Browse Pets</h1>
            <p className="page-subtitle">Adopt your next best friend from our curated pet collection.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64">
            <div className="card card-muted">
              <h3 className="font-semibold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Species</label>
                  <select
                    value={filters.species}
                    onChange={(e) => setFilters({ ...filters, species: e.target.value })}
                    className="input-field"
                  >
                    <option value="">All</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setFilters({ species: '', breed: '', minPrice: '', maxPrice: '', available: true })}
                  className="btn-secondary w-full"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search pets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pr-8"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {pets.length === 0 ? (
              <EmptyState title="No pets found" message="Try adjusting your filters" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <Link key={pet.pet_id} to={`/customer/pets/${pet.pet_id}`}>
                    <div className="card cursor-pointer hover:shadow-xl transition-all group">
                      <div className="relative h-48 rounded-2xl mb-4 overflow-hidden bg-gradient-to-br from-primary-100/60 via-emerald-50 to-slate-50 flex items-center justify-center">
                        {pet.image_url ? (
                          <img
                            src={getImageSrc(pet.image_url)}
                            alt={pet.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <span className="text-slate-400 text-sm font-medium">Photo coming soon</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900">{pet.name}</h3>
                      <p className="text-slate-500 text-sm">
                        {pet.breed} {pet.species ? `• ${pet.species}` : ''}
                      </p>
                      <p className="mt-3 text-primary-600 font-bold text-lg">{formatCurrency(pet.price)}</p>
                      <span
                        className={`${pet.is_available ? 'badge-success' : 'badge-danger'} mt-3 inline-flex`}
                      >
                        {pet.is_available ? 'Available for adoption' : 'Temporarily unavailable'}
                      </span>
                    </div>
                  </Link>
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

