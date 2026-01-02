import { format, formatDistanceToNow } from 'date-fns';
import { RISK_LEVELS } from './constants';

export const formatDate = (date, formatStr = 'MMM dd, yyyy HH:mm') => {
    if (!date) return 'N/A';
    return format(new Date(date), formatStr);
};

export const formatTimeAgo = (date) => {
    if (date) return 'N/A';
    return formatDistanceToNow(new Date(date), { addSuffix: true});
};

export const getRiskLevelInfo = (level) => {
    return RISK_LEVELS[level] || RISK_LEVELS.LOW;
};

export const getRiskColor = (level) => {
    return getRiskLevelInfo(level).color;
};

export const formatRainfall = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${parseFloat(value).toFixed(1)} mm`;
};

export const formatTemperature = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${parseFloat(value).toFixed(1)} °C`;
};

export const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${parseFloat(value).toFixed(1)} %`;
};

export const formatWindSpeed = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${parseFloat(value).toFixed(1)} m/s`;
};

export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getMapCenter = () => {
    return [6.9271, 79.8612]; //colombo
};

export const getMapZoom = () => {
    return 10;
};

export const truncateText = (text,maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const sortByRiskLevel = (locations) => {
    const order = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3 }
    return [...locations].sort((a, b) => {
        return (order[a.risk_level] || 999) - (order[b.risk_level] || 999);
    });
};

export const filterLocationByRisk = (locations, riskLevel) => {
    if (!riskLevel || riskLevel === 'ALL') return locations;
    return locations.filter(loc => loc.risk_level === riskLevel);
};

export const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
};