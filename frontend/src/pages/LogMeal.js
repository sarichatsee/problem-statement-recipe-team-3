import React, { useState } from 'react';

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
            // Step 1: Detect food items using LogMeal API
            const segmentationResponse = await fetch('https://api.logmeal.es/v2/image/segmentation/complete', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_LOGMEAL_API_KEY}`
                },
                body: formData
            });

            const segmentationData = await segmentationResponse.json();
            if (!segmentationResponse.ok) {
                throw new Error(`Segmentation failed: ${segmentationData.message || 'No specific error message'}`);
            }

            if (!segmentationData.imageId) {
                throw new Error("No imageId returned, which is necessary for further processing.");
            }

            // Step 2: Fetch nutritional information using the imageId
            const nutritionResponse = await fetch('https://api.logmeal.es/v2/recipe/nutritionalInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_LOGMEAL_API_KEY}`
                },
                body: JSON.stringify({ imageId: segmentationData.imageId })
            });

            const nutritionData = await nutritionResponse.json();
            if (!nutritionResponse.ok) {
                throw new Error(`Failed to retrieve nutritional information: ${nutritionData.message || 'No specific error message'}`);
            }

            // Combine food recognition and nutritional info
            setResults({
                recognition: segmentationData,
                nutrition: nutritionData
            });

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
                    <pre>{JSON.stringify(results.recognition, null, 2)}</pre>
                    <h3>Nutritional Information:</h3>
                    {results.nutrition && (
                        <div>
                            <p><strong>Calories:</strong> {results.nutrition.nutritional_info?.calories?.toFixed(2)} kcal</p>
                            <p><strong>Serving Size:</strong> {results.nutrition.serving_size}g</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LogMeal;
