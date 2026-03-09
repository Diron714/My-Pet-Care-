import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, PawPrint, Search, Filter, RefreshCw, Dog, Cat, Bird, Rabbit, CheckCircle, XCircle, Package, DollarSign, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import { getImageSrc, PLACEHOLDER_IMAGE } from '../../utils/helpers';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [filters, setFilters] = useState({
    species: '',
    breed: '',
    available: '',
    search: '',
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadPets();
  }, [filters]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.species) params.append('species', filters.species);
      if (filters.breed) params.append('breed', filters.breed);
      if (filters.available) params.append('available', filters.available);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/pets?${params.toString()}`);
      setPets(response.data.data || []);
    } catch (error) {
      console.error('Error loading pets:', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      species: formData.get('species'),
      breed: formData.get('breed'),
      age: parseInt(formData.get('age')),
      gender: formData.get('gender'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      stock_quantity: parseInt(formData.get('stock_quantity')),
      is_available: formData.get('is_available') === 'on',
      ...(imageDataUrl && { image_url: imageDataUrl }),
    };

    try {
      const url = editingPet ? `/pets/${editingPet.pet_id}` : '/pets';
      const method = editingPet ? 'put' : 'post';
      await api[method](url, data);
      toast.success(editingPet ? 'Pet updated' : 'Pet added');
      setShowForm(false);
      setEditingPet(null);
      setImageDataUrl(null);
      setImagePreview(null);
      loadPets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save pet');
    }
  };

  const handleDelete = async (petId) => {
    try {
      setDeleteLoading(true);
      await api.delete(`/pets/${petId}`);
      toast.success('Pet deleted');
      loadPets();
    } catch (error) {
      toast.error('Failed to delete pet');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleToggleAvailability = async (pet) => {
    try {
      await api.put(`/pets/${pet.pet_id}`, {
        ...pet,
        is_available: !pet.is_available,
      });
      toast.success('Availability updated');
      loadPets();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You don't have permission to update pets. Please login as an admin or staff user.");
      } else {
        toast.error(error.response?.data?.message || 'Failed to update availability');
      }
    }
  };

  const getSpeciesIcon = (species) => {
    switch (species) {
      case 'Dog':
        return Dog;
      case 'Cat':
        return Cat;
      case 'Bird':
        return Bird;
      case 'Rabbit':
        return Rabbit;
      default:
        return PawPrint;
    }
  };

  const getSpeciesColor = (species) => {
    switch (species) {
      case 'Dog':
        return {
          gradient: 'from-amber-500 to-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
        };
      case 'Cat':
        return {
          gradient: 'from-purple-500 to-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
        };
      case 'Bird':
        return {
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        };
      case 'Rabbit':
        return {
          gradient: 'from-pink-500 to-pink-600',
          bg: 'bg-pink-50',
          border: 'border-pink-200',
        };
      default:
        return {
          gradient: 'from-slate-500 to-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
        };
    }
  };

  if (loading) return <Loading />;

  const availablePets = pets.filter(p => p.is_available).length;
  const totalStock = pets.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);

  return (
    <div className="page-shell">
        <div className="page-header">
          <div className="flex-1">
            <h1 className="page-title">Pet Management</h1>
            <p className="page-subtitle">Manage pet inventory, availability, and details</p>
          </div>
          <Button onClick={() => {
            setEditingPet(null);
            setImageDataUrl(null);
            setImagePreview(null);
            setShowForm(true);
          }} className="!bg-slate-800 hover:!bg-slate-900">
            <Plus className="w-4 h-4 inline mr-2" />
            Add New Pet
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Pets</p>
                <p className="text-2xl font-black text-slate-900">{pets.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Available</p>
                <p className="text-2xl font-black text-emerald-600">{availablePets}</p>
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
                <Package className="w-6 h-6 text-white" />
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
                  placeholder="Search pets..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input-field pl-10 pr-8"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Species</label>
              <select
                value={filters.species}
                onChange={(e) => setFilters({ ...filters, species: e.target.value })}
                className="input-field"
              >
                <option value="">All Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
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
                onClick={() => setFilters({ species: '', breed: '', available: '', search: '' })}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={PawPrint}
              title="No pets found"
              message="No pets match the selected filters"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const SpeciesIcon = getSpeciesIcon(pet.species);
              const speciesColors = getSpeciesColor(pet.species);

              return (
                <div
                  key={pet.pet_id}
                  className={`card hover:shadow-xl transition-all duration-300 border-l-4 ${speciesColors.border} overflow-hidden`}
                >
                  {/* Pet Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-2xl -mx-6 -mt-6 mb-4">
                    {pet.image_url ? (
                      <img
                        src={getImageSrc(pet.image_url)}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${speciesColors.gradient} flex items-center justify-center`}>
                        <SpeciesIcon className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${pet.is_available
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                        }`}>
                        {pet.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Pet Name and Species */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-slate-900 mb-1">{pet.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${speciesColors.gradient} flex items-center justify-center`}>
                            <SpeciesIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{pet.species}</p>
                            <p className="text-xs text-slate-500">{pet.breed}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 line-clamp-2">{pet.description}</p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Age</p>
                        <p className="text-sm font-bold text-slate-900">{pet.age} months</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Gender</p>
                        <p className="text-sm font-bold text-slate-900 capitalize">{pet.gender}</p>
                      </div>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Price</p>
                        <p className="text-lg font-black text-emerald-700">{formatCurrencyLKR(pet.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Stock</p>
                        <p className={`text-lg font-black ${pet.stock_quantity > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {pet.stock_quantity}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAvailability(pet)}
                        className={`flex-1 ${pet.is_available
                            ? '!bg-rose-50 !text-rose-700 hover:!bg-rose-100'
                            : '!bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100'
                          }`}
                      >
                        {pet.is_available ? (
                          <>
                            <XCircle className="w-4 h-4 inline mr-1" />
                            Mark Unavailable
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Mark Available
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPet(pet);
                          setImageDataUrl(null);
                          setImagePreview(null);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteTarget(pet)}
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

        {/* Pet Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingPet(null);
          }}
          title={editingPet ? 'Edit Pet' : 'Add New Pet'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <PawPrint className="w-5 h-5 text-slate-600" />
                <p className="text-sm font-semibold text-slate-700">
                  {editingPet ? 'Update pet information' : 'Add a new pet to the inventory'}
                </p>
              </div>
              <p className="text-xs text-slate-600">Fill in all the details below to {editingPet ? 'update' : 'add'} the pet</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Pet Name"
                name="name"
                defaultValue={editingPet?.name || ''}
                required
                placeholder="e.g., Max, Luna"
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Species <span className="text-red-500">*</span>
                </label>
                <select name="species" className="input-field" required defaultValue={editingPet?.species || ''}>
                  <option value="">Select species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                </select>
              </div>
            </div>

            <Input
              label="Breed"
              name="breed"
              defaultValue={editingPet?.breed || ''}
              required
              placeholder="e.g., Golden Retriever, Persian"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age (months)"
                type="number"
                name="age"
                defaultValue={editingPet?.age || ''}
                required
                placeholder="e.g., 3"
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select name="gender" className="input-field" required defaultValue={editingPet?.gender || ''}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                rows={3}
                className="input-field"
                defaultValue={editingPet?.description || ''}
                placeholder="Describe the pet's characteristics, temperament, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (LKR)"
                type="number"
                step="0.01"
                name="price"
                defaultValue={editingPet?.price || ''}
                required
                placeholder="e.g., 45000"
              />
              <Input
                label="Stock Quantity"
                type="number"
                name="stock_quantity"
                defaultValue={editingPet?.stock_quantity || 0}
                required
                placeholder="e.g., 2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pet Image</label>
              {(imagePreview || editingPet?.image_url) && (
                <div className="mb-2 w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img
                    src={imagePreview || getImageSrc(editingPet?.image_url)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input type="file" accept="image/*" className="input-field" onChange={handleImageChange} />
              <p className="text-xs text-slate-500 mt-1">Upload a high-quality image of the pet</p>
            </div>

            <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                name="is_available"
                defaultChecked={editingPet?.is_available !== false}
                className="mr-3 w-4 h-4"
                id="is_available"
              />
              <label htmlFor="is_available" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Make this pet available for purchase
              </label>
            </div>

            <div className="flex space-x-4 pt-2">
              <Button type="submit" className="flex-1 !bg-slate-800 hover:!bg-slate-900">
                <PawPrint className="w-4 h-4 inline mr-2" />
                {editingPet ? 'Update' : 'Add'} Pet
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingPet(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete confirmation dialog */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Delete pet"
          message={
            deleteTarget
              ? `Are you sure you want to delete pet "${deleteTarget.name}"?`
              : ''
          }
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={deleteLoading}
          onCancel={() => {
            if (deleteLoading) return;
            setDeleteTarget(null);
          }}
          onConfirm={() => deleteTarget && handleDelete(deleteTarget.pet_id)}
        />
      </div>
  );
};

export default PetManagement;
