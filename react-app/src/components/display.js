import './display.css';

export const Display = ({ photoUrl, label }) => {
    const altText = label 
        ? `Machine learning suggests: ${label}` 
        : "Image to be labeled";

    const handleImageError = (e) => {
        console.error("Image failed to load. URL:", photoUrl);
        console.error("Error event:", e);
    };

    return (
        <figure className="Image">
            {photoUrl && (
                <img 
                    src={ photoUrl } 
                    alt={ altText }
                    aria-label={ altText }
                    onError={ handleImageError }
                />
            )}
        </figure>
    );
}