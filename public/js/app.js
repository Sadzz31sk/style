const modelSelect = document.getElementById("modelSelect");
const modelPreview = document.getElementById("modelPreview");

modelSelect.addEventListener("change", function () {
    modelPreview.src = "assets/images/" + this.value;
});

function previewUpload() {
    const file = document.getElementById('fileUpload').files[0];
    const preview = document.getElementById('uploadPreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById("callApiButton").addEventListener("click", async function () {
    const fileInput = document.getElementById("fileUpload");
    const file = fileInput.files[0];
    const apiImage = document.getElementById("apiImage");

    apiImage.src = "";
    apiImage.alt = "Processing...";
    apiImage.style.display = "block";
    apiImage.style.color = "#666";
    apiImage.style.fontSize = "16px";
    apiImage.style.textAlign = "center";
    apiImage.style.padding = "20px";

    if (!file) {
        alert("Please select an image to upload.");
        return;
    }

    const reader = new FileReader();

    reader.onloadend = async function () {
        const base64Image = reader.result.replace(/^data:image\/[a-z]+;base64,/, ''); // Remove prefix

        try {
            const response = await fetch("http://localhost:3000/process-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image_base64: base64Image }),
            });

            if (!response.ok) {
                throw new Error("Failed to process image");
            }

            const data = await response.json();
            const processedBase64Image = data.processedImageBase64;

            if (processedBase64Image) {
                apiImage.src = "data:image/jpeg;base64," + processedBase64Image;
                apiImage.alt = "Generated Design";
                apiImage.style.color = "";
                apiImage.style.fontSize = "";
                apiImage.style.textAlign = "";
                apiImage.style.padding = "";
            } else {
                apiImage.alt = "Error processing image.";
            }
        } catch (error) {
            console.error("Error:", error);
            apiImage.alt = "Error fetching design. Please check your connection.";
        }
    };

    reader.readAsDataURL(file);
});
