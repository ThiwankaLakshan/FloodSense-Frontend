import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';
import { format } from 'date-fns';

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

const Map = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get('/locations');
                setLocations(res.data.data);
            } catch (err) {
                console.error("Failed to fetch locations for map", err);
                setError('Failed to load map data.');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // Center of Western Province roughly
    const defaultCenter = [6.9271, 79.8612];

    if (loading) return <div className="h-[calc(100vh-64px)] flex items-center justify-center dark:text-white">Loading Map...</div>;
    if (error) return <div className="h-[calc(100vh-64px)] flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="h-[calc(100vh-64px)] w-full relative">
            <MapContainer center={defaultCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((loc) => (
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
                ))}
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute bottom-8 right-8 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-lg z-[1000] border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold mb-2 text-sm dark:text-white">Risk Levels</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }}></span>
                        <span className="text-xs text-slate-700 dark:text-slate-300">Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F97316' }}></span>
                        <span className="text-xs text-slate-700 dark:text-slate-300">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FACC15' }}></span>
                        <span className="text-xs text-slate-700 dark:text-slate-300">Moderate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22C55E' }}></span>
                        <span className="text-xs text-slate-700 dark:text-slate-300">Low</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;
