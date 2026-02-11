import React, { useState, useEffect } from 'react';
import { Trash2, Mail, Phone } from 'lucide-react';
import api from '../../services/api';

const Subscriptions = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const res = await api.get('/subscriptions');
            setSubscribers(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this subscriber?')) return;
        try {
            await api.delete(`/subscriptions/${id}`);
            setSubscribers(prev => prev.filter(sub => sub.id !== id));
        } catch (err) {
            alert('Failed to delete subscriber');
        }
    };

    const handleToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await api.patch(`/subscriptions/${id}/toggle`, { is_active: newStatus });
            // Optimistic update
            setSubscribers(prev => prev.map(sub =>
                sub.id === id ? { ...sub, is_active: newStatus } : sub
            ));
        } catch (err) {
            console.error('Toggle error:', err);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-8 text-center text-text-gray">Loading subscribers...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-dark-navy dark:text-white">Subscriber Management</h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-light-gray dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-soft-white dark:bg-slate-700/50 text-xs uppercase text-text-gray dark:text-gray-400 font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-gray dark:divide-slate-700">
                            {subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                                    <td className="px-6 py-4 text-dark-navy dark:text-white font-medium">{sub.userName || 'Anonymous'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-sm">
                                            {sub.email && <div className="flex items-center gap-2 mb-1"><Mail className="w-3 h-3 text-text-gray" /> {sub.email}</div>}
                                            {sub.phoneNumber && <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-text-gray" /> {sub.phoneNumber}</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-text-gray dark:text-gray-300">{sub.location?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggle(sub.id, sub.is_active)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${sub.is_active ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-600'
                                                }`}
                                        >
                                            <span
                                                className={`${sub.is_active ? 'translate-x-6' : 'translate-x-1'
                                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(sub.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {subscribers.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-text-gray">No subscribers found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
