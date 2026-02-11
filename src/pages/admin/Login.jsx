import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.username || !credentials.password) {
            setError('Please enter both username and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.login(credentials.username, credentials.password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-soft-white dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors duration-200">
                {/* Header */}
                <div className="bg-primary p-8 text-center flex flex-col items-center">
                    <img src="/logo.png" alt="FloodSense Logo" className="h-16 w-auto mb-4 bg-white rounded-full p-2" />
                    <h1 className="text-3xl font-bold text-white mb-2">FloodSense</h1>
                    <p className="text-blue-100">Admin Control Panel</p>
                </div>

                {/* Login Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-risk-critical p-4 flex items-start gap-3 rounded-r">
                                <AlertCircle className="w-5 h-5 text-risk-critical flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-navy dark:text-gray-200 mb-1">
                                    Username or Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-text-gray dark:text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={credentials.username}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-light-gray dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-dark-navy dark:text-white bg-white dark:bg-slate-700 sm:text-sm placeholder-text-gray dark:placeholder-gray-400 transition-colors"
                                        placeholder="admin@floodsense.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-navy dark:text-gray-200 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-text-gray dark:text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-light-gray dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-dark-navy dark:text-white bg-white dark:bg-slate-700 sm:text-sm placeholder-text-gray dark:placeholder-gray-400 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Authenticating...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-text-gray dark:text-slate-500">
                            Restricted Access • Authorized Personnel Only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
