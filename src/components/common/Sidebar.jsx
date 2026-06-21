import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    MapPin,
    Bell,
    AlertTriangle,
    FileText
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        {
            name: 'Dashboard',
            path: '/',
            icon: LayoutDashboard
        },
        {
            name: 'Data Monitoring',
            path: '/monitoring',
            icon: MapPin
        },
        {
            name: 'Alerts',
            path: '/alerts',
            icon: Bell
        },
        {
            name: 'Risk Assessment',
            path: '/risk',
            icon: AlertTriangle
        },
        {
            name: 'Logs',
            path: '/logs',
            icon: FileText
        }
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">FloodSense</h2>
            <p className="text-xs text-gray-500">Western Province</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-900 mb-1">System Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-700">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
    );
};

export default Sidebar;