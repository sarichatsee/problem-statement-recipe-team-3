import React, {useState} from 'react';

const LogMeal = () => {
  return (
    <div className='log-meal'>
      <h2>Log Meal</h2>
      <p>This is the Log Meal page where you can upload a picture of a food, and using LogMeal API, the nutritional information of the detected food will be displayed, including calories, serving size & nutritional breakdown.</p>
      
      <div className='foodanalysis'>
        // container to show uploaded image
        // container to show detected food items in the image
          // sub containers for each detected food item and their retrieved detailed nutritional 
          information, including calories, serving size, and nutrient breakdown
      </div>

      <div className='log-meal-form'>
        // Add form to upload image
      </div>
    </div>
  );
}

export default LogMeal;
