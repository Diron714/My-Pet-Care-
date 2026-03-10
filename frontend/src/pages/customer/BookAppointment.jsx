import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { appointmentSchema } from '../../utils/validators';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { getImageSrc, PLACEHOLDER_IMAGE } from '../../utils/helpers';
import { Calendar, Clock, Stethoscope, PawPrint, DollarSign, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Format currency as LKR
const formatCurrencyLKR = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount || 0);
};

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedDoctorId = searchParams.get('doctorId');

  const [doctors, setDoctors] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: preSelectedDoctorId ? preSelectedDoctorId : '',
      customerPetId: '',
      appointmentDate: '',
      appointmentTime: '',
    },
  });

  const selectedDoctorId = watch('doctorId');
  const selectedDate = watch('appointmentDate');
  const selectedPetId = watch('customerPetId');

  useEffect(() => {
    loadDoctors();
    loadPets();
  }, []);

  // When doctors load, apply URL pre-selected doctor
  useEffect(() => {
    if (doctors.length === 0 || !preSelectedDoctorId) return;
    const id = parseInt(preSelectedDoctorId, 10);
    if (!id) return;
    const exists = doctors.some((d) => d.doctor_id === id);
    if (exists) setValue('doctorId', id);
  }, [doctors, preSelectedDoctorId, setValue]);

  useEffect(() => {
    const id = selectedDoctorId ? parseInt(selectedDoctorId, 10) : null;
    if (id) {
      const doctor = doctors.find((d) => d.doctor_id === id);
      setSelectedDoctor(doctor || null);
    } else {
      setSelectedDoctor(null);
    }
  }, [selectedDoctorId, doctors]);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      loadAvailableSlots(selectedDoctorId, selectedDate);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctorId, selectedDate]);

  const loadDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
    }
  };

  const loadPets = async () => {
    try {
      const response = await api.get('/customer-pets');
      setPets(response.data.data || []);
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  const loadAvailableSlots = async (doctorId, date) => {
    try {
      setLoadingSlots(true);
      const response = await api.get('/appointments/available-slots', {
        params: { doctorId, date },
      });
      const slots = response.data.data || [];
      // Keep only available time strings for the dropdown
      setAvailableSlots(slots.filter((s) => s.available).map((s) => s.time));
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/appointments', {
        doctor_id: parseInt(data.doctorId),
        customer_pet_id: parseInt(data.customerPetId),
        appointment_date: data.appointmentDate,
        appointment_time: data.appointmentTime,
      });

      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/customer/appointments');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const selectedPet = pets.find(p => p.customer_pet_id === parseInt(selectedPetId));

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Book Appointment</h1>
            <p className="page-subtitle">Schedule a consultation with our expert veterinarians</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Doctor Selection */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Select Doctor</h2>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Choose Your Veterinarian <span className="text-red-500">*</span>
              </label>
              <select
                {...register('doctorId')}
                className="input-field"
                onChange={(e) => {
                  register('doctorId').onChange(e);
                  const doctor = doctors.find(d => d.doctor_id === parseInt(e.target.value));
                  setSelectedDoctor(doctor || null);
                }}
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.doctorId.message}
                </p>
              )}
            </div>

            {selectedDoctor && (
              <div className="mt-6 p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200">
                <div className="flex items-start gap-4">
                  {selectedDoctor.image_url ? (
                    <img
                      src={getImageSrc(selectedDoctor.image_url)}
                      alt={`Dr. ${selectedDoctor.first_name}`}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-300"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center border-2 border-emerald-300">
                      <Stethoscope className="w-10 h-10 text-white" />
                    </div>
                  )}
                    <div className="flex-1">
                    <h3 className="font-bold text-lg text-emerald-900 mb-1">
                      Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
                    </h3>
                    <p className="text-emerald-700 font-semibold mb-3">{selectedDoctor.specialization}</p>
                    <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg border border-emerald-200">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Consultation Fee</p>
                        <p className="text-lg font-black text-emerald-900">{formatCurrencyLKR(selectedDoctor.consultation_fee)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pet Selection */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <PawPrint className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Select Pet</h2>
            </div>
            {pets.length === 0 ? (
              <div className="p-6 bg-amber-50 rounded-xl border-2 border-amber-200 text-center">
                <PawPrint className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                <p className="text-amber-800 font-semibold mb-4">You don't have any pets registered yet.</p>
                <Button type="button" onClick={() => navigate('/customer/pet-profiles/new')} className="!bg-amber-600 hover:!bg-amber-700">
                  Add New Pet
                </Button>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Choose Your Pet <span className="text-red-500">*</span>
                </label>
                <select {...register('customerPetId')} className="input-field">
                  <option value="">Select a pet</option>
                  {pets.map((pet) => (
                    <option key={pet.customer_pet_id} value={pet.customer_pet_id}>
                      {pet.name} - {pet.species} ({pet.breed})
                    </option>
                  ))}
                </select>
                {errors.customerPetId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customerPetId.message}
                  </p>
                )}

                {selectedPet && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3">
                    {selectedPet.image_url ? (
                      <img
                        src={getImageSrc(selectedPet.image_url)}
                        alt={selectedPet.name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-blue-300"
onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-blue-300">
                        <PawPrint className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-blue-900">{selectedPet.name}</p>
                      <p className="text-sm text-blue-700">{selectedPet.species} - {selectedPet.breed}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date & Time Selection */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Select Date & Time</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('appointmentDate')}
                  min={minDate}
                  className="input-field"
                />
                {errors.appointmentDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.appointmentDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Available Time <span className="text-red-500">*</span>
                </label>
                {loadingSlots ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-slate-600">Loading available slots...</p>
                  </div>
                ) : availableSlots.length === 0 && selectedDate ? (
                  <div className="p-4 bg-rose-50 rounded-xl border-2 border-rose-200 text-center">
                    <AlertCircle className="w-5 h-5 text-rose-600 mx-auto mb-2" />
                    <p className="text-rose-700 font-semibold">No available slots for this date</p>
                  </div>
                ) : (
                  <select {...register('appointmentTime')} className="input-field">
                    <option value="">Select time</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                )}
                {errors.appointmentTime && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.appointmentTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Appointment Summary */}
          {selectedDoctor && selectedPet && selectedDate && (
            <div className="card bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-bold text-slate-800">Appointment Summary</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/80 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Stethoscope className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Doctor</p>
                      <p className="font-bold text-slate-800">
                        Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
                      </p>
                      <p className="text-sm text-slate-700">{selectedDoctor.specialization}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-slate-600" />
                      <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Consultation Fee</p>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{formatCurrencyLKR(selectedDoctor.consultation_fee)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              type="submit"
              className="flex-1 !bg-slate-800 hover:!bg-slate-900"
              loading={loading}
              disabled={pets.length === 0}
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Book Appointment
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/customer/appointments')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BookAppointment;
