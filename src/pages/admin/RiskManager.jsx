import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../../services/api';

const RiskManager = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        location: '',
        riskLevel: 'LOW',
        factors: '',
        description: ''
    });

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get('/locations');
                setLocations(res.data.data || []);
            } catch (err) {
                console.error('Failed to load locations', err);
            }
        };
        fetchLocations();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Map risk level to default score
        // Map risk level to default score (0-15 scale)
        const riskScores = {
            'LOW': 1,
            'MODERATE': 4,
            'HIGH': 7,
            'CRITICAL': 12
        };

        const payload = {
            location_id: formData.location,
            risk_level: formData.riskLevel,
            risk_score: riskScores[formData.riskLevel] || 1,
            factors: formData.factors ? formData.factors.split(',').map(f => f.trim()) : [],
            rainfall_24h: 0, // Defaulting as this form is for manual override/assessment
            rainfall_72h: 0
        };

        try {
            await api.post('/risk', payload);
            alert('Risk assessment created successfully');
            setFormData({ location: '', riskLevel: 'LOW', factors: '', description: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to create risk assessment: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-dark-navy dark:text-white">Manual Risk Assessment</h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-light-gray dark:border-slate-700 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-2">Location</label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="">Select Location</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-2">Risk Level</label>
                        <select
                            name="riskLevel"
                            value={formData.riskLevel}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="LOW">Low</option>
                            <option value="MODERATE">Moderate</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-2">Contributing Factors (comma separated)</label>
                        <input
                            type="text"
                            name="factors"
                            placeholder="e.g. Heavy Rainfall, River Overflow"
                            value={formData.factors}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-2">Description / Notes</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Submitting...' : 'Submit Risk Assessment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RiskManager;
