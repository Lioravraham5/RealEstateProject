import React from 'react';

// Optional: Import icons if you want to make the dropdowns look fancier
// import { MapPin, CalendarDays } from 'lucide-react';

/**
 * Header component containing global filters (City and Registration Date).
 * @param {Array} cities - List of unique city names to populate the dropdown
 * @param {string} selectedCity - The currently selected city
 * @param {Function} onCityChange - Callback function triggered when a new city is selected
 * @param {string} selectedDateFilter - The currently selected date filter ('All', 'Open', 'Closed')
 * @param {Function} onDateFilterChange - Callback function triggered when date filter changes
 */
const HeaderFilter = ({ 
    cities, 
    selectedCity, 
    onCityChange, 
    selectedDateFilter, 
    onDateFilterChange 
}) => {
    return (
        <div className="header-filter" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid #eee',
            marginBottom: '30px'
        }}>
            
            <h2 style={{ margin: 0, color: '#2c3e50' }}>סקירת הגרלות דירה בהנחה</h2>
            
            {/* The Filters Container */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                
                {/* 1. City Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>סנן לפי עיר:</label>
                    <select 
                        className="filter-select"
                        value={selectedCity} 
                        onChange={(e) => onCityChange(e.target.value)} 
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #dcdde1', outline: 'none', cursor: 'pointer', minWidth: '150px' }}
                    >
                        <option value="All">כל הארץ</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                {/* 2. Registration Date Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>סטטוס הרשמה:</label>
                    <select 
                        className="filter-select"
                        value={selectedDateFilter} 
                        onChange={(e) => onDateFilterChange(e.target.value)} 
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #dcdde1', outline: 'none', cursor: 'pointer', minWidth: '180px' }}
                    >
                        <option value="All">כל התאריכים</option>
                        <option value="Open">ההרשמה פתוחה (או טרם פורסם)</option>
                        <option value="Closed">ההרשמה נסגרה</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default HeaderFilter;