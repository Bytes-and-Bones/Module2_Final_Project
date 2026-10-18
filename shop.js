document.addEventListener("DOMContentLoaded", function () {

    let coins = parseInt(localStorage.getItem("zombieCoins")) || 0;

    const coinDisplay = document.getElementById("coin-display");
    coinDisplay.textContent = coins;

    const prices = {
        multiplier: 50,
        shield: 150,
        infinite: 300
    };

    setupHatItem("buy-multiplier", "multiplier", prices.multiplier);
    setupHatItem("buy-shield", "shield", prices.shield);
    setupHatItem("buy-infinite", "infinite", prices.infinite);

    function setupHatItem(buttonId, hatKey, price) {
    const button = document.getElementById(buttonId);
    if (!button) return; 

    const isOwned = localStorage.getItem(`owned_${hatKey}`) === "true";
    const isEquipped = localStorage.getItem(`equipped_${hatKey}`) === "true";

    if (isOwned) {
        if (isEquipped) {
            button.textContent = "Equipped";
            button.style.borderColor = "yellow";
            button.style.color = "yellow";
        } else {
            button.textContent = "Equip";
            button.style.borderColor = "#4af626";
        }
    }

    button.addEventListener("click", function() {
        
        if (localStorage.getItem(`owned_${hatKey}`) === "true") {
            localStorage.removeItem("equipped_multiplier");
            localStorage.removeItem("equipped_shield");
            localStorage.removeItem("equipped_infinite");

            localStorage.setItem(`equipped_${hatKey}`, "true");
            alert(`${hatKey.toUpperCase()} helmet equipped!`);
            window.location.reload();
            return; 
        }

        if (coins >= price) {
            coins -= price;
            localStorage.setItem("zombieCoins", coins);
            localStorage.setItem(`owned_${hatKey}`, "true");

            localStorage.removeItem("equipped_multiplier");
            localStorage.removeItem("equipped_shield");
            localStorage.removeItem("equipped_infinite");
            localStorage.setItem(`equipped_${hatKey}`, "true");

            alert(`Unlocked and equipped your new ${hatKey} hat!`);
            window.location.reload();
        } else {
            alert(`Insufficient funds! You need ${price - coins} more zombie coins.`);
        }
    });
}
});