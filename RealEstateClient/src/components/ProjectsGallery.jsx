import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Coins, Trophy, Search } from 'lucide-react';

/**
 * A smart component that handles the sorting and display of the project cards.
 * @param {Array} projects - The list of projects (already filtered by the top-level Dashboard)
 */
const ProjectsGallery = ({ projects }) => {
    // State to keep track of the current sorting method:'default' | 'price_asc' | 'probability_desc'
    const [sortBy, setSortBy] = useState('default');

    // Holds the current text typed by the user in the search bar
    const [searchQuery, setSearchQuery] = useState('');

// Best Practice: useMemo ensures we only re-calculate when data, sort, or search changes.
    const sortedProjects = useMemo(() => {
        
        // First, we filter the projects based on the search query
        const filteredBySearch = projects.filter(project => {
            // If the search bar is empty, keep all projects
            if (!searchQuery.trim()) return true;
            
            // Convert query to lowercase for case-insensitive matching
            const query = searchQuery.toLowerCase().trim();
            
            // Safely extract values, defaulting to empty strings if null
            const city = (project.city || '').toLowerCase();
            const provider = (project.provider_name || '').toLowerCase();
            const lotteryId = (project.lottery_id || '').toString();

            // Return true if the query exists in ANY of the three fields (Omni-Search)
            return city.includes(query) || provider.includes(query) || lotteryId.includes(query);
        });

        // Next, we sort the FILTERED array
        switch (sortBy) {
            case 'price_asc':
                return filteredBySearch.sort((a, b) => {
                    const priceA = a.price_per_meter || Infinity; 
                    const priceB = b.price_per_meter || Infinity;
                    return priceA - priceB;
                });
            
            case 'probability_desc':
                return filteredBySearch.sort((a, b) => {
                    const probA = parseFloat(a.win_probability) || 0; 
                    const probB = parseFloat(b.win_probability) || 0;
                    return probB - probA; 
                });
            
            default:
                return filteredBySearch;
        }
    }, [projects, sortBy, searchQuery]); 

return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', display: 'inline-block' }}>
                מציאת פרויקטי דירה בהנחה
            </h2>

            {/* --- The Toolbar --- */}
            <div className="projects-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* A modern, full-width search bar with an icon */}
                <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box', alignItems: 'center', background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 15px' }}>
                    <Search size={20} color="#7f8c8d" style={{ marginLeft: '10px' }} />
                    <input 
                        type="text" 
                        placeholder="חיפוש לפי עיר, קבלן או מספר הגרלה..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1rem', color: '#2c3e50' }}
                    />
                </div>

                {/* Sort controls and results counter */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ color: '#7f8c8d', fontWeight: '500' }}>
                        מציג {sortedProjects.length} פרויקטים
                    </span>

                    <div className="sort-group">
                        <span style={{ fontSize: '0.9rem', color: '#bdc3c7' }}>מיין לפי:</span>
                        
                        <button 
                            className={`sort-btn ${sortBy === 'probability_desc' ? 'active' : ''}`}
                            onClick={() => setSortBy('probability_desc')}
                        >
                            <Trophy size={16} />
                            סיכוי זכייה
                            {sortBy === 'probability_desc' && <ArrowDownWideNarrow size={16} />}
                        </button>

                        <button 
                            className={`sort-btn ${sortBy === 'price_asc' ? 'active' : ''}`}
                            onClick={() => setSortBy('price_asc')}
                        >
                            <Coins size={16} />
                            מחיר למ"ר
                            {sortBy === 'price_asc' && <ArrowUpNarrowWide size={16} />}
                        </button>
                        
                        {sortBy !== 'default' && (
                            <button 
                                onClick={() => setSortBy('default')}
                                style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
                            >
                                נקה מיון
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- The Cards Grid --- */}
            {sortedProjects.length > 0 ? (
                <div className="projects-grid">
                    {sortedProjects.map((project) => (
                        <ProjectCard key={project.lottery_id} project={project} />
                    ))}
                </div>
            ) : (
                // Empty State (Handled automatically if search yields no results) 
                <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px', color: '#7f8c8d', border: '1px dashed #bdc3c7' }}>
                    <Search size={48} color="#bdc3c7" style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <h3>לא נמצאו תוצאות</h3>
                    <p>לא מצאנו פרויקטים התואמים לחיפוש או לסינון המבוקש. נסה לחפש מילה אחרת.</p>
                </div>
            )}

        </div>
    );
};

export default ProjectsGallery;