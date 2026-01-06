import React from "react";
import { RefreshCcw } from "lucide-react";
import StatsCards from "./StatsCards";
import LocationsMap from "./LocationsMap";
import LocationsTable from "./LocationsTable";
import { useDashboard } from '../../hooks/useDashboard';

const Dashboard = () => {
    const { loading, summary, locations, refresh } = useDashboard();

    return (
        <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Real-time flood monitoring overview</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <StatsCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LocationsMap locations={locations} />
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="space-y-4">
            {summary?.riskDistribution && Object.entries(summary.riskDistribution).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{level}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        level === 'CRITICAL' ? 'bg-red-600' :
                        level === 'HIGH' ? 'bg-orange-600' :
                        level === 'MODERATE' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min((count / (summary?.totalLocations || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LocationsTable locations={locations} />
    </div>
    );
};

export default Dashboard;