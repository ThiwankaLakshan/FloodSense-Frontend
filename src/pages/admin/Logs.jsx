import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import api from '../../services/api';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Currently using alerts history as system logs
                const res = await api.get('/alerts');
                setLogs(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = filter === 'ALL' ? logs : logs.filter(log => log.riskLevel === filter);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toISOString();
        } catch (e) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-dark-navy dark:text-white">System Logs</h1>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-text-gray" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-light-gray dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-700 text-dark-navy dark:text-white outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="ALL">All Levels</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MODERATE">Moderate</option>
                    </select>
                </div>
            </div>

            <div className="bg-black/90 dark:bg-black rounded-xl p-6 font-mono text-sm h-[600px] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="text-green-500 animate-pulse">Initializing log stream...</div>
                ) : filteredLogs.length === 0 ? (
                    <div className="text-gray-500">No logs available for selected filter.</div>
                ) : (
                    filteredLogs.map((log, index) => (
                        <div key={log._id || index} className="mb-2 border-b border-gray-800 pb-2 last:border-0 hover:bg-white/5 p-1 rounded transition-colors">
                            <span className="text-gray-500">[{formatDate(log.createdAt)}]</span>
                            <span className={`mx-2 font-bold ${log.riskLevel === 'CRITICAL' ? 'text-red-500' :
                                log.riskLevel === 'HIGH' ? 'text-orange-500' :
                                    'text-yellow-500'
                                }`}>{log.riskLevel}</span>
                            <span className="text-blue-400">@{log.location?.name || 'Unknown'}</span>
                            <span className="text-gray-300 mx-2">-</span>
                            <span className="text-green-400">"{log.message}"</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Logs;
