import React, { useState} from "react";
import { ChevronRight, Search } from "lucide-react";
import { getRiskLevelInfo } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const LocationsTable = ({ locations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('ALL');
    const navigate = useNavigate();

    const filteredLocations = locations.filter(loc => {
        const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            loc.district.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = filterRisk === 'ALL' || loc.risk_level === filterRisk;
        return matchesSearch && matchesRisk;
    });

    const handleRowClick = (location) => {
        navigate(`/monitoring/${location.id}`);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Monitored Locations</h3>
          <span className="text-sm text-gray-600">{filteredLocations.length} locations</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Risks</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => {
                const riskInfo = getRiskLevelInfo(location.risk_level);
                return (
                  <tr
                    key={location.id}
                    onClick={() => handleRowClick(location)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{location.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{location.district}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskInfo.bgColor} ${riskInfo.textColor}`}>
                        {riskInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{location.risk_score || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-blue-600 hover:text-blue-800">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No locations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    );
};

export default LocationsTable;