import React, { createContext, useState, useEffect, useContext, children} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser && authService.getToken()) {
                const verified = await authService.verifyToken();
                if (verified) {
                    setUser(currentUser);
                } else {
                    authService.logout();
                }
            }
        } catch (error) {
            console.error('Auth check failed:',error);
            authService.logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const data = await authService.login(username, password);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);


};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};