import { useState,useEffect } from "react";
import dashboardService from '../services/dashboardService';
import locationService from "../services/locationService";
import toast from "react-hot-toast";

export const useDashboard = () => {
    const [loading,setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [locations, setLocations] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [summaryData, locationsData, alertsData] = await Promise.all([
                dashboardService.getSummary(),
                locationService.getAllLocations(),
                dashboardService.getActiveAlerts(10)
            ]);

            setSummary(summaryData.data);
            setLocations(locationsData.data || []);
            setAlerts(alertsData.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data: ',error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        setLoading(true);
        fetchDashboardData();
    };

    return {
        loading,
        summary,
        locations,
        alerts,
        refresh
    };
};