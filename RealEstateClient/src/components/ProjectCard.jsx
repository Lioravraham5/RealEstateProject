import React from 'react';

// Importing icons to make the card look premium and easy to scan
import { 
    MapPin, 
    Building, 
    Coins, 
    Home, 
    Trophy,
    Hourglass,
    CalendarDays, 
    Tag 
} from 'lucide-react';

/**
 * A presentational (dumb) component that renders a single project as a card.
 * @param {Object} project - The data object containing project details from the DB.
 */
const ProjectCard = ({ project }) => {

    // --- Helper Function: Dynamic Status Badge Color ---
    const getStatusClass = (status) => {
        if (!status) return 'status-default';

        switch (status) {
            case 'בתהליכי הגרלה':
                return 'status-open';     
            case 'בחירת דירות':
                return 'status-future';   
            case 'בקרת חוזים':
                return 'status-closed';   
            case 'בקרה לאחר איכלוס':
                return 'status-default';  
            default:
                return 'status-default';
        }
    };

    // --- Helper Function: Format Numbers ---
    const formatNumber = (num) => {
        return num ? num.toLocaleString() : 'לא צוין';
    };

    // --- Helper Function: Format Dates ---
    const formatDate = (dateStr) => {
        if (!dateStr) return 'טרם פורסם';

        try {
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj.getTime())) return 'תאריך לא תקין';

            return new Intl.DateTimeFormat('he-IL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(dateObj);
        } catch (e) {
            return 'תאריך לא תקין';
        }
    };

    return (
        <div className="project-card">

            {/* Header: City, Project Number, and Status Badge */}
            {/* Note: Removed the padding we added earlier since the floating tag is gone */}
            <div className="card-header">
                <div className="card-title">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={18} color="#e74c3c" />
                        {project.city}
                    </h3>
                    <p>מזהה פרויקט: {project.lottery_id || '---'}</p>
                </div>

                <span className={`status-badge ${getStatusClass(project.status)}`}>
                    {project.status || 'סטטוס לא ידוע'}
                </span>
            </div>

            {/* --- Body Rows: Key project details with icons --- */}
            
            {/* NEW: Lottery Type as a standard row */}
            <div className="card-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7f8c8d' }}>
                    <Tag size={16} /> סוג הגרלה:
                </span>
                <strong>{project.lottery_type || 'לא צוין'}</strong>
            </div>

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

            <div className="card-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7f8c8d' }}>
                    <Hourglass size={16} /> סיום הרשמה:
                </span>
                <strong>{formatDate(project.signup_end_date)}</strong>
            </div>

            <div className="card-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7f8c8d' }}>
                    <CalendarDays size={16} /> תאריך הגרלה:
                </span>
                <strong>{formatDate(project.lottery_date)}</strong>
            </div>

            {/* Bottom Highlight: The calculated winning chance */}
            {project.win_probability && (
                <div className="highlight-win" style={{ marginTop: 'auto' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Trophy size={18} /> סיכוי זכייה משוער:
                    </span>
                    <span style={{ fontSize: '1.2rem' }}>
                        {parseFloat(project.win_probability).toFixed(2)}%
                    </span>
                </div>
            )}

        </div>
    );
};

export default ProjectCard;