document.addEventListener("DOMContentLoaded", function(){

    const survivorName = localStorage.getItem("survivorName");
    const survivorNameElement = document.getElementById("playerName");

    if (survivorName) {
        survivorNameElement.textContent = survivorName;
    } else {
        survivorNameElement.textContent = "Humble Leader";
    }
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#4af626";
ctx.fillRect(300, 180, 40, 40);