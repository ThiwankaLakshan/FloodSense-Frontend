import React from 'react';
import { MapPin, AlertTriangle, Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';

const SummaryCards = ({ stats, loading }) => {
    const cards = [
        {
            label: 'Monitored Locations',
            value: stats.totalLocations,
            icon: MapPin,
            color: 'text-[#0B5ED7]',
            bg: 'bg-[#0B5ED7]/10',
        },
        {
            label: 'Active Flood Alerts',
            value: stats.activeAlerts,
            icon: AlertTriangle,
            color: 'text-[#EF4444]',
            bg: 'bg-[#EF4444]/10',
        },
        {
            label: 'Highest Risk Level',
            value: stats.highestRisk,
            icon: Activity,
            color: stats.highestRisk === 'Critical' ? 'text-[#EF4444]' :
                stats.highestRisk === 'High' ? 'text-[#F97316]' :
                    stats.highestRisk === 'Moderate' ? 'text-[#FACC15]' : 'text-[#22C55E]',
            bg: stats.highestRisk === 'Critical' ? 'bg-[#EF4444]/10' :
                stats.highestRisk === 'High' ? 'bg-[#F97316]/10' :
                    stats.highestRisk === 'Moderate' ? 'bg-[#FACC15]/10' : 'bg-[#22C55E]/10',
        },
        {
            label: 'Last Updated',
            value: stats.lastUpdated ? format(new Date(stats.lastUpdated), 'p') : 'N/A',
            icon: Clock,
            color: 'text-[#64748B]',
            bg: 'bg-[#E2E8F0]',
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-xl bg-light-gray animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-light-gray transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-gray mb-1">{card.label}</p>
                            <h3 className={`text-2xl font-bold ${typeof card.value === 'string' && card.label === 'Highest Risk Level' ? card.color : 'text-dark-navy'}`}>
                                {card.value}
                            </h3>
                        </div>
                        <div className={`p-3 rounded-full ${card.bg}`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
