import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MapPin,
    Bell,
    FileText,
    LogOut,
    Menu,
    X,
    CloudRain,
    ShieldAlert,
    Users
} from 'lucide-react';
import { authService } from '../services/authService';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/locations', icon: MapPin, label: 'Locations' },
        { path: '/admin/alerts', icon: Bell, label: 'Alerts' },
        { path: '/admin/subscriptions', icon: Users, label: 'Subscribers' },
        { path: '/admin/logs', icon: FileText, label: 'System Logs' },
    ];

    return (
        <div className="min-h-screen bg-soft-white dark:bg-slate-900 flex transition-colors duration-200">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:inset-auto`}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-light-gray dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="FloodSense Logo" className="h-8 w-auto" />
                            <span className="text-xl font-bold text-primary">FloodSense</span>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-1 rounded-md text-text-gray hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-dark-navy dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                        }`
                                    }
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary dark:text-blue-400' : 'text-text-gray dark:text-gray-400'}`} />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-light-gray dark:border-slate-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="bg-white dark:bg-slate-800 shadow-sm lg:hidden h-16 flex items-center px-4 justify-between border-b border-light-gray dark:border-slate-700">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-md text-text-gray hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-bold text-primary">Admin Panel</span>
                    <div className="w-10" /> {/* Spacer for centering */}
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
