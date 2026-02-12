import api from './api';
<<<<<<< HEAD

const AUTH_TOKEN_KEY = 'floodsense_admin_token';
const AUTH_USER_KEY = 'floodsense_admin_user';

export const authService = {
    /**
     * Login admin user
     * @param {string} username - Admin username or email
     * @param {string} password - Admin password
     * @returns {Promise<Object>} - User data and token
     */
    login: async (username, password) => {
        try {
            const response = await api.post('/admin/login', { username, password });
            const { token, user } = response.data;
            
            if (token) {
                localStorage.setItem(AUTH_TOKEN_KEY, token);
                // Also store user info if needed
                if (user) {
                    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
                }
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout admin user
     */
    logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        // Optional: Redirect or refresh page
        window.location.href = '/admin/login';
    },

    /**
     * Get current auth token
     * @returns {string|null}
     */
    getToken: () => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem(AUTH_TOKEN_KEY);
    }
};

// Add request interceptor to attach token to requests
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
=======
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
>>>>>>> a29626e94b42c14b8464ecef18fb11d2b9af8118
