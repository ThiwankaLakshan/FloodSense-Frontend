import React from "react";
import { MapPin, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { formatTimeAgo } from '../../utils/helpers';

const StatsCards = ({ summary }) => {
    const stats = [
        {
            title: 'Monitored Locations',
            value: summary?.totalLocations || 0,
            icon: MapPin,
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Critical Risk',
            value: summary?.riskDistribution?.CRITICAL || 0,
            icon: AlertTriangle,
            color: 'red',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600'
        },
        {
            title: 'High Risk',
            value: summary?.riskDistribution?.HIGH || 0,
            icon: TrendingUp,
            color: 'orange',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        },
        {
            title: 'Last Update',
            value: summary?.lastUpdate ? formatTimeAgo(summary.lastUpdate) : 'N/A',
            icon: Clock,
            color: 'grey',
            bgColor: 'bg-grey-50',
            iconColor: 'text-grey-600',
            isText: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={stat.iconColor} size={24} />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
          <p className={`text-3xl font-bold ${stat.isText ? 'text-base' : ''}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
    );
};

export default StatsCards;