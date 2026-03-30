import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Coins, Trophy } from 'lucide-react';

/**
 * A smart component that handles the sorting and display of the project cards.
 * @param {Array} projects - The list of projects (already filtered by the top-level Dashboard)
 */
const ProjectsGallery = ({ projects }) => {
    // State to keep track of the current sorting method
    // 'default' | 'price_asc' | 'probability_desc'
    const [sortBy, setSortBy] = useState('default');

    // Best Practice: useMemo ensures we only re-sort the array when the 'projects' data or 'sortBy' choice changes.
    const sortedProjects = useMemo(() => {
        // We create a shallow copy of the array using [...projects] because .sort() mutates the original array in JS
        const projectsCopy = [...projects];

        switch (sortBy) {
            case 'price_asc':
                // Sort by price per meter (lowest to highest)
                return projectsCopy.sort((a, b) => {
                    const priceA = a.price_per_meter || Infinity; // Push nulls to the bottom
                    const priceB = b.price_per_meter || Infinity;
                    return priceA - priceB;
                });
            
            case 'probability_desc':
                // Sort by winning probability (highest to lowest)
                return projectsCopy.sort((a, b) => {
                    const probA = parseFloat(a.win_probability) || 0; // Treat nulls as 0%
                    const probB = parseFloat(b.win_probability) || 0;
                    return probB - probA; // b - a for descending order
                });
            
            default:
                // Default order (usually the order they came from the DB, e.g., by lottery_id)
                return projectsCopy;
        }
    }, [projects, sortBy]);

    return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', display: 'inline-block' }}>
                גלריית פרויקטים והרשמה
            </h2>

            {/* --- The Toolbar --- */}
            <div className="projects-toolbar">
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
                        סיכוי זכייה עליון
                        {sortBy === 'probability_desc' && <ArrowDownWideNarrow size={16} />}
                    </button>

                    <button 
                        className={`sort-btn ${sortBy === 'price_asc' ? 'active' : ''}`}
                        onClick={() => setSortBy('price_asc')}
                    >
                        <Coins size={16} />
                        מחיר למ"ר (מהזול ליקר)
                        {sortBy === 'price_asc' && <ArrowUpNarrowWide size={16} />}
                    </button>
                    
                    {/* Clear sort button, only shows if a sort is active */}
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

            {/* --- The Cards Grid --- */}
            {sortedProjects.length > 0 ? (
                <div className="projects-grid">
                    {/* Map through the sorted array and render a ProjectCard for each one */}
                    {sortedProjects.map((project) => (
                        <ProjectCard key={project.lottery_id} project={project} />
                    ))}
                </div>
            ) : (
                // Empty state if filters result in 0 projects
                <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px', color: '#7f8c8d' }}>
                    לא נמצאו פרויקטים התואמים לסינון המבוקש.
                </div>
            )}

        </div>
    );
};

export default ProjectsGallery;