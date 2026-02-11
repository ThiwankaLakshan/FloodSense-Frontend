import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    MapPin,
    Bell,
    Activity,
    Users,
    AlertTriangle,
    CheckCircle,
    CloudRain
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { format } from 'date-fns';
import api from '../../services/api';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored icons for risk levels
const createRiskIcon = (level) => {
    let color = '#22C55E'; // Green - Low
    if (level?.toUpperCase() === 'MODERATE') color = '#FACC15'; // Yellow
    if (level?.toUpperCase() === 'HIGH') color = '#F97316'; // Orange
    if (level?.toUpperCase() === 'CRITICAL') color = '#EF4444'; // Red

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        locations: 0,
        activeAlerts: 0,
        subscribers: 0,
        systemHealth: 'Online'
    });
    const [riskData, setRiskData] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats concurrently
                const [locationsRes, alertsRes, subsRes, riskRes] = await Promise.all([
                    api.get('/locations'),
                    api.get('/alerts/active'),
                    api.get('/subscriptions'),
                    api.get('/dashboard/risk-distribution')
                ]);

                const locationsData = locationsRes.data.data || [];
                setLocations(locationsData);

                setStats({
                    locations: locationsRes.data.count || locationsData.length || 0,
                    activeAlerts: alertsRes.data.data?.length || 0,
                    subscribers: subsRes.data.data?.length || 0,
                    systemHealth: 'Online' // Mocked as valid API endpoint not guaranteed
                });

                // Format risk data for chart
                const riskDist = riskRes.data.data || {};
                const formattedRisk = [
                    { name: 'Low', value: riskDist.LOW || 0, color: '#22C55E' },      // Green
                    { name: 'Moderate', value: riskDist.MODERATE || 0, color: '#FACC15' }, // Yellow
                    { name: 'High', value: riskDist.HIGH || 0, color: '#F97316' },    // Orange
                    { name: 'Critical', value: riskDist.CRITICAL || 0, color: '#EF4444' }, // Red
                ].filter(item => item.value > 0);

                setRiskData(formattedRisk);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setStats(prev => ({ ...prev, systemHealth: 'Degraded' }));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { title: 'Total Locations', value: stats.locations, icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Active Alerts', value: stats.activeAlerts, icon: Bell, color: 'text-red-600', bg: 'bg-red-100' },
        { title: 'Subscribers', value: stats.subscribers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'System Status', value: stats.systemHealth, icon: Activity, color: stats.systemHealth === 'Online' ? 'text-green-600' : 'text-orange-600', bg: stats.systemHealth === 'Online' ? 'bg-green-100' : 'bg-orange-100' },
    ];

    // Center of Western Province roughly
    const defaultCenter = [6.9271, 79.8612];

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-dark-navy dark:text-white">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-light-gray dark:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-gray dark:text-gray-400">{card.title}</p>
                                    <p className="text-2xl font-bold text-dark-navy dark:text-white mt-1">{card.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${card.bg} dark:bg-opacity-20`}>
                                    <Icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Map Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-light-gray dark:border-slate-700">
                <h2 className="text-lg font-bold text-dark-navy dark:text-white mb-4">Live Flood Map</h2>
                <div className="h-[500px] w-full relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <MapContainer center={defaultCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {locations.map((loc) => {
                            // Ensure valid coordinates before rendering marker
                            if (!loc.latitude || !loc.longitude) return null;
                            return (
                                <Marker
                                    key={loc.id}
                                    position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
                                    icon={createRiskIcon(loc.risk_level || 'Low')}
                                >
                                    <Popup>
                                        <div className="min-w-[200px]">
                                            <h3 className="font-bold text-lg mb-1">{loc.name}</h3>
                                            <p className="text-sm text-slate-600 mb-2">{loc.district}</p>

                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">Risk Level:</span>
                                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${loc.risk_level?.toUpperCase() === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                                    loc.risk_level?.toUpperCase() === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                                        loc.risk_level?.toUpperCase() === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {loc.risk_level || 'Low'}
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-500 mt-2 border-t pt-2">
                                                Last Updated: {loc.risk_timestamp ? format(new Date(loc.risk_timestamp), 'PP p') : 'N/A'}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>

                    {/* Map Legend Overlay */}
                    <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg z-[1000] border border-slate-200 dark:border-slate-800 text-xs">
                        <h4 className="font-bold mb-2 text-dark-navy dark:text-white">Risk Levels</h4>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EF4444' }}></span>
                                <span className="text-slate-700 dark:text-slate-300">Critical</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F97316' }}></span>
                                <span className="text-slate-700 dark:text-slate-300">High</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FACC15' }}></span>
                                <span className="text-slate-700 dark:text-slate-300">Moderate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22C55E' }}></span>
                                <span className="text-slate-700 dark:text-slate-300">Low</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Distribution Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-light-gray dark:border-slate-700">
                    <h2 className="text-lg font-bold text-dark-navy dark:text-white mb-4">Current Risk Distribution</h2>
                    <div className="h-64">
                        {riskData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-text-gray dark:text-gray-400">
                                <CheckCircle className="w-12 h-12 mb-2 text-green-500" />
                                <p>No risk data available (All Clear)</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Activity / Recent Alerts Placeholder */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-light-gray dark:border-slate-700">
                    <h2 className="text-lg font-bold text-dark-navy dark:text-white mb-4">System Status</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <div>
                                <p className="text-sm font-medium text-dark-navy dark:text-white">API Services</p>
                                <p className="text-xs text-green-600 dark:text-green-400">Operational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <CloudRain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-sm font-medium text-dark-navy dark:text-white">Weather Data Collection</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">Active (Sync every 15m)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <div>
                                <p className="text-sm font-medium text-dark-navy dark:text-white">Risk Analysis Engine</p>
                                <p className="text-xs text-purple-600 dark:text-purple-400">Running</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
