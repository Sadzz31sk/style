const express = require("express");
const app = express();
const path = require("path");

const port = 3000;

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to handle JSON payloads (increase size limit for Base64 images)
app.use(express.json({ limit: "100mb" }));

app.get("/", (req, res) => res.render("index"));

app.post("/process-image", async (req, res) => {
  try {
    const {
      image_base64: garm_img,
      description: garment_des,
      model_image: background,
    } = req.body;

    // Validation
    if (!garm_img) return res.status(400).json({ error: "No garment image provided" });
    if (!garment_des) return res.status(400).json({ error: "Garment description is required" });
    if (!background) return res.status(400).json({ error: "Model image is required" });

    const apiResponse = await fetch("https://dl64tsd8-8000.inc1.devtunnels.ms/tryon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        background,
        garm_img,
        garment_des
      }),
    });

    const data = await apiResponse.json();

    if (!data.generated_image) {
      throw new Error("Invalid response from processing API");
    }

    res.send({ processedImageBase64: data.generated_image });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/`);
  console.log("Ctrl+C to exit");
});
