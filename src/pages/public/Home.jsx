import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { format } from 'date-fns';
import api from '../../services/api';
import SummaryCards from '../../components/public/SummaryCards';

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

const Home = () => {
    const [stats, setStats] = useState({
        totalLocations: 0,
        activeAlerts: 0,
        highestRisk: 'Low',
        lastUpdated: null
    });
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Center of Western Province roughly
    const defaultCenter = [6.9271, 79.8612];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Locations
                const locationsRes = await api.get('/locations');
                const locationsData = locationsRes.data.data;
                setLocations(locationsData);

                // Fetch Active Alerts
                let activeAlertsCount = 0;
                try {
                    const alertsRes = await api.get('/alerts/active');
                    // Check if alertsRes.data is array or object with data property
                    const alertsData = Array.isArray(alertsRes.data) ? alertsRes.data : (alertsRes.data.data || []);
                    activeAlertsCount = alertsData.length;
                } catch (err) {
                    console.warn("Could not fetch alerts", err);
                    // Fallback: calculate from locations
                    activeAlertsCount = locationsData.filter(l => l.risk_level === 'High' || l.risk_level === 'Critical').length;
                }

                // Calculate Stats
                const totalLocations = locationsData.length;

                let highestRisk = 'Low';
                const riskLevels = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];
                let maxRiskIndex = -1;
                let lastUpdated = null;

                locationsData.forEach(loc => {
                    const currentRisk = loc.risk_level ? loc.risk_level.toUpperCase() : 'LOW';
                    const riskIndex = riskLevels.indexOf(currentRisk);

                    if (riskIndex > maxRiskIndex) {
                        maxRiskIndex = riskIndex;
                        // Keep the original casing for display if preferred, or normalize. 
                        // Let's store the normalized Uppercase or Title case. 
                        // For consistency with other UI, let's map back to Title Case or just use the found level.
                        // Actually, the UI colored badges likely expect specific strings or we just use the text.
                        // The previous logic stored `loc.risk_level`. 
                        // Let's store the capitalized version of the found risk for display consistency, 
                        // or better yet, map it to a nice display format or keep original but trust the index.
                        // Let's us the riskLevels array value to likely match standard.
                        // But wait, if I have 'Critical' and 'CRITICAL', I want to just pick the highest "concept".
                        // Let's set highestRisk to the display friendly version of the max level found.
                        const displayRisks = ['Low', 'Moderate', 'High', 'Critical'];
                        highestRisk = displayRisks[riskIndex] || 'Low';
                    }

                    if (loc.risk_timestamp) {
                        const date = new Date(loc.risk_timestamp);
                        if (!lastUpdated || date > lastUpdated) {
                            lastUpdated = date;
                        }
                    }
                });

                setStats({
                    totalLocations,
                    activeAlerts: activeAlertsCount,
                    highestRisk,
                    lastUpdated
                });

            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-risk-critical text-lg">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A]">Flood Monitoring Dashboard</h1>
                <p className="text-[#64748B] mt-2">Real-time flood risk monitoring for Western Province</p>
            </div>

            <SummaryCards stats={stats} loading={loading} />

            {/* Map Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Live Flood Risk Map</h2>
                <div className="h-[500px] w-full relative rounded-lg overflow-hidden border border-slate-200">
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
                    <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] border border-slate-200 text-xs">
                        <h4 className="font-bold mb-2 text-slate-800">Risk Levels</h4>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EF4444' }}></span>
                                <span className="text-slate-700">Critical</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F97316' }}></span>
                                <span className="text-slate-700">High</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FACC15' }}></span>
                                <span className="text-slate-700">Moderate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22C55E' }}></span>
                                <span className="text-slate-700">Low</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
