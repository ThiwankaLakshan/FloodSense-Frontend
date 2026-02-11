import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Dashboard', path: '/' },
        { name: 'Location Risk', path: '/risk' },
        { name: 'Alerts', path: '/alerts' },
        { name: 'History', path: '/history' },
    ];

    return (
        <nav className="bg-[#FFFFFF] border-b border-[#E2E8F0] sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center">
                        <NavLink to="/" className="flex-shrink-0 flex items-center gap-2">
                            <img src="/logo.png" alt="FloodSense Logo" className="h-10 w-auto" />
                            <span className="font-bold text-xl text-[#0F172A] tracking-tight">
                                FloodSense
                            </span>
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-gray hover:text-dark-navy hover:bg-soft-white'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="bg-dark-navy hover:bg-opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                        >
                            Admin Login
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-dark-navy hover:bg-soft-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-light-gray animate-in slide-in-from-top-4 duration-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-gray hover:text-dark-navy hover:bg-soft-white'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="pt-4 pb-2 border-t border-light-gray mt-2">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/admin/login');
                                }}
                                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-text-gray hover:text-dark-navy hover:bg-soft-white"
                            >
                                Admin Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
