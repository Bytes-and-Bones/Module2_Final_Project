document.addEventListener("DOMContentLoaded", function(){

    const survivorName = localStorage.getItem("playerName");
    const survivorNameElement = document.getElementById("survivor-name");

    if (survivorName) {
        survivorNameElement.textContent = survivorName;
    } else {
        survivorNameElement.textContent = "Humble Leader";
    }
});