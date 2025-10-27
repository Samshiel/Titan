import './Header.css';

const getConfidenceColor = (confidence) => {
    const red = Math.round(255 * (1 - confidence));
    const green = Math.round(255 * confidence);
    return `rgb(${red}, ${green}, 0)`;
};

const getConfidenceLevel = (confidence) => {
    const percent = confidence * 100;
    if (percent >= 80) {
        return 'high';
    } else if (percent >= 50) {
        return 'medium';
    } else {
        return 'low';
    }
};

export const Header = ({ data, message }) => {
    return (
        <h1 className="header-message">
            {data ? (
                <>
                    ML suggests it is{' '}
                    <span className="label-text">"{ data.suggested_label }"</span>
                    {' '}with{' '}
                    <span 
                        className="confidence-text"
                        style={ { color: getConfidenceColor(data.confidence_score) } }
                        aria-label={ `${getConfidenceLevel(data.confidence_score)} confidence` }
                    >
                        {( data.confidence_score * 100).toFixed(0) }% confidence
                        <span className="sr-only"> ({ getConfidenceLevel(data.confidence_score) })</span>
                    </span>
                </>
            ) : (
                message
            )}
        </h1>
    );
};

