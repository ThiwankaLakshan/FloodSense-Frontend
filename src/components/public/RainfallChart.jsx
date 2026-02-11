import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const RainfallChart = ({ data, locationName, loading }) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-[400px] animate-pulse">
                <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
                <div className="h-full bg-slate-50 dark:bg-slate-800/50 rounded" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-[400px] flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">No rainfall data available for trend analysis.</p>
            </div>
        );
    }

    // Process data for chart
    const formattedData = data.slice().reverse().map(item => ({
        ...item,
        time: format(parseISO(item.timestamp), 'MMM d, HH:mm'),
        rainfall: parseFloat(item.rainfall_mm)
    }));

    return (
        <div className="bg-[#FFFFFF] rounded-xl p-6 shadow-sm border border-[#E2E8F0]">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-6">
                Rainfall Trend (Last 7 Days) - <span className="text-[#0B5ED7]">{locationName || 'Selected Location'}</span>
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData}>
                        <defs>
                            <linearGradient id="colorRainfall" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0B5ED7" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0B5ED7" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="time"
                            stroke="#64748B"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#64748B"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft', style: { fill: '#64748B' } }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#1e293b' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="rainfall"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRainfall)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RainfallChart;
