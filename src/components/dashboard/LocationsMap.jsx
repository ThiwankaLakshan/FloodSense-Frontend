import React, { useEffect, useRef } from "react";
import L, { marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRiskColor } from "../../utils/helpers";

const LocationsMap = ({ locations, onLocationClick }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapRef.current) return;

        //initialize map
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([6.9271, 79.8612], 10);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance.current);
        }

        //clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        //add markers for each location
        if (locations && locations.length > 0) {
            locations.forEach(location => {
                const color = getRiskColor(location.risk_level || 'LOW');

                const icon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="
                    background-color: ${color};
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow 0 2px 4px rgbs(0,0,0,0.3);
                    "></div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                const marker = L.marker([location.latitude, location.longitude], { icon })
                .addTo(mapInstance.current)
                .bindPopup(`
                    <div class="p-2">
                    <h3 class="font-bold">${location.name}</h3>
                    <p class="text-sm text-gray-600">${location.district}</p>
                    <p class="text-sm mt-1">Risk: <span class="font-semibold" style="color: ${color}">${location.risk_level || 'N/A'}</span></p>
                    </div>
                    `);

                if (onLocationClick) {
                    marker.on('click', () => onLocationClick(location));
                }

                markersRef.current.push(marker);
            });

            //fit bounds to show all markers
            if (markersRef.current.length > 0) {
                const group = L.featureGroup(markersRef.current);
                mapInstance.current.fitBounds(group.getBounds().pad(0.1));
            }
        }

        return () => {
            markersRef.current.forEach(marker => marker.remove());
        };
    }, [locations,onLocationClick]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Location Map</h3>
        <p className="text-sm text-gray-600">Real-time flood risk monitoring</p>
      </div>
      <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
    </div>
    );
};

export default LocationsMap;