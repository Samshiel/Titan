import './DarkModeToggle.css';

export const DarkModeToggle = ({ darkMode, onToggle }) => {
    return (
        <button 
            className="dark-mode-toggle" 
            onClick={ onToggle }
            aria-label="Toggle dark mode"
        >
            { darkMode ? "☀️" : "🌙" }
        </button>
    );
};

