import axios from 'axios';

const API = axios.create({
baseURL: 'https://a1furnished-api.vercel.app/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('a1_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globallyhhh
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('a1_token');
      localStorage.removeItem('a1_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ===== PROPERTIES =====
export const propertyAPI = {
  getAll: (params) => API.get('/properties', { params }),
  getBySlug: (slug) => API.get(`/properties/${slug}`),
  create: (data) => API.post('/properties', data),
  update: (id, data) => API.put(`/properties/${id}`, data),
  delete: (id) => API.delete(`/properties/${id}`),
  uploadImages: (id, formData) => API.post(`/properties/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (id, imageId) => API.delete(`/properties/${id}/images/${imageId}`),
  addReview: (id, data) => API.post(`/properties/${id}/reviews`, data),
  incrementViews: (id) => API.post(`/properties/${id}/views`)
};

// ===== BOOKINGS =====
export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getAll: (params) => API.get('/bookings', { params }),
  getById: (id) => API.get(`/bookings/${id}`),
  update: (id, data) => API.put(`/bookings/${id}`, data),
  checkAvailability: (propertyId, params) => API.get(`/bookings/check/${propertyId}`, { params })
};

// ===== INQUIRIES =====
export const inquiryAPI = {
  submit: (data) => API.post('/inquiries', data),
  getAll: (params) => API.get('/inquiries', { params }),
  update: (id, data) => API.put(`/inquiries/${id}`, data)
};

// ===== AUTH =====
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
  changePassword: (data) => API.put('/auth/password', data)
};

// ===== ADMIN =====
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  createUser: (data) => API.post('/admin/users', data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`)
};

export default API;
