import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { User, Edit, Save, X, Stethoscope, GraduationCap, Briefcase, DollarSign, Star, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

// Mock data for fallback
const mockProfile = {
  specialization: 'Veterinary Medicine',
  qualifications: 'DVM (Doctor of Veterinary Medicine), PhD in Animal Health',
  experience_years: 8,
  consultation_fee: 2500,
  rating: 4.8,
  total_reviews: 124,
  image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
};

const ProfileManagement = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors/profile');
      const data = response.data.data;
      setProfile(data);
      setValue('specialization', data.specialization);
      setValue('qualifications', data.qualifications);
      setValue('experience_years', data.experience_years);
      setValue('consultation_fee', data.consultation_fee);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(mockProfile);
      setValue('specialization', mockProfile.specialization);
      setValue('qualifications', mockProfile.qualifications);
      setValue('experience_years', mockProfile.experience_years);
      setValue('consultation_fee', mockProfile.consultation_fee);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = await api.put('/doctors/profile', data);
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setEditMode(false);
        loadProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><Loading /></Layout>;
  if (!profile) return <Layout><div className="text-center py-12">Profile not found</div></Layout>;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Profile Management</h1>
            <p className="page-subtitle">Manage your professional profile and credentials</p>
          </div>
          {!editMode && (
            <Button onClick={() => setEditMode(true)} className="!bg-primary-600 hover:!bg-primary-700">
              <Edit className="w-4 h-4 inline mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Header */}
          <div className="card p-8 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
            <div className="flex items-center gap-6">
              {profile.image_url ? (
                <div className="h-32 w-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={profile.image_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200?text=Doctor';
                    }}
                  />
                </div>
              ) : (
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-xl">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Dr. Profile</h2>
                {profile.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(profile.rating || 0)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-slate-700">{(profile.rating || 0).toFixed(1)}</span>
                    <span className="text-slate-500">({profile.total_reviews || 0} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
            </div>
            {editMode ? (
              <div className="space-y-4">
                <Input
                  label="Specialization"
                  {...register('specialization', { required: 'Specialization is required' })}
                  error={errors.specialization?.message}
                  required
                  placeholder="e.g., Veterinary Medicine"
                />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-1" />
                    Qualifications <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('qualifications', { required: 'Qualifications are required' })}
                    rows={4}
                    className="input-field !rounded-xl !py-3"
                    placeholder="Enter your educational qualifications..."
                  />
                  {errors.qualifications && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.qualifications.message}
                    </p>
                  )}
                </div>
                <Input
                  label="Experience (Years)"
                  type="number"
                  {...register('experience_years', {
                    required: 'Experience is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Experience cannot be negative' },
                  })}
                  error={errors.experience_years?.message}
                  required
                  placeholder="Years of experience"
                />
                <Input
                  label="Consultation Fee (LKR)"
                  type="number"
                  step="0.01"
                  {...register('consultation_fee', {
                    required: 'Consultation fee is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Fee cannot be negative' },
                  })}
                  error={errors.consultation_fee?.message}
                  required
                  placeholder="Consultation fee in LKR"
                />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Profile Image
                  </label>
                  <input type="file" accept="image/*" className="input-field !rounded-xl !py-3" />
                  <p className="text-xs text-slate-500 mt-1">Upload a professional profile photo (optional)</p>
                </div>
                <div className="flex space-x-4 pt-4">
                  <Button type="submit" className="flex-1 !bg-primary-600 hover:!bg-primary-700" loading={saving}>
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditMode(false);
                      loadProfile();
                    }}
                  >
                    <X className="w-4 h-4 inline mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Specialization</p>
                  </div>
                  <p className="font-bold text-blue-900 text-lg">{profile.specialization}</p>
                </div>
                <div className="p-5 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Experience</p>
                  </div>
                  <p className="font-bold text-purple-900 text-lg">{profile.experience_years} years</p>
                </div>
                <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Consultation Fee</p>
                  </div>
                  <p className="font-bold text-emerald-900 text-lg">
                    {formatCurrencyLKR(profile.consultation_fee)}
                  </p>
                </div>
                <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-amber-600" />
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Rating</p>
                  </div>
                  <p className="font-bold text-amber-900 text-lg">
                    {profile.rating?.toFixed(1) || '0.0'} ({profile.total_reviews || 0} reviews)
                  </p>
                </div>
                <div className="md:col-span-2 p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-slate-600" />
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Qualifications</p>
                  </div>
                  <p className="text-slate-800 leading-relaxed">{profile.qualifications || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProfileManagement;
