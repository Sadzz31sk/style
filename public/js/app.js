const modelSelect = document.getElementById("modelSelect");
const modelPreview = document.getElementById("modelPreview");
const fileInput = document.getElementById("fileUpload");
const descriptionInput = document.getElementById("garmentDescription");
const apiImage = document.getElementById("apiImage");
const placeholderText = document.getElementById("placeholderText");


modelSelect.addEventListener("change", function () {
    modelPreview.src = "assets/images/" + this.value;
});

// Preview
function previewUpload() {
    const file = fileInput.files[0];
    const preview = document.getElementById("uploadPreview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
}

// Convert to Base64
async function getModelImageBase64(imagePath) {
    try {
        const response = await fetch(imagePath);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extract base64
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error loading model image:", error);
        return null;
    }
}


async function processImage() {
    const file = fileInput.files[0];
    const description = descriptionInput.value.trim();
    const selectedModel = modelSelect.value;

    if (!file) {
        alert("Please select an image to upload.");
        return;
    }

    if (!description) {
        alert("Please enter a garment description.");
        return;
    }

    if (!selectedModel) {
        alert("Please select a model image.");
        return;
    }

    // loading state
    apiImage.src = "";
    apiImage.style.display = "none";
    placeholderText.style.display = "block";
    placeholderText.textContent = "Processing...";


    const reader = new FileReader();
    reader.onloadend = async function () {
        const base64GarmentImage = reader.result.split(",")[1]; // Extract base64 data
        const base64ModelImage = await getModelImageBase64("assets/images/" + selectedModel);

        if (!base64ModelImage) {
            alert("Error loading model image.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/process-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_base64: base64GarmentImage,
                    description: description,
                    model_image: base64ModelImage,
                    layers: null,
                    composite: null,
                    is_checked: false,
                    is_checked_crop: false,
                    denoise_steps: 10,
                    seed: 42,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to process image");
            }

            const data = await response.json();
            const processedBase64Image = data.processedImageBase64;

            if (processedBase64Image) {
                apiImage.src = "data:image/jpeg;base64," + processedBase64Image;
                apiImage.style.display = "block";
                placeholderText.style.display = "none";
            } else {
                placeholderText.textContent = "Error processing image.";
            }
        } catch (error) {
            console.error("Error:", error);
            placeholderText.textContent = "Error fetching design. Please try again.";
        }
    };

    reader.readAsDataURL(file);
}

document.getElementById("callApiButton").addEventListener("click", processImage);
