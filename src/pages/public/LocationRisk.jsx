import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { MapPin, Thermometer, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const LocationRisk = () => {
    const [locations, setLocations] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get('/locations');
                setLocations(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedId(res.data.data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch locations", err);
                setError('Failed to load locations.');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        if (!selectedId) return;

        const fetchDetails = async () => {
            try {
                setDetailsLoading(true);
                const res = await api.get(`/locations/${selectedId}`);
                setDetails(res.data.data);
            } catch (err) {
                console.error("Failed to fetch location details", err);
            } finally {
                setDetailsLoading(false);
            }
        };

        fetchDetails();
    }, [selectedId]);

    if (loading) return <div className="p-8 text-center text-[#0F172A]">Loading...</div>;
    if (error) return <div className="p-8 text-center text-[#EF4444]">{error}</div>;

    const { location, currentWeather, currentRisk } = details || {};

    const getRiskStyles = (level) => {
        switch (level?.toUpperCase()) {
            case 'CRITICAL': return { color: '#EF4444', bg: '#EF44441A', border: '#EF444433' };
            case 'HIGH': return { color: '#F97316', bg: '#F973161A', border: '#F9731633' };
            case 'MODERATE': return { color: '#FACC15', bg: '#FACC151A', border: '#FACC1533' };
            default: return { color: '#22C55E', bg: '#22C55E1A', border: '#22C55E33' };
        }
    };
    const riskStyles = getRiskStyles(currentRisk?.risk_level);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-[#0F172A]">Location Risk Details</h1>

            {/* Location Selector */}
            <div className="mb-8">
                <label htmlFor="location-select" className="block text-sm font-medium text-[#64748B] mb-2">
                    Select Location
                </label>
                <div className="relative">
                    <select
                        id="location-select"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="block w-full rounded-md border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm focus:border-[#0B5ED7] focus:ring-[#0B5ED7] sm:text-lg py-3 px-4 appearance-none"
                    >
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name} - {loc.district}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#64748B]">
                        <MapPin className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Details Panel */}
            {detailsLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-64 bg-[#E2E8F0] rounded-xl"></div>
                </div>
            ) : location ? (
                <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                    {/* Header with Risk Level */}
                    <div className="p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: riskStyles.border }}>
                        <div>
                            <h2 className="text-3xl font-bold text-[#0F172A]">{location.name}</h2>
                            <p className="text-[#64748B] flex items-center gap-1 mt-1">
                                <MapPin size={16} />
                                {location.district}
                            </p>
                        </div>
                        <div
                            className="px-6 py-3 rounded-full border-2 text-center"
                            style={{ backgroundColor: riskStyles.bg, borderColor: riskStyles.border, color: riskStyles.color }}
                        >
                            <span className="block text-xs uppercase tracking-wider font-bold opacity-80">Current Risk</span>
                            <span className="text-xl font-black">{currentRisk?.risk_level || 'Low'}</span>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Weather Data */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                                <Thermometer className="text-[#0B5ED7]" /> Current Weather
                            </h3>
                            <div className="bg-[#F8FAFC] rounded-lg p-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-[#64748B]">Temperature</p>
                                    <p className="text-xl font-bold text-[#0F172A]">{currentWeather?.temperature ? `${currentWeather.temperature}°C` : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#64748B]">Humidity</p>
                                    <p className="text-xl font-bold text-[#0F172A]">{currentWeather?.humidity ? `${currentWeather.humidity}%` : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#64748B]">Pressure</p>
                                    <p className="text-xl font-bold text-[#0F172A]">{currentWeather?.pressure ? `${currentWeather.pressure} hPa` : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#64748B]">Rainfall (24h)</p>
                                    <p className="text-xl font-bold text-[#4FD1C5]">{currentWeather?.rainfall_mm ? `${currentWeather.rainfall_mm} mm` : '0 mm'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Risk & Safety */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                                <AlertTriangle className="text-[#F97316]" /> Risk Analysis
                            </h3>
                            <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-4">
                                <div>
                                    <p className="text-sm text-[#64748B]">Risk Score</p>
                                    <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 mt-1">
                                        <div
                                            className="h-2.5 rounded-full"
                                            style={{
                                                width: `${Math.min((currentRisk?.risk_score || 0) / 15 * 100, 100)}%`,
                                                backgroundColor: currentRisk?.risk_level?.toUpperCase() === 'CRITICAL' ? '#EF4444' :
                                                    currentRisk?.risk_level?.toUpperCase() === 'HIGH' ? '#F97316' :
                                                        currentRisk?.risk_level?.toUpperCase() === 'MODERATE' ? '#FACC15' : '#22C55E'
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-right mt-1 text-[#64748B]">{currentRisk?.risk_score || 0}/15</p>
                                </div>

                                <div>
                                    <p className="text-sm text-[#64748B] mb-1">Recommendation</p>
                                    <div className="p-3 bg-white rounded border border-[#E2E8F0] text-sm leading-relaxed text-[#0F172A]">
                                        {currentRisk?.description || (
                                            currentRisk?.risk_level?.toUpperCase() === 'CRITICAL' ? "IMMEDIATE EVACUATION ADVISED. Move to higher ground." :
                                                currentRisk?.risk_level?.toUpperCase() === 'HIGH' ? "Prepare for evacuation. Secure valuables." :
                                                    currentRisk?.risk_level?.toUpperCase() === 'MODERATE' ? "Be alert. Monitor water levels." :
                                                        "Conditions are normal. No immediate action required."
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Timestamp */}
                    <div className="bg-[#F8FAFC] p-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
                        Data last updated: {currentWeather?.timestamp ? format(new Date(currentWeather.timestamp), 'PPpp') : 'N/A'}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-[#64748B]">Select a location to view details</div>
            )}
        </div>
    );
};

export default LocationRisk;
