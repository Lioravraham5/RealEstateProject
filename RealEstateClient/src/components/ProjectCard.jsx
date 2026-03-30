import React from 'react';

// Importing icons to make the card look premium and easy to scan
import { MapPin, Building, Coins, Home, Trophy } from 'lucide-react';

/**
 * A presentational (dumb) component that renders a single project as a card.
 * @param {Object} project - The data object containing project details from the DB.
 */
const ProjectCard = ({ project }) => {

    // --- Helper Function: Dynamic Status Badge Color ---
    // This function returns the correct CSS class name based on the exact Hebrew status from the DB
    const getStatusClass = (status) => {
        if (!status) return 'status-default';

        // Exact matching based on the defined database values
        switch (status) {
            case 'בתהליכי הגרלה':
                return 'status-open';     // Green (Active and relevant)
            case 'בחירת דירות':
                return 'status-future';   // Blue (Moving forward)
            case 'בקרת חוזים':
                return 'status-closed';   // Orange (Administrative/Closed to new users)
            case 'בקרה לאחר איכלוס':
                return 'status-default';  // Gray (Historical/Completed)
            default:
                return 'status-default';
        }
    };

    // --- Helper Function: Format Numbers ---
    // Adds commas to thousands (e.g., 15000 -> 15,000) or returns a default text if null
    const formatNumber = (num) => {
        return num ? num.toLocaleString() : 'לא צוין';
    };

    return (
        <div className="project-card">

            {/* Header: City, Project Number, and Status Badge */}
            <div className="card-header">
                <div className="card-title">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={18} color="#e74c3c" />
                        {project.city}
                    </h3>
                    <p>פרויקט מס' {project.lottery_id || '---'}</p>
                </div>

                {/* Dynamically assign the CSS class for the background color */}
                <span className={`status-badge ${getStatusClass(project.status)}`}>
                    {project.status || 'סטטוס לא ידוע'}
                </span>
            </div>

            {/* Body Rows: Key project details with icons */}
            <div className="card-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7f8c8d' }}>
                    <Building size={16} /> קבלן:
                </span>
                <strong>{project.provider_name || 'טרם נקבע'}</strong>
            </div>

            <div className="card-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7f8c8d' }}>
                    <Home size={16} /> סה"כ דירות:
                </span>
                <strong>{formatNumber(project.total_units)}</strong>
            </div>

            <div className="card-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7f8c8d' }}>
                    <Coins size={16} /> מחיר למ"ר:
                </span>
                <strong>₪{formatNumber(project.price_per_meter)}</strong>
            </div>

            {/* Bottom Highlight: The calculated winning chance */}
            {/* We conditionally render this only if win_probability exists in the DB */}
            {project.win_probability && (
                <div className="highlight-win">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Trophy size={18} /> סיכוי זכייה משוער:
                    </span>
                    <span style={{ fontSize: '1.2rem' }}>
                        {/* We parse it as a float to fix potential decimal issues, then add % */}
                        {parseFloat(project.win_probability).toFixed(2)}%
                    </span>
                </div>
            )}

        </div>
    );
};

export default ProjectCard;