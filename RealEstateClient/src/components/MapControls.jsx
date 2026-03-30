import React from 'react';
import { MapPin, Flame } from 'lucide-react'; // Using icons for Pins and Heatmap

/**
 * A presentational (dumb) component for the Map Controls.
 * It receives its current state and update functions from the parent (Dashboard).
 * * @param {string} viewMode - The current active map view ('pins' or 'heatmap')
 * @param {Function} onViewModeChange - Callback to change the view mode
 * @param {Object} activeLayers - State of checkboxes: { lotteries: boolean, directSales: boolean }
 * @param {Function} onLayerChange - Callback to toggle a specific layer
 */
const MapControls = ({ viewMode, onViewModeChange, activeLayers, onLayerChange }) => {
    return (
        <div className="map-controls-container">
            
            {/* 1. Toggle Buttons for View Mode (Pins vs. Heatmap) */}
            <div className="toggle-group">
                {/* Pins View Button */}
                <button 
                    className={`toggle-btn ${viewMode === 'pins' ? 'active' : ''}`}
                    onClick={() => onViewModeChange('pins')}
                >
                    <MapPin size={18} />
                    תצוגת מיקומים
                </button>
                
                {/* Heatmap View Button */}
                <button 
                    className={`toggle-btn ${viewMode === 'heatmap' ? 'active' : ''}`}
                    onClick={() => onViewModeChange('heatmap')}
                >
                    <Flame size={18} />
                    מפת חום
                </button>
            </div>

            {/* 2. Checkboxes for Data Layers */}
            <div className="layers-group">
                <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>שכבות מידע:</span>
                
                {/* Checkbox for Lottery data */}
                <label className="layer-checkbox">
                    <input 
                        type="checkbox" 
                        checked={activeLayers.lotteries}
                        onChange={() => onLayerChange('lotteries')}
                    />
                    דירות בהגרלה
                </label>

                {/* Checkbox for Direct Sales (Placeholder for future data) */}
                <label className="layer-checkbox" title="בקרוב: נתונים ממשלתיים יעודכנו">
                    <input 
                        type="checkbox" 
                        checked={activeLayers.directSales}
                        onChange={() => onLayerChange('directSales')}
                        // Uncomment the line below to disable the checkbox entirely until data is ready:
                        // disabled={true} 
                    />
                    <span style={{ color: activeLayers.directSales ? '#34495e' : '#bdc3c7' }}>
                        ללא הגרלה (מכירות ישירות)
                    </span>
                </label>
            </div>

        </div>
    );
};

export default MapControls;