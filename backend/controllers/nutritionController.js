const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.uploadImageAndGetNutrition = async (req, res) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(req.file.path));

  try {
    const response = await axios.post('https://api.logmeal.es/v2/image/recognition/complete', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    fs.unlinkSync(req.file.path); // Always clean up the uploaded file
  }
};
