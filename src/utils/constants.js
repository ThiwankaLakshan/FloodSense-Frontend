export const RISK_LEVELS = {
  CRITICAL: {
    label: 'Critical',
    color: '#DC2626',
    bgColor: 'bg-red-600',
    textColor: 'text-red-600',
    borderColor: 'border-red-600',
    action: 'Evacuate immediately to higher ground'
  },
  HIGH: {
    label: 'High',
    color: '#F97316',
    bgColor: 'bg-orange-600',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-600',
    action: 'Prepare to evacuate - secure property and gather emergency supplies'
  },
  MODERATE: {
    label: 'Moderate',
    color: '#EAB308',
    bgColor: 'bg-yellow-600',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-600',
    action: 'Stay alert - monitor updates and review evacuation plan'
  },
  LOW: {
    label: 'Low',
    color: '#22C55E',
    bgColor: 'bg-green-600',
    textColor: 'text-green-600',
    borderColor: 'border-green-600',
    action: 'Normal conditions - maintain general awareness'
  }
};

export const DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara'
];

export const PERIODS = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' }
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/login',
    VERIFY: '/admin/verify',
    REFRESH: '/admin/refresh-token',
    PROFILE: '/admin/profile'
  },
  LOCATIONS: {
    ALL: '/locations',
    BY_ID: (id) => `/locations/${id}`,
    BY_DISTRICT: (district) => `/locations/district/${district}`,
    BY_RISK: (level) => `/locations/risk/${level}`,
    WEATHER_HISTORY: (id) => `/locations/${id}/weather-history`,
    RISK_HISTORY: (id) => `/locations/${id}/risk-history`,
    DISTRICTS: '/locations/districts'
  },
  WEATHER: {
    CURRENT: '/locations/current',
    BY_ID: (id) => `/locations/${id}/current`,
    HISTORY: (id) => `/locations/${id}/history`,
    STATS: (id) => `/locations/${id}/stats`,
    ALERTS: '/locations/alerts'
  },
  RISK: {
    ALL: '/locations',
    BY_ID: (id) => `/locations/${id}/latest`,
    HISTORY: (id) => `/locations/${id}/history`,
    TREND: (id) => `/locations/${id}/trend`,
    STATS: (id) => `/locations/${id}/stats`
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    RISK_DISTRIBUTION: '/dashboard/risk-distribution',
    ALERTS: '/dashboard/alerts',
    WEATHER_TRENDS: (id) => `/dashboard/weather-trends/${id}`
  }
};