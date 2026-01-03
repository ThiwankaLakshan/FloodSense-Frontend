import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const authService = {
  login: async (username, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  verifyToken: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.VERIFY);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }
};

export default authService;