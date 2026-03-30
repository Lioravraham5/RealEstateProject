import React from 'react';

/**
 * A reusable Dumb Component for displaying Key Performance Indicators.
 * @param {string} title - The label of the card (e.g., "Total Projects")
 * @param {string|number} value - The actual number to display
 * @param {React.Component} icon - An icon component from lucide-react
 * @param {string} color - Hex color code for the icon background
 */

const KpiCard = ({ title, value, icon, color }) => {
    return (
        <div className="kpi-card">
            <div className="kpi-info">
                <h3>{title}</h3>
                <p>{value}</p>
            </div>
            
            {/* We create a circular background for the icon based on the passed color */}
            <div style={{ 
                backgroundColor: `${color}20`, // Adds 20% opacity to the color for the background
                color: color,
                padding: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center'
            }}>
                {icon}
            </div>
        </div>
    );
};

export default KpiCard;