document.addEventListener("DOMContentLoaded", function () {

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

const zombieImg = new Image();
zombieImg.src = "Assets/Zombie.png"

const playerImg = new Image();
playerImg.src = "Assets/Player.png"

let playerY = 180;
const playerX = 83;
const playerSpeed = 5;
const playerSize = 50;

let bullets = [];
let zombies = [];
let ammoCount = 10;

const keysPressed = {};

window.addEventListener("keydown", function (event) {
    keysPressed[event.code] = true;
    if (event.code === "Space") {
        shootBullet();
    }
});

window.addEventListener("keyup", function (event) {
    keysPressed[event.code] = false;
});

function shootBullet() {
    if (ammoCount > 0) {
        bullets.push({
            x: playerX + playerSize,
            y: playerY + (playerSize / 2) - 4,
            width: 10,
            height: 8,
            speed: 8
        });
        ammoCount--;
        console.log("Ammo left: " + ammoCount);
    }
}

function spawnZombie() {

    const skyHeight = 100;
    const playArea = canvas.height - skyHeight - zSize;
    const zSize = 65

    zombies.push({
        x: canvas.width + 20,
        y: skyHeight + (Math.random() * playArea),
        width: zSize,
        height: zSize,
        speed: 1.5
    });
}

const spawnTimer = setInterval(spawnZombie, 2000);

function updateGameLogic() {
    if (keysPressed["ArrowUp"] && playerY > 100) {
        playerY -= playerSpeed;
    }
    if (keysPressed["ArrowDown"] && playerY < canvas.height - playerSize) {
        playerY += playerSpeed;
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].x += bullets[i].speed;
        if (bullets[i].x > canvas.width) {
            bullets.splice(i, 1);
        }
    }
    for (let z = zombies.length - 1; z >= 0; z--) {
        zombies[z].x -= zombies[z].speed;
        for (let b = bullets.length - 1; b >= 0; b--) {
            if (bullets[b].x < zombies[z].x + zombies[z].width &&
                bullets[b].x + bullets[b].width > zombies[z].x &&
                bullets[b].y < zombies[z].y + zombies[z].height &&
                bullets[b].y + bullets[b].height > zombies[z].y) {
                zombies.splice(z, 1);
                bullets.splice(b, 1);
                break;
            }
        }
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (playerImg.complete && playerImg.naturalWidth !== 0) {
        ctx.drawImage(playerImg, playerX, playerY, playerSize, playerSize);
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(playerX, playerY, playerSize, playerSize);
    }

    ctx.fillStyle = "yellow";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    zombies.forEach(zombie => {
        if (zombieImg.complete && zombieImg.naturalWidth !== 0) {
            ctx.drawImage(zombieImg, zombie.x, zombie.y, zombie.width, zombie.height);
        } else {
            ctx.fillStyle = "green";
            ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
        }
    });
}

function gameLoop() {
    updateGameLogic();
    drawGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();
