import React, { useState, useMemo, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { 
    ArrowDownWideNarrow, 
    ArrowUpNarrowWide, 
    Coins, 
    Trophy, 
    Search, 
    ChevronRight, 
    ChevronLeft 
} from 'lucide-react';

/**
 * A smart component that handles the sorting and display of the project cards.
 * @param {Array} projects - The list of projects (already filtered by the top-level Dashboard)
 */
const ProjectsGallery = ({ projects }) => {
    
    // Core States:
    // State to keep track of the current sorting method:'default' | 'price_asc' | 'probability_desc'
    const [sortBy, setSortBy] = useState('default');
    // Holds the current text typed by the user in the search bar
    const [searchQuery, setSearchQuery] = useState('');
    
    // Pagination States:
    // currentPage: Tracks which page the user is currently viewing (Starts at 1)
    const [currentPage, setCurrentPage] = useState(1);
    // itemsPerPage: Tracks how many cards to show per page (Default is 50)
    const [itemsPerPage, setItemsPerPage] = useState(50);

    // Whenever the search query, sortBy, or the original projects array changes, we force the component to return to Page 1. 
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy, projects, itemsPerPage]);

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

    // Calculate the total number of pages needed
    const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

    // Calculate the exact slice of the array we need for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Extract just the items for the current page: .slice() safely returns a shallow copy of a portion of an array
    const paginatedProjects = sortedProjects.slice(startIndex, endIndex);

return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', display: 'inline-block' }}>
                מציאת פרויקטי דירה בהנחה
            </h2>

            {/* --- The Toolbar --- */}
            <div className="projects-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* Search Bar */}
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

                {/* Toolbar Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    
                    {/* Items Per Page Selector & Counter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#7f8c8d', fontWeight: '500' }}>
                            מציג {sortedProjects.length} פרויקטים
                        </span>
                        <select 
                            value={itemsPerPage} 
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #dcdde1', color: '#2f3640', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value={10}>10 בעמוד</option>
                            <option value={25}>25 בעמוד</option>
                            <option value={50}>50 בעמוד</option>
                            <option value={100}>100 בעמוד</option>
                        </select>
                    </div>

                    {/* Sorting Buttons */}
                    <div className="sort-group">
                        <span style={{ fontSize: '0.9rem', color: '#bdc3c7' }}>מיין לפי:</span>
                        <button className={`sort-btn ${sortBy === 'probability_desc' ? 'active' : ''}`} onClick={() => setSortBy('probability_desc')}>
                            <Trophy size={16} /> סיכוי זכייה {sortBy === 'probability_desc' && <ArrowDownWideNarrow size={16} />}
                        </button>
                        <button className={`sort-btn ${sortBy === 'price_asc' ? 'active' : ''}`} onClick={() => setSortBy('price_asc')}>
                            <Coins size={16} /> מחיר למ"ר {sortBy === 'price_asc' && <ArrowUpNarrowWide size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- The Cards Grid --- */}
            {paginatedProjects.length > 0 ? (
                <>
                    <div className="projects-grid">
                        {paginatedProjects.map((project) => (
                            <ProjectCard key={project.lottery_id} project={project} />
                        ))}
                    </div>

                    {/* --- STEP 4: Pagination Navigation Bar --- */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px', paddingBottom: '40px' }}>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 15px', borderRadius: '8px', border: '1px solid #dcdde1', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, fontWeight: '600', color: '#2f3640' }}
                            >
                                <ChevronRight size={20} /> קודם
                            </button>

                            <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                                עמוד {currentPage} מתוך {totalPages}
                            </span>

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 15px', borderRadius: '8px', border: '1px solid #dcdde1', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, fontWeight: '600', color: '#2f3640' }}
                            >
                                הבא <ChevronLeft size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px', color: '#7f8c8d', border: '1px dashed #bdc3c7' }}>
                    <Search size={48} color="#bdc3c7" style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <h3>לא נמצאו תוצאות</h3>
                    <p>נסה לחפש לפי עיר אחרת או לנקות את המיונים.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectsGallery;