import React from 'react';

/**
 * Header component containing the global city filter.
 * @param {Array} cities - List of unique city names to populate the dropdown
 * @param {string} selectedCity - The currently selected city
 * @param {Function} onCityChange - Callback function triggered when a new city is selected
 */
const HeaderFilter = ({ cities, selectedCity, onCityChange }) => {
    return (
        <div className="header-filter">
            <h2>מבט על - שוק הנדל"ן בהגרלות</h2>
            
            {/* Dropdown for selecting a city */}
            <select 
                className="filter-select"
                value={selectedCity} 
                onChange={(e) => onCityChange(e.target.value)} // Report back to the Dashboard (Lifting State Up)
            >
                <option value="All">כל הארץ</option>
                {/* Dynamically create an option for every city in the array */}
                {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                ))}
            </select>
        </div>
    );
};

export default HeaderFilter;