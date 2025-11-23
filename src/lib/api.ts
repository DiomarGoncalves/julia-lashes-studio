import axios from 'axios';

// Configure base API URL - adjust this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/sistema/login';
    }
    return Promise.reject(error);
  }
);

// API Functions

// Auth
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  logout: () => {
    localStorage.removeItem('auth_token');
  },
};

// Services
export const servicesAPI = {
  getAll: async () => {
    const { data } = await api.get('/services');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/services/${id}`);
    return data;
  },
  create: async (serviceData: any) => {
    const { data } = await api.post('/services', serviceData);
    return data;
  },
  update: async (id: string, serviceData: any) => {
    const { data } = await api.put(`/services/${id}`, serviceData);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/services/${id}`);
    return data;
  },
};

// Appointments
export const appointmentsAPI = {
  getAvailability: async (serviceId: string, date: string) => {
    const { data } = await api.get('/availability', {
      params: { serviceId, date },
    });
    return data;
  },
  create: async (appointmentData: any) => {
    const { data } = await api.post('/appointments', appointmentData);
    return data;
  },
  getAll: async (filters?: any) => {
    const { data } = await api.get('/appointments', { params: filters });
    return data;
  },
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/appointments/${id}/status`, { status });
    return data;
  },
};

// Clients
export const clientsAPI = {
  getAll: async () => {
    const { data } = await api.get('/clients');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },
  getHistory: async (id: string) => {
    const { data } = await api.get(`/clients/${id}/history`);
    return data;
  },
  create: async (clientData: any) => {
    const { data } = await api.post('/clients', clientData);
    return data;
  },
  update: async (id: string, clientData: any) => {
    const { data } = await api.put(`/clients/${id}`, clientData);
    return data;
  },
};

// Settings
export const settingsAPI = {
  get: async () => {
    const { data } = await api.get('/settings');
    return data;
  },
  update: async (settingsData: any) => {
    const { data } = await api.put('/settings', settingsData);
    return data;
  },
};

// Contact
export const contactAPI = {
  send: async (contactData: any) => {
    const { data } = await api.post('/contact', contactData);
    return data;
  },
};
