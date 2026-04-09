// src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';

// 1. API Imports
import { fetchLotteries, fetchCityDistribution } from '../services/apiService';

import { Building2, MapPin, TrendingUp } from 'lucide-react';

import HeaderFilter from '../components/HeaderFilter';
import KpiCard from '../components/KpiCard';
import StatusPieChart from '../components/StatusPieChart';

// 2. Map Components
import MapControls from '../components/MapControls';
import InteractiveMap from '../components/InteractiveMap';

import ProjectsGallery from '../components/ProjectsGallery';

const Dashboard = () => {
    // --- 1. State Management ---
    const [lotteries, setLotteries] = useState([]); 
    // We use this state ONLY as a dictionary to hold city coordinates
    const [cityData, setCityData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [selectedCity, setSelectedCity] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedDateFilter, setSelectedDateFilter] = useState('All');

    // Map States
    const [mapViewMode, setMapViewMode] = useState('pins'); // 'pins' or 'heatmap'
    const [activeLayers, setActiveLayers] = useState({ 
        lotteries: true, 
        directSales: false 
    });

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            
            // Best Practice: Fetch all required endpoints concurrently
            const fetchedLotteries = await fetchLotteries();
            const fetchedCityData = await fetchCityDistribution(); 
            
            setLotteries(fetchedLotteries);
            // Save the raw city data to use as our coordinates dictionary
            setCityData(fetchedCityData); 
            
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    // --- 2. Derived State (Calculations) ---
    const uniqueCities = useMemo(() => {
        const cities = lotteries.map(item => item.city).filter(Boolean);
        return [...new Set(cities)].sort();
    }, [lotteries]);

    // The "Brain" of the Dashboard. Now handles City, Status, AND Dates.
    const filteredLotteries = useMemo(() => {
        // Best Practice: Get "today" once outside the loop for better performance
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        return lotteries.filter(lottery => {
            // 1. City Check
            const matchesCity = selectedCity === 'All' || lottery.city === selectedCity;
            
            // 2. Status Check
            const matchesStatus = selectedStatus === 'All' || lottery.status === selectedStatus;
            
            // 3. Date Check
            let matchesDate = true; 
            
            if (selectedDateFilter !== 'All') {
                if (!lottery.signup_end_date) {
                    matchesDate = (selectedDateFilter === 'Open'); 
                } else {
                    const endDate = new Date(lottery.signup_end_date);
                    
                    if (selectedDateFilter === 'Open') {
                        matchesDate = endDate >= today;
                    } else if (selectedDateFilter === 'Closed') {
                        matchesDate = endDate < today;
                    }
                }
            }

            // A project must pass ALL three filters to be displayed
            return matchesCity && matchesStatus && matchesDate;
        });
    }, [lotteries, selectedCity, selectedStatus, selectedDateFilter]);

    const totalProjects = filteredLotteries.length;
    const totalApartments = filteredLotteries.reduce((sum, item) => sum + (item.total_units || 0), 0);
    const activeCitiesCount = new Set(filteredLotteries.map(item => item.city)).size;

    // Chart Aggregation
    const dynamicStats = useMemo(() => {
        const counts = {};
        filteredLotteries.forEach(lottery => {
            const status = lottery.status || 'לא ידוע';
            counts[status] = (counts[status] || 0) + 1;
        });
        return Object.entries(counts).map(([statusName, statusCount]) => ({
            status: statusName,
            count: statusCount
        }));
    }, [filteredLotteries]);

    // Dynamic Map Data Aggregation
    const dynamicCityData = useMemo(() => {
        const cityGroups = {};

        // 1. Group the FILTERED lotteries by city
        filteredLotteries.forEach(lottery => {
            const city = lottery.city;
            if (!city) return;

            if (!cityGroups[city]) {
                cityGroups[city] = {
                    city: city,
                    project_count: 0,
                    total_apartments: 0,
                    lat: null, 
                    lng: null
                };
            }

            // Add up the projects and apartments
            cityGroups[city].project_count += 1;
            cityGroups[city].total_apartments += (lottery.total_units || 0);
        });

        // 2. Map coordinates from our cityData state (the dictionary)
        return Object.values(cityGroups).map(group => {
            const dictEntry = cityData.find(d => d.city === group.city);
            
            if (dictEntry) {
                group.lat = dictEntry.lat;
                group.lng = dictEntry.lng;
            }
            return group;
        });
    }, [filteredLotteries, cityData]);

    // --- 3. Helper Functions ---
    const handleLayerToggle = (layerName) => {
        setActiveLayers(prevLayers => ({
            ...prevLayers,
            [layerName]: !prevLayers[layerName] 
        }));
    };

    // --- 4. Render UI ---
    if (isLoading) {
        return <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.5rem', color: '#3498db' }}>טוען נתונים חיים ממשרד הבינוי והשיכון... ⏳</div>;
    }

    return (
        <div>
            {/* 1. The Global Header & Filter */}
            <HeaderFilter 
                cities={uniqueCities} 
                selectedCity={selectedCity} 
                onCityChange={(city) => setSelectedCity(city)}
                selectedDateFilter={selectedDateFilter}
                onDateFilterChange={(filterValue) => setSelectedDateFilter(filterValue)} 
            />

            {selectedStatus !== 'All' && (
                <div style={{ marginBottom: '20px', padding: '15px', background: '#e1f5fe', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>הנתונים מסוננים כעת לפי סטטוס: <strong>{selectedStatus}</strong></span>
                    <button 
                        onClick={() => setSelectedStatus('All')} 
                        style={{ background: '#0288d1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        נקה סינון ✖
                    </button>
                </div>
            )}

            {/* 2. The KPI Cards Grid */}
            <div className="kpi-grid">
                <KpiCard title="סה״כ פרויקטים" value={totalProjects} icon={<Building2 size={32} />} color="#3498db" />
                <KpiCard title="סה״כ יחידות דיור מוגרלות" value={totalApartments.toLocaleString()} icon={<TrendingUp size={32} />} color="#2ecc71" />
                <KpiCard title="ערים משתתפות" value={activeCitiesCount} icon={<MapPin size={32} />} color="#9b59b6" />
            </div>

            {/* 3. The Charts & Map Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                
                {/* The Interactive Pie Chart */}
                <StatusPieChart 
                    data={dynamicStats} 
                    onStatusClick={(status) => setSelectedStatus(status)} 
                />
                
                {/* --- The Interactive Map & Controls --- */}
                <div style={{ display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                    
                    <MapControls 
                        viewMode={mapViewMode}
                        onViewModeChange={setMapViewMode}
                        activeLayers={activeLayers}
                        onLayerChange={handleLayerToggle}
                    />
                    
                    <InteractiveMap 
                        cityData={dynamicCityData}
                        viewMode={mapViewMode}
                        activeLayers={activeLayers}
                    />

                </div>
            </div>

            {/* 4. The Projects Gallery cards */}
            <ProjectsGallery projects={filteredLotteries} />
        </div>
    );
};

export default Dashboard;