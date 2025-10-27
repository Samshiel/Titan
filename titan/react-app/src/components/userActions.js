import { useState } from 'react';
import './userActions.css';

export const UserActions = ({ data, onRefresh }) => {
    const [newLabel, setNewLabel] = useState(() => {
        const saved = localStorage.getItem('newLabel');
        return saved || '';
    });
    
    const updateLabel = (value) => {
        setNewLabel(value);
        localStorage.setItem('newLabel', value);
    };
    
    const handleSubmitLabel = async (label) => {
        try {
            const response = await fetch('/api/labels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageId: `image_${data.id}`,
                    label
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                throw new Error('Failed to submit label');
            }
            
            await response.json();
            updateLabel("");
            onRefresh();
        } catch (error) {
            console.error('Error submitting label:', error);
        }
    };
    
    return (
        <div 
            className="userControls" 
            role="group" 
            aria-label="Image labeling actions"
        >
            <button 
                className="confirm-button" 
                onClick={ () => handleSubmitLabel(data.suggested_label) }
                aria-label={`Confirm suggested label: ${ data.suggested_label}` }
            >
                Confirm
            </button>
            <label 
                htmlFor="custom-label" 
                className="sr-only"
                aria-label="Custom label for image"
            >
                Custom label for image
            </label>
            <input
                id="custom-label"
                type="text"
                placeholder="Overwrite suggestion with new label"
                value={ newLabel }
                onChange={ (e) => updateLabel(e.target.value) }
                aria-describedby="label-hint"
            />
            <span 
                id="label-hint" 
                className="sr-only"
                aria-label="Enter a custom label to override the ML suggestion"
            >
                Enter a custom label to override the ML suggestion
            </span>
            <button 
                className="correct-button" 
                disabled={ !newLabel } 
                onClick={ () => handleSubmitLabel(newLabel) }
                aria-label={ newLabel ? `Submit custom label: ${ newLabel }` : 'Enter a custom label to submit' }
            >
                Correct
            </button>
        </div>
    );
};