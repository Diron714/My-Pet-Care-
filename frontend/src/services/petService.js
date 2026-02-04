import api from './api';

export const petService = {
  // Get all pets (with filters)
  getAll: async (params = {}) => {
    const response = await api.get('/pets', { params });
    return response.data;
  },

  // Get pet by ID
  getById: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  // Get customer's pets
  getCustomerPets: async () => {
    const response = await api.get('/customers/pets');
    return response.data;
  },

  // Create customer pet profile
  createCustomerPet: async (petData) => {
    const response = await api.post('/customers/pets', petData);
    return response.data;
  },

  // Update customer pet profile
  updateCustomerPet: async (id, petData) => {
    const response = await api.put(`/customers/pets/${id}`, petData);
    return response.data;
  },

  // Delete customer pet profile
  deleteCustomerPet: async (id) => {
    const response = await api.delete(`/customers/pets/${id}`);
    return response.data;
  },

  // Get pet vaccinations
  getVaccinations: async (petId) => {
    const response = await api.get(`/customers/pets/${petId}/vaccinations`);
    return response.data;
  },

  // Add vaccination
  addVaccination: async (petId, vaccinationData) => {
    const response = await api.post(`/customers/pets/${petId}/vaccinations`, vaccinationData);
    return response.data;
  },

  // Get feeding schedules
  getFeedingSchedules: async (petId) => {
    const response = await api.get(`/customers/pets/${petId}/feeding-schedules`);
    return response.data;
  },

  // Add feeding schedule
  addFeedingSchedule: async (petId, scheduleData) => {
    const response = await api.post(`/customers/pets/${petId}/feeding-schedules`, scheduleData);
    return response.data;
  },
};

export default petService;

