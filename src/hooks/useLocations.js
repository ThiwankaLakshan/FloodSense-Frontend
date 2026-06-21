import { useState,useEffect } from "react";
import locationService from '../services/locationService';
import toast from 'react-hot-toast';
import { RISK_LEVELS } from "../utils/constants";

export const useLocations = (autoFetch = true) => {
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        if (autoFetch) {
            fetchLocations();
        }
    }, [autoFetch]);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await locationService.getAllLocations();
            setLocations(response.data || []);
        } catch (error) {
            console.error('Error fetching location: ',error);
            toast.error('Failed to load location details');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchLocationsById = async (id) => {
        setLoading(false);
        try {
            const response = await locationService.getLocationById(id);
            setSelectedLocation(response.data);
        } catch (error) {
            console.error('Error fetching locations: ',error);
            toast.error('Failed to load location details');
        } finally {
            setLoading(false);
        }
    };

    const fetchLocationsByRisk = async (riskLevel) => {
        setLoading(true);
        try {
            const response = await locationService.getLocationsByRisk(riskLevel);
            setLocations(response.data || []);
        } catch (error) {
            console.error('Error fetching locations by risk: ', error);
            toast.error('Failed to filter locations');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        locations,
        selectedLocation,
        fetchLocations,
        fetchLocationsById,
        fetchLocationsByRisk,
        selectedLocation
    };
};