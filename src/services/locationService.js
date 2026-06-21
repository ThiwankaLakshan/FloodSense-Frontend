import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const locationService = {
  getAllLocations: async () => {
    const response = await api.get(API_ENDPOINTS.LOCATIONS.ALL);
    return response.data;
  },

  getLocationById: async (id) => {
    const response = await api.get(API_ENDPOINTS.LOCATIONS.BY_ID(id));
    return response.data;
  },

  getLocationsByDistrict: async (district) => {
    const response = await api.get(API_ENDPOINTS.LOCATIONS.BY_DISTRICT(district));
    return response.data;
  },

  getLocationsByRisk: async (riskLevel) => {
    const response = await api.get(API_ENDPOINTS.LOCATIONS.BY_RISK(riskLevel));
    return response.data;
  },

  getWeatherHistory: async (id, params = {}) => {
    const response = await api.get(API_ENDPOINTS.LOCATIONS.WEATHER_HISTORY(id), {
      params
    });
    return response.data;
  },

  getRiskHistory: async (id, params = {}) => {
    const response = await api.get(API_ENDPOINTS.LOCATIONS.RISK_HISTORY(id), {
      params
    });
    return response.data;
  },

  getDistricts: async () => {
    const response = await api.get(API_ENDPOINTS.LOCATIONS.DISTRICTS);
    return response.data;
  },

  createLocation: async (locationData) => {
    const response = await api.post(API_ENDPOINTS.LOCATIONS.ALL, locationData);
    return response.data;
  },

  updateLocation: async (id, locationData) => {
    const response = await api.put(API_ENDPOINTS.LOCATIONS.BY_ID(id), locationData);
    return response.data;
  },

  deleteLocation: async (id) => {
    const response = await api.delete(API_ENDPOINTS.LOCATIONS.BY_ID(id));
    return response.data;
  }
};

export default locationService;