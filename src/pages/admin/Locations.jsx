import React, { useState, useEffect } from 'react';
import { Trash2, MapPin, Search, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await api.get('/locations');
            setLocations(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching locations:', err);
            setError('Failed to load locations.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) return;

        try {
            await api.delete(`/locations/${id}`);
            setLocations(prev => prev.filter(loc => loc.id !== id));
        } catch (err) {
            console.error('Error deleting location:', err);
            alert('Failed to delete location. It may be in use.');
        }
    };

    const filteredLocations = locations.filter(loc =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-text-gray">Loading locations...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-dark-navy dark:text-white">Manage Locations</h1>
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                    <input
                        type="text"
                        placeholder="Search locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-light-gray dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none transition-colors dark:text-white"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-light-gray dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-soft-white dark:bg-slate-700/50 text-xs uppercase text-text-gray dark:text-gray-400 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">District</th>
                                <th className="px-6 py-4">Coordinates</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-gray dark:divide-slate-700">
                            {filteredLocations.map((location) => (
                                <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary dark:text-blue-400">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-dark-navy dark:text-white">{location.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-text-gray dark:text-gray-300">{location.district}</td>
                                    <td className="px-6 py-4 text-text-gray dark:text-gray-400 font-mono text-xs">
                                        {location.latitude ? Number(location.latitude).toFixed(4) : '-'}, {location.longitude ? Number(location.longitude).toFixed(4) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const getRiskStyles = (level) => {
                                                switch (level?.toUpperCase()) {
                                                    case 'CRITICAL': return { bg: '#EF44441A', text: '#EF4444' };
                                                    case 'HIGH': return { bg: '#F973161A', text: '#F97316' };
                                                    case 'MODERATE': return { bg: '#FACC151A', text: '#FACC15' };
                                                    default: return { bg: '#22C55E1A', text: '#22C55E' };
                                                }
                                            };
                                            // Assuming location object has risk_level. If not, we might need to fetch it or just show Active status
                                            // The previous code showed "Active" hardcoded. I should probably check if I should replace "Status" with "Risk" or just color "Active"
                                            // The user asked to correct risk level colors. If this table doesn't show risk, I should probably leave it or check if I can show risk.
                                            // Looking at the file content, it has `status` column but renders "Active".
                                            // If the user wants risk colors everywhere, and this is a "Locations" list, maybe they expect to see risk here too?
                                            // But for now, I will stick to the existing "Active" badge but maybe use the safe green color?
                                            // Actually, the previous code used `bg-green-100 text-green-800`.
                                            // Let's stick to the requested Green #22C55E for "Active" / Low risk equivalent context.
                                            return (
                                                <span
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                    style={{ backgroundColor: '#22C55E1A', color: '#22C55E' }}
                                                >
                                                    Active
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(location.id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            title="Delete Location"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredLocations.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-gray dark:text-gray-500">
                                        No locations found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Locations;
