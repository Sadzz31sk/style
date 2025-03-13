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
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById("callApiButton").addEventListener("click", async function () {
    const apiImage = document.getElementById("apiImage");
    
    apiImage.src = "";
    apiImage.alt = "Generated design will be displayed here...";
    apiImage.style.display = "block";
    apiImage.style.color = "#666";
    apiImage.style.fontSize = "16px";
    apiImage.style.textAlign = "center";
    apiImage.style.padding = "20px";
    
    try {
        const response = await fetch("http://localhost:3000/test-image");

        if (!response.ok) {
            throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        apiImage.src = imageUrl;
        apiImage.alt = "Generated Design";
        apiImage.style.color = "";
        apiImage.style.fontSize = "";
        apiImage.style.textAlign = "";
        apiImage.style.padding = "";
    } catch (error) {
        apiImage.alt = "Error fetching design. Please check your connection.";
    }
});
