const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const nutritionController = require('../controllers/nutritionController');

router.post('/upload', upload.single('dishImage'), nutritionController.uploadImageAndGetNutrition);

module.exports = router;
