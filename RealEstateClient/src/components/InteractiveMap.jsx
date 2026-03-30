import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat'; // Import the heatmap plugin

// --- FIX LEAFLET MARKER BUG ---
// React-Leaflet has a known issue where default marker icons lose their paths during the build process.
// This is the Best Practice fix: we manually point Leaflet to the correct image imports.
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41], // Default Leaflet marker size
    iconAnchor: [12, 41] // Anchor the tip of the pin to the coordinate
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- HEATMAP HELPER COMPONENT ---
/**
 * A custom component to bridge leaflet.heat with React-Leaflet.
 * It uses the 'useMap' hook to access the underlying Leaflet map instance,
 * and standard React lifecycle (useEffect) to add/remove the heat layer.
 */
const HeatmapLayer = ({ data }) => {
    const map = useMap();

    useEffect(() => {
        // 1. Prepare the data array format expected by leaflet.heat: [lat, lng, intensity]
        const points = data.map(city => [
            parseFloat(city.lat),
            parseFloat(city.lng),
            city.total_apartments // The more apartments, the "hotter" (redder) the area
        ]);

        // 2. Create the heat layer
        const heatLayer = L.heatLayer(points, {
            radius: 25, // Size of each point
            blur: 15,   // How much the colors blend
            maxZoom: 10,
            max: 2000   // The value representing maximum heat (dark red)
        }).addTo(map);

        // 3. Cleanup function: when component unmounts or data changes, remove the old layer
        return () => {
            map.removeLayer(heatLayer);
        };
    }, [data, map]); // Re-run this effect ONLY if the data or map instance changes

    return null; // This component doesn't render HTML directly, it just manipulates the map DOM
};


// --- MAIN INTERACTIVE MAP COMPONENT ---
/**
 * The main interactive map component.
 * @param {Array} cityData - Array of cities with coordinates: { city, lat, lng, total_apartments, project_count }
 * @param {string} viewMode - 'pins' or 'heatmap'
 * @param {Object} activeLayers - Which layers are currently checked
 */
const InteractiveMap = ({ cityData, viewMode, activeLayers }) => {
    // Coordinates for the center of Israel
    const israelCenter = [31.5, 34.8]; 

    // Filter the data based on the checkboxes. 
    // If 'lotteries' is unchecked, we pass an empty array to the map.
    const displayData = activeLayers.lotteries ? cityData : [];

    return (
        // Wrapper div with CSS for responsive sizing and borders
        <div style={{ height: '500px', width: '100%', borderRadius: '0 0 12px 12px', overflow: 'hidden', border: '1px solid #e0e0e0', borderTop: 'none', zIndex: 0 }}>
            <MapContainer 
                center={israelCenter} 
                zoom={7} 
                scrollWheelZoom={false} // UX Tip: Disable scroll zoom to prevent getting "stuck" when scrolling down the page on mobile
                style={{ height: '100%', width: '100%' }}
            >
                {/* The base map tiles (The actual drawing of roads and borders) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* LAYER: PINS */}
                {viewMode === 'pins' && displayData.map((cityObj, index) => {
                    // Safety check: ensure coordinates exist before placing a marker
                    if (!cityObj.lat || !cityObj.lng) return null;

                    return (
                        <Marker key={index} position={[parseFloat(cityObj.lat), parseFloat(cityObj.lng)]}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{cityObj.city}</h3>
                                    <p style={{ margin: '0' }}>פרויקטים: <strong>{cityObj.project_count}</strong></p>
                                    <p style={{ margin: '0' }}>סה״כ דירות: <strong>{cityObj.total_apartments}</strong></p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* LAYER: HEATMAP */}
                {viewMode === 'heatmap' && <HeatmapLayer data={displayData} />}
                
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;