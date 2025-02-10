import React, { useState } from 'react';

const NutritionalAnalysis = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select an image first.');

        const apiUserToken = 'fb3afd4cbdef7975026eeafac73a860b82477765';
        const headers = { 'Authorization': `Bearer ${apiUserToken}` };
        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            // post the image for the segmentation to happen to figure out food composition
            const segmentationResponse = await fetch(
                'https://api.logmeal.com/v2/image/segmentation/complete',
                { method: 'POST', body: formData, headers }
            );
            const segmentationData = await segmentationResponse.json();
            console.log("Segmentation Response:", segmentationData);

            if (!segmentationData.imageId) throw new Error('Segmentation failed');

            // send the image back to the API so that the nutritional value can be sent.
            const nutritionResponse = await fetch(
                'https://api.logmeal.com/v2/recipe/nutritionalInfo',
                {
                    method: 'POST',
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageId: segmentationData.imageId }),
                }
            );
            const nutritionData = await nutritionResponse.json();
            console.log("Nutritional Response:", nutritionData);

            setResult(nutritionData);
        } catch (error) {
            console.error('Error:', error);
            setResult({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    // added the key nutrients that i want the value off based on the json
    const keyNutrients = {
        CHOCDF: "Carbs",
        PROCNT: "Protein",
        FAT: "Fat",
        FASAT: "Saturated fats",
        FATRN: "Trans fats",
        SUGAR: "Sugars",
        NA: "Sodium",   
        CHOLE: "Cholesterol"
    };

    return (
        <div className="pages">
            <form onSubmit={handleSubmit} className="signup">
                <h3>Upload a Photo to have a Nutritional Analysis:</h3>
                <h5>After taking a photo, it will load and the details of the nutritional value would be listed below.</h5>
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
                <p>Please upload the picture below</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </form>

            {result && (
                <div className="recipes">
                    <h4>Information based on Nutritional Value of the Food:</h4>
                    {result.error ? (
                        <p className="error">{result.error}</p>
                    ) : result.nutritional_info ? (
                        <>
                            <p><strong>Total Calories:</strong> {result.nutritional_info?.calories?.toFixed(2)} kcal</p>
                            <ul>
                                {Object.entries(keyNutrients).map(([key, label]) => {
                                    const nutrients = result.nutritional_info?.totalNutrients;
                                    const nutrientValue = nutrients?.[key]?.quantity;

                                    return nutrientValue !== undefined ? (
                                        <li key={key}>
                                            <strong>{label}:</strong> {nutrientValue.toFixed(2)} {nutrients[key].unit}
                                        </li>
                                    ) : (
                                        <li key={key}><strong>{label}:</strong> N/A</li>
                                    );
                                })}
                            </ul>
                        </>
                    ) : (
                        <p className="error">There is no nutritional data available for this image. Please try again!</p>
                    )}
                </div>
            )}


<style jsx>{`

                .pages {
                    display: flex;
                    justify-content: center; 
                    align-items: center;    
                    width: 100%;            
                }

                .recipes {
                    background-color: #a29dff;
                    padding: 20px;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;  
                    justify-content: center; 
                    text-align: center;
                    width: 700px;
                    height: 500px;
                }

                .recipes h4 {
                    font-size: 24px;
                    color:rgb(0, 0, 0);
                }

                .recipes p {
                    font-size: 20px;
                    margin-bottom: 10px;
                }
                    
                .recipes li {
                    font-size: 18px;
                    margin-bottom: 8px;
                }
            `}</style>
        </div>
    );
};

export default NutritionalAnalysis;