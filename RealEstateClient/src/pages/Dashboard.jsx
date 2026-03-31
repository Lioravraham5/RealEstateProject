// src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';

// 1. Added fetchCityDistribution to our imports
import { fetchLotteries, fetchConstructionStats, fetchCityDistribution } from '../services/apiService';

import { Building2, MapPin, TrendingUp } from 'lucide-react';

import HeaderFilter from '../components/HeaderFilter';
import KpiCard from '../components/KpiCard';
import StatusPieChart from '../components/StatusPieChart';

// 2. Imported our new Map Components
import MapControls from '../components/MapControls';
import InteractiveMap from '../components/InteractiveMap';

import ProjectsGallery from '../components/ProjectsGallery';

const Dashboard = () => {
    // --- 1. State Management ---
    const [lotteries, setLotteries] = useState([]); 
    const [stats, setStats] = useState([]); 
    const [cityData, setCityData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCity, setSelectedCity] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const [mapViewMode, setMapViewMode] = useState('pins'); // 'pins' or 'heatmap'
    const [activeLayers, setActiveLayers] = useState({ 
        lotteries: true, 
        directSales: false 
    });

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            
            // Best Practice: Fetch all 3 endpoints concurrently
            const fetchedLotteries = await fetchLotteries();
            const fetchedStats = await fetchConstructionStats();
            const fetchedCityData = await fetchCityDistribution(); 
            
            setLotteries(fetchedLotteries);
            setStats(fetchedStats);
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

    const filteredLotteries = useMemo(() => {
        return lotteries.filter(lottery => {
            const matchesCity = selectedCity === 'All' || lottery.city === selectedCity;
            const matchesStatus = selectedStatus === 'All' || lottery.status === selectedStatus;
            return matchesCity && matchesStatus;
        });
    }, [lotteries, selectedCity, selectedStatus]);

    const totalProjects = filteredLotteries.length;
    const totalApartments = filteredLotteries.reduce((sum, item) => sum + (item.total_units || 0), 0);
    const activeCitiesCount = new Set(filteredLotteries.map(item => item.city)).size;

    // --- 3. Helper Functions ---
    // Handler for toggling map layers safely
    const handleLayerToggle = (layerName) => {
        setActiveLayers(prevLayers => ({
            ...prevLayers,
            [layerName]: !prevLayers[layerName] // Flips true to false, and false to true
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
                    data={stats} 
                    onStatusClick={(status) => setSelectedStatus(status)} 
                />
                
                {/* --- The Interactive Map & Controls --- */}
                <div style={{ display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                    
                    {/* Map UI Controls (Dumb Component) */}
                    <MapControls 
                        viewMode={mapViewMode}
                        onViewModeChange={setMapViewMode}
                        activeLayers={activeLayers}
                        onLayerChange={handleLayerToggle}
                    />
                    
                    {/* The Actual Map (Smart-ish Component) */}
                    <InteractiveMap 
                        cityData={cityData}
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