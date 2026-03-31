import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8e44ad', '#e74c3c'];

/**
 * A responsive Pie Chart displaying the construction status of projects.
 * @param {Array} data - Array of objects: { status: string, count: number }
 * @param {Function} onStatusClick - Callback when a pie slice is clicked
 */
const StatusPieChart = ({ data, onStatusClick }) => {
    
    // Best Practice: Prepare the data before rendering
    // We map over the data and inject the correct color into each object under the 'fill' property
    const coloredData = data.map((entry, index) => ({
        ...entry,
        fill: COLORS[index % COLORS.length]
    }));

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', height: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>התפלגות פרויקטים לפי סטטוס</h3>
            
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={coloredData} // Using our new array with injected colors
                        dataKey="count" 
                        nameKey="status" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={100}
                        label
                        onClick={(entry) => onStatusClick(entry.status)} 
                        style={{ cursor: 'pointer' }}
                    />
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatusPieChart;