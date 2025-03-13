const modelSelect = document.getElementById("modelSelect");
const modelPreview = document.getElementById("modelPreview");

// Listen for changes in the dropdown
modelSelect.addEventListener("change", function () {
    modelPreview.src = "assets/images/" + this.value;
});