import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bell, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const Alerts = () => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        locationId: '',
    });
    const [locations, setLocations] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get('/locations');
                setLocations(res.data.data);
                if (res.data.data.length > 0) {
                    setFormData(prev => ({ ...prev, locationId: res.data.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch locations", err);
            }
        };
        fetchLocations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await api.post('/subscriptions', {
                email: formData.email,
                phone: formData.phone || undefined,
                location_id: formData.locationId
            });

            setStatus('success');
            setMessage('Successfully subscribed to flood alerts!');
            setFormData({ email: '', phone: '', locationId: locations[0]?.id || '' });
        } catch (err) {
            console.error('Subscription failed:', err);
            setStatus('error');
            setMessage(err.response?.data?.message || err.response?.data?.error || 'Failed to subscribe. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Subscription Form */}
                <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-8 h-fit">
                    <div className="text-center mb-8">
                        <div className="bg-[#0B5ED7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-[#0B5ED7]" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#0F172A]">Get Flood Alerts</h1>
                        <p className="text-[#64748B] mt-2">
                            Subscribe to receive instant notifications via email or SMS when flood risks rise in your area.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-[#22C55E] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Subscribed!</h3>
                            <p className="text-[#64748B]">{message}</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-6 px-4 py-2 bg-[#0B5ED7] text-white rounded hover:bg-opacity-90 font-medium"
                            >
                                Subscribe Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="bg-[#EF4444]/10 text-[#EF4444] p-3 rounded-lg flex items-start gap-2 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>{message}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#64748B] mb-1">
                                    Select Location to Monitor
                                </label>
                                <select
                                    required
                                    value={formData.locationId}
                                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                                    className="block w-full rounded-md border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm focus:border-[#0B5ED7] focus:ring-[#0B5ED7] py-2 px-3"
                                >
                                    <option value="" disabled>Select a location</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name} - {loc.district}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#64748B] mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        className="block w-full rounded-md border-[#E2E8F0] pl-10 bg-white text-[#0F172A] shadow-sm focus:border-[#0B5ED7] focus:ring-[#0B5ED7] py-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#64748B] mb-1">
                                    Phone Number (Optional)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+94 7X XXX XXXX"
                                        className="block w-full rounded-md border-[#E2E8F0] pl-10 bg-white text-[#0F172A] shadow-sm focus:border-[#0B5ED7] focus:ring-[#0B5ED7] py-2"
                                    />
                                </div>
                                <p className="text-xs text-[#64748B] mt-1">For SMS alerts (Sri Lanka numbers preferred)</p>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-[#0B5ED7] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe to Alerts'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Latest Alerts List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Latest Alerts</h2>
                    <LatestAlertsList />
                </div>
            </div>
        </div>
    );
};

const LatestAlertsList = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                // Fetch last 10 alerts regardless of time window
                const res = await api.get('/alerts?limit=10');
                const data = res.data.data || [];
                setAlerts(data);
            } catch (err) {
                console.error("Failed to fetch alerts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    if (loading) return <div className="text-center py-8 text-slate-500">Loading alerts...</div>;
    if (alerts.length === 0) return <div className="text-[#64748B] text-center py-8">No alerts issued recently.</div>;

    return (
        <div className="space-y-4">
            {alerts.map(alert => {
                const getRiskStyles = (level) => {
                    switch (level?.toUpperCase()) {
                        case 'CRITICAL': return { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
                        case 'HIGH': return { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' };
                        case 'MODERATE': return { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' };
                        default: return { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-800' };
                    }
                };
                const styles = getRiskStyles(alert.risk_level);

                return (
                    <div key={alert.id} className={`p-5 rounded-xl border-l-4 shadow-sm bg-white transition-all hover:shadow-md ${styles.border}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
                                    {alert.location_name}
                                    <span className="text-sm font-normal text-slate-500">({alert.district})</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Issued: {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles.badge}`}>
                                {alert.risk_level || 'INFO'}
                            </span>
                        </div>

                        <p className="text-slate-700 mb-4 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {alert.message}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                                Type: {alert.alert_type}
                            </span>
                            <span className={`px-2 py-1 rounded font-medium border ${alert.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                    'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                Status: {alert.status}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Alerts;
