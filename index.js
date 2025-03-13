const express = require('express');
const app = express();
const path = require('path');

const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));

app.get("/test-image", async (req, res) => {
  try {
      const imageUrl = "https://picsum.photos/1440"; // Test image URL
      const response = await fetch(imageUrl);
      const buffer = await response.buffer();

      res.set("Content-Type", "image/jpeg");
      res.send(buffer);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch image" });
  }
});

app.listen(port, () => {
  console.log('Server running at : http://localhost:3000/');
  console.log("Ctrl+C to exit");
});