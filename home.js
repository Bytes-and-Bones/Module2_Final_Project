document.addEventListener("DOMContentLoaded", function() {

    const startButton = document.getElementById("start-game");

    startButton.addEventListener("click", function() {

        const playerName = prompt("Enter your name:");

        if (playerName && playerName.trim() !== "") {

            localStorage.setItem("playerName", playerName.trim());

            window.location.href = "game.html";
        } else {
            alert("Leave your mark survivor! What do we call you?");
        }
    });
});