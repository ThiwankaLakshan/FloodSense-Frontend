import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format, parseISO } from 'date-fns';

const History = () => {
    const [locations, setLocations] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [floods, setFloods] = useState([]);
    const [floodsLoading, setFloodsLoading] = useState(false);

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
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        if (!selectedId) return;

        const fetchData = async () => {
            try {
                setFloodsLoading(true);

                const [historyRes, floodsRes] = await Promise.all([
                    api.get(`/locations/${selectedId}/risk-history?limit=100`),
                    api.get(`/locations/${selectedId}/historical-floods`)
                ]);

                setHistory(historyRes.data.data || []);
                setFloods(floodsRes.data.data || []);
            } catch (err) {
                console.error("Failed to fetch history data", err);
            } finally {
                setFloodsLoading(false);
            }
        };

        fetchData();
    }, [selectedId]);


    const formatRiskData = (data) => {
        if (!Array.isArray(data)) return [];
        return data.slice().reverse().map(item => ({
            ...item,
            time: format(parseISO(item.timestamp), 'MMM d, HH:mm'),
            numericRisk: item.risk_score // Assuming risk_score is 0-15.
        }));
    };

    if (loading) return <div className="p-8 text-center dark:text-white">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Historical Risk Analysis</h1>

            <div className="mb-8 max-w-md">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Location
                </label>
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                >
                    {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                </select>
            </div>

            {/* Flood Events Table - Top Priority */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recorded Flood Events</h3>

                {floodsLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-slate-50 dark:bg-slate-800/50 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : floods.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                        No recorded flood events found for this location.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Water Level</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rainfall (24h)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                {floods.map((flood) => (
                                    <tr key={flood.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                            {format(parseISO(flood.flood_date), 'MMMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${flood.severity === 'Severe' ? 'bg-red-100 text-red-700' :
                                                    flood.severity === 'Moderate' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {flood.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                            {flood.water_level}m
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                            {flood.rainfall_24h ? `${flood.rainfall_24h}mm` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-md truncate" title={flood.notes}>
                                            {flood.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Risk Assessment History - Secondary */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Risk Assessment History</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risk Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rainfall (24h)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {history.map((record, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                        {format(parseISO(record.timestamp), 'MMM d, HH:mm')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                                record.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                                    record.risk_level === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                            }`}>
                                            {record.risk_level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {record.risk_score}/15
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {record.rainfall_24h}mm
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
