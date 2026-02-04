import api from './api';

export const orderService = {
  // Get all orders
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get order by ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Cancel order
  cancel: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Get order status
  getStatus: async (id) => {
    const response = await api.get(`/orders/${id}/status`);
    return response.data;
  },
};

export default orderService;

