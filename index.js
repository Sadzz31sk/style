const express = require('express');
const fetch = require('node-fetch'); // Required for making API requests
const app = express();
const path = require('path');

const port = 3000;

// CORS headers to allow frontend requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all domains for CORS
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to handle JSON payloads (increase size limit for Base64 images)
app.use(express.json({ limit: '100mb' }));

// Route to serve the homepage
app.get('/', (req, res) => res.render('index'));

// Route to fetch and return a test image
app.get('/test-image', async (req, res) => {
  try {
    const imageUrl = 'https://picsum.photos/1440'; // Test image URL
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Route to process Base64 image and forward to an external API
app.post('/process-image', async (req, res) => {
  try {
    const { image_base64 } = req.body;

    if (!image_base64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const apiResponse = await fetch('https://dl64tsd8-8000.inc1.devtunnels.ms/generate-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_base64 }),
    });

    const data = await apiResponse.json();

    if (!data.generated_image) {
      throw new Error('Invalid response from processing API');
    }

    res.send({ processedImageBase64: data.generated_image });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/`);
  console.log('Ctrl+C to exit');
});
