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
            // Post the image for segmentation to detect food composition
            const segmentationResponse = await fetch('https://api.logmeal.com/v2/image/segmentation/complete', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': 'Bearer 60942d698fedd68ffda2975966e26ac720c0a3cd' 
                }
            });
            const segmentationData = await segmentationResponse.json();

            if (!segmentationData.imageId) {
                throw new Error('Failed to segment image.');
            }

            // Fetch the nutritional information based on the detected image ID
            const nutritionResponse = await fetch('https://api.logmeal.com/v2/recipe/nutritionalInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 60942d698fedd68ffda2975966e26ac720c0a3cd'
                },
                body: JSON.stringify({ imageId: segmentationData.imageId })
            });
            const nutritionData = await nutritionResponse.json();

            setResults(nutritionData);
        } catch (error) {
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
                    <h3>Nutritional Information:</h3>
                    {results.error ? (
                        <p className="error">{results.error}</p>
                    ) : (
                        <div>
                            <p><strong>Calories:</strong> {results.nutritionalInfo.calories} kcal</p>
                            <p><strong>Serving Size:</strong> {results.nutritionalInfo.servingSize} grams</p>
                            <h4>Nutrients Breakdown:</h4>
                            <ul>
                                {results.nutritionalInfo.nutrients.map((nutrient) => (
                                    <li key={nutrient.label}>
                                        <strong>{nutrient.label}:</strong> {nutrient.quantity} {nutrient.unit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LogMeal;
