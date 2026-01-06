import React, { useState } from "react";
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from "react-router-dom";

const Navbar = ({ alerts = [] }) => {
    const [showAlerts, setShowAlerts] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const activeAlerts = alerts.filter(alert =>
        alert.risk_level === 'CRITICAL' || alert.risk_level === 'HIGH'
    ).slice(0, 5);
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-blue-600">FloodSense</h1>
          <span className="text-sm text-gray-500">Real-time Flood Monitoring</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Alerts Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {showAlerts && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Recent Alerts</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {activeAlerts.length > 0 ? (
                    activeAlerts.map((alert, idx) => (
                      <div key={idx} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900">{alert.location_name}</p>
                            <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            alert.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {alert.risk_level}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-sm">No active alerts</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowAlerts(false);
                      navigate('/alerts');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all alerts →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium">{user?.username || 'Admin'}</span>
              <ChevronDown size={16} />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    );
};

export default Navbar;