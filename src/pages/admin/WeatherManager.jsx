import React, { useState, useEffect } from 'react';
import { CloudRain, Thermometer, Wind, Save } from 'lucide-react';
import api from '../../services/api';

const WeatherManager = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        locationId: '',
        rainfall: '',
        temperature: '',
        humidity: '',
        windSpeed: ''
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
        try {
            await api.post('/weather', {
                location: formData.locationId,
                rainfall: parseFloat(formData.rainfall),
                temperature: parseFloat(formData.temperature),
                humidity: parseFloat(formData.humidity),
                windSpeed: parseFloat(formData.windSpeed),
                timestamp: new Date()
            });
            alert('Weather data submitted successfully');
            setFormData({ locationId: '', rainfall: '', temperature: '', humidity: '', windSpeed: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to submit weather data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-dark-navy dark:text-white">Manual Weather Entry</h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-light-gray dark:border-slate-700 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-2">Location</label>
                        <select
                            name="locationId"
                            value={formData.locationId}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-2">
                                <CloudRain className="w-4 h-4 inline mr-2" />
                                Rainfall (mm)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="rainfall"
                                value={formData.rainfall}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-2">
                                <Thermometer className="w-4 h-4 inline mr-2" />
                                Temperature (°C)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-2">Humidity (%)</label>
                            <input
                                type="number"
                                name="humidity"
                                value={formData.humidity}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-navy dark:text-gray-300 mb-2">
                                <Wind className="w-4 h-4 inline mr-2" />
                                Wind Speed (km/h)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="windSpeed"
                                value={formData.windSpeed}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-light-gray dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-navy dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save Weather Data'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WeatherManager;
