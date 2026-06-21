import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const dashboardService = {
  getSummary: async () => {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
    return response.data;
  },

  getRiskDistribution: async () => {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.RISK_DISTRIBUTION);
    return response.data;
  },

  getActiveAlerts: async (limit = 10) => {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.ALERTS, {
      params: { limit }
    });
    return response.data;
  },

  getWeatherTrends: async (locationId, hours = 24) => {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.WEATHER_TRENDS(locationId), {
      params: { hours }
    });
    return response.data;
  }
};

export default dashboardService;