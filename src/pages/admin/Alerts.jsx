import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Send, RefreshCw, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const Alerts = () => {
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [triggerLoading, setTriggerLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        locationIds: [], // Currently supporting single select in UI for simplicity
        riskLevel: 'HIGH',
        message: '',
        severity: 'HIGH'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [alertsRes, locationsRes] = await Promise.all([
                api.get('/alerts/active'),
                api.get('/locations')
            ]);
            setActiveAlerts(alertsRes.data.data || []);
            setLocations(locationsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTriggerAlert = async (e) => {
        e.preventDefault();
        setTriggerLoading(true);

        try {
            await api.post('/alerts', {
                location_id: formData.locationIds[0],
                alert_type: 'FLOOD',
                recipient: 'PUBLIC',
                risk_level: formData.riskLevel,
                message: formData.message,
                status: 'active'
            });

            // Refresh alerts list
            const res = await api.get('/alerts/active');
            setActiveAlerts(res.data.data || []);

            // Reset form
            setFormData(prev => ({ ...prev, message: '' }));
            alert('Alert triggered successfully!');
        } catch (error) {
            console.error('Error triggering alert:', error);
            alert('Failed to trigger alert. Check console for details.');
        } finally {
            setTriggerLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-dark-navy dark:text-white">Alert Management</h1>
                <button
                    onClick={fetchData}
                    className="p-2 text-text-gray hover:text-primary transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trigger Alert Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-light-gray dark:border-slate-700 p-6 sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-dark-navy dark:text-white">Trigger Manual Alert</h2>
                        </div>

                        <form onSubmit={handleTriggerAlert} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-1">Target Location</label>
                                <select
                                    className="w-full px-3 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.locationIds[0] || ''}
                                    onChange={(e) => setFormData({ ...formData, locationIds: [e.target.value] })}
                                    required
                                >
                                    <option value="">Select a location...</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name} ({loc.district})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-1">Risk Level</label>
                                <select
                                    className="w-full px-3 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.riskLevel}
                                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                                >
                                    <option value="MODERATE">Moderate Risk</option>
                                    <option value="HIGH">High Risk</option>
                                    <option value="CRITICAL">Critical Risk</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-1">Alert Message</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none h-32 resize-none"
                                    placeholder="Enter detailed alert message..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={triggerLoading || !formData.locationIds[0]}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-white transition-all ${triggerLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {triggerLoading ? 'Processing...' : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Broadcast Alert
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Active Alerts List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-dark-navy dark:text-white mb-4">Active System Alerts</h2>

                    {loading ? (
                        <div className="text-center py-12 text-text-gray">Loading alerts...</div>
                    ) : activeAlerts.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border dashed border-light-gray dark:border-slate-700">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-dark-navy dark:text-white">All Clear</h3>
                            <p className="text-text-gray dark:text-gray-400">No active flood alerts in the system.</p>
                        </div>
                    ) : (
                        activeAlerts.map(alert => {
                            const getRiskColor = (level) => {
                                switch (level?.toUpperCase()) {
                                    case 'CRITICAL': return { bg: '#EF44441A', text: '#EF4444' };
                                    case 'HIGH': return { bg: '#F973161A', text: '#F97316' };
                                    case 'MODERATE': return { bg: '#FACC151A', text: '#FACC15' };
                                    default: return { bg: '#22C55E1A', text: '#22C55E' };
                                }
                            };
                            const styles = getRiskColor(alert.risk_level);

                            return (
                                <div key={alert.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-light-gray dark:border-slate-700 p-6 flex flex-col sm:flex-row gap-4 sm:items-start">
                                    <div
                                        className="p-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: styles.bg, color: styles.text }}
                                    >
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-dark-navy dark:text-white">
                                                {alert.location_name || 'Unknown Location'}
                                            </h3>
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                                                style={{ backgroundColor: styles.bg, color: styles.text }}
                                            >
                                                {alert.risk_level}
                                            </span>
                                        </div>
                                        <p className="text-text-gray dark:text-gray-300 mb-3">{alert.message}</p>
                                        <div className="text-xs text-text-gray dark:text-gray-500 flex items-center gap-4">
                                            <span>Issued: {new Date(alert.created_at).toLocaleString()}</span>
                                            <span>Type: {alert.alert_type}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alerts;
