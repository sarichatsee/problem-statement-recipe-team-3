import React, { useState } from 'react';

// Centralize API Key management
const API_KEY = 'bf73d6850eaccfe153c24006a3fe989da6fb2b23';

const LogMeal = () => {
    const [image, setImage] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setError('Please select an image first.');
            return;
        }
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', image);

        try {
            const segmentationResponse = await fetch('https://api.logmeal.com/v2/image/segmentation/complete', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: formData
            });

            if (!segmentationResponse.ok) {
                const errorDetail = await segmentationResponse.json();
                throw new Error(`Failed to segment image: ${errorDetail.message}`);
            }

            const segmentationData = await segmentationResponse.json();

            // Assuming successful segmentation, you might want to do more with the result here.
            // For now, we log it and display it in the UI.
            console.log("Segmentation Data:", segmentationData);
            setResults(segmentationData);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="log-meal">
            <h2>Log Meal</h2>
            <p>Upload a picture of food, and see detailed nutritional information.</p>

            {error && <div className="error">{error}</div>}
            {loading && <div>Loading...</div>}

            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <button type="submit">Analyze Meal</button>
            </form>

            {results && (
                <div>
                    <h3>Segmentation Data:</h3>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default LogMeal;
