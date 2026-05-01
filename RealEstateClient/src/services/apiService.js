
// This file is responsible for all HTTP communication with our Node.js Backend.

// This allows us to easily switch between local development and production without changing the code.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://realestateproject-my47.onrender.com/api';

/**
 * Fetches the list of lotteries from the backend.
 * Returns an array of lottery objects.
 */
export const fetchLotteries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/lotteries`);
        
        // Check if the server responded with an error status (e.g., 404, 500)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        // Our backend wraps the array inside a "data" property, so we extract it
        return jsonResponse.data; 
    } catch (error) {
        console.error('Error in fetchLotteries:', error);
        return []; // Return an empty array on failure so the UI doesn't crash
    }
};

/**
 * Fetches the construction status statistics for the Pie Chart.
 */
export const fetchConstructionStats = async () => {
    try {
        const response = await fetch(`${BASE_URL}/stats/construction-status`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (error) {
        console.error('Error in fetchConstructionStats:', error);
        return [];
    }
};

/**
 * Fetches the geographic distribution of lotteries (cities with coordinates).
 * This calls our backend endpoint that joins the lotteries table with the city_locations table.
 * @returns {Array} Array of objects containing: { city, project_count, total_apartments, lat, lng }
 */
export const fetchCityDistribution = async () => {
    try {
        const response = await fetch(`${BASE_URL}/stats/cities`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        // Access the 'data' property from our standardized backend response format
        return jsonResponse.data;
    } catch (error) {
        console.error('Error in fetchCityDistribution:', error);
        return []; // Return empty array to prevent map crashes
    }
};