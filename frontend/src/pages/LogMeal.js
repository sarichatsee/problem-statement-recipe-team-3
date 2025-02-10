import React, { useState } from 'react';

const LogMeal = () => {
  const [image, setImage] = useState(null);
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      setError("Please select an image first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', image);

      // First, segment the image to detect food items
      const segmentationResponse = await fetch('https://api.logmeal.com/v2/image/segmentation/complete', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer 60942d698fedd68ffda2975966e26ac720c0a3cd' // Replace YOUR_API_KEY with your actual API key
        }
      });
      const segmentationData = await segmentationResponse.json();

      // Then, get nutritional information
      if (segmentationData.status === "success") {
        const nutritionResponse = await fetch('https://api.logmeal.com/v2/recipe/nutritionalInfo', {
          method: 'POST',
          body: JSON.stringify({imageId: segmentationData.imageId}),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
          }
        });
        const nutritionData = await nutritionResponse.json();
        setMealData(nutritionData);
      } else {
        throw new Error('Failed to segment image.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='log-meal'>
      <h2>Log Meal</h2>
      <p>This is the Log Meal page where you can upload a picture of food, and using LogMeal API, the nutritional information of the detected food will be displayed, including calories, serving size & nutritional breakdown.</p>

      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}

      <div className='log-meal-form'>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleImageChange} accept="image/*" />
          <button type="submit">Analyze Meal</button>
        </form>
      </div>

      <div className='foodanalysis'>
        {mealData && (
          <div>
            <h3>Detected Food Items</h3>
            {mealData.foods.map((food, index) => (
              <div key={index}>
                <h4>{food.name}</h4>
                <p>Calories: {food.calories} kcal</p>
                <p>Serving size: {food.servingSize} g</p>
                {/* More detailed breakdown could be added here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LogMeal;
