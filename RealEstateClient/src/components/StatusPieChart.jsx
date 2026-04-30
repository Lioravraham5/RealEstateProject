import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8e44ad', '#e74c3c'];

/**
 * A responsive Pie Chart displaying the construction status of projects.
 * @param {Array} data - Array of objects: { status: string, count: number }
 * @param {Function} onStatusClick - Callback when a pie slice or legend item is clicked
 */
const StatusPieChart = ({ data, onStatusClick }) => {
    
    // We map over the data and inject the correct color into each object under the 'fill' property
    const coloredData = data.map((entry, index) => ({
        ...entry,
        fill: COLORS[index % COLORS.length]
    }));

    // --- UX IMPROVEMENT: Legend Click Handler ---
    // Recharts passes a different event object for Legend clicks vs Pie clicks.
    // The status name is located under 'entry.value' in the Legend event.
    const handleLegendClick = (entry) => {
        if (entry && entry.value) {
            onStatusClick(entry.value);
        }
    };

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', height: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>התפלגות פרויקטים לפי סטטוס</h3>
            
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={coloredData} 
                        dataKey="count" 
                        nameKey="status" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={100}
                        // 1. UX FIX: Removed the 'label' prop to hide the ugly external numbers. 
                        // Users will now rely on the clean hover Tooltip.
                        onClick={(entry) => onStatusClick(entry.status)} 
                        style={{ cursor: 'pointer' }}
                    />
                    <Tooltip />
                    
                    {/* 2. UX FIX: Made the Legend clickable. 
                        Now users can click the large, readable text instead of hunting for tiny pie slices! */}
                    <Legend 
                        onClick={handleLegendClick} 
                        wrapperStyle={{ cursor: 'pointer' }} // Adds the "hand" cursor to the whole legend area
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatusPieChart;