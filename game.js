document.addEventListener("DOMContentLoaded", function () {

    const survivorName = localStorage.getItem("survivorName");
    const survivorNameElement = document.getElementById("playerName");

    if (survivorName) {
        survivorNameElement.textContent = survivorName;
    } else {
        survivorNameElement.textContent = "Humble Leader";
    }

    const triviaQuestions = [
        {
            question: "What does HTML stand for?",
            choices: ["Hyper Text Markup Language", "Hyper Tensile Material Language", "Hiroglyphic Text Made Long"],
            correctIndex: 0
        },
        {
            question: "In what year did WWII end?",
            choices: ["1495", "1845", "1943", "1945"],
            correctIndex: 3
        },
        {
            question: "Is Ecuador a part of Mexico?",
            choices: ["True", "False"],
            correctIndex: 1
        },
        {
            question: "For which team did Michael Jordan NOT play?",
            choices: ["Chicago Bulls", "Memphis Grizzlies", "Washington Wizards"],
            correctIndex: 1
        },
        {
            question: "Which acclaimed Japanese filmmaker directed the Academy Award-winning animated feature Spirited Away?",
            choices: ["Satoshi Kon", "Hidetaka Miyazaki", "Makoto Shinkai", "Hayao Miyazaki"],
            correctIndex: 3
        },
        {
            question: "What was the first toy to be advertised on television?",
            choices: ["Barbie Doll", "Mr.Potato Head", "Nerf Blaster","Lego Bionicle", "Cabbage Patch Kids"],
            correctIndex: 1
        },
        {
            question: "What is the dot over the letters 'i' and 'j' called?",
            choices: ["Tilde", "Dot", "Tittle", "Point"],
            correctIndex: 2
        },
        {
            question: "How many hearts does and Octopus have?",
            choices: ["4", "8", "3", "6", "3.14"],
            correctIndex: 2
        },
        {
            question: "Is that Solid Snake?",
            choices: ["Yes", "No! That is NOT Solid Snake!!!", "What?!?!?", "I don't know"],
            correctIndex: 1 
        },
        {
            question: "What famous landmark in Italy is known for leaning in one side?",
            choices: ["Leaning Tower of Pizza", "Leaning Tower of Paris", "Leaning Tower of Mona Lisa", "Leaning Tower of Pisa"],
            correctIndex: 3
        },
        {
            question: "What currency is used in Japan?",
            choices: ["Pokemon Cards", "Dollar", "Yen", "Francs"],
            correctIndex: 2
        },
        {
            question: "What is the name of the Author that wrote Frankenstein?",
            choices: ["Jane Austen", "Mary Shelley", "Miriam Wells", "Virginia Woolf"],
            correctIndex: 1
        }

    ];

    let isTriviaActive = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const zombieImg = new Image();
zombieImg.src = "Assets/Zombie.png"

const playerImg = new Image();
playerImg.src = "Assets/Player.png"

let playerY = 180;
const playerX = 50;
const playerSpeed = 5;
const playerSize = 120;

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

    if (ammoCount <=0) {
        setTimeout(launchTriviaChallenge, 100);
    }
}

function launchTriviaChallenge(){
    isTriviaActive = true;

    const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
    const activeQuestion = triviaQuestions[randomIndex];

    let promptMessage = activeQuestion.question + "\n\n";
    activeQuestion.choices.forEach((choice, index) => {
        promptMessage += `${index}: ${choice}\n`;
    });

    const startTime = performance.now();
    const playerResponse = prompt(promptMessage);
    const endTime = performance.now();

    const secondsTaken = ((endTime - startTime) / 1000).toFixed(1);

    if (playerResponse !== null && parseInt(playerResponse) === activeQuestion.correctIndex) {
        if (secondsTaken <= 3.0) {
            ammoCount += 15;
            alert(`Fantastic! Answered in ${secondsTaken}s. +15 Max Ammo!`);
        }else if(secondsTaken <= 7.0) {
            ammoCount += 7;
            alert(`Correct! Answered in ${secondsTaken}s. +7 Ammo.`);
        }else{
            ammoCount += 2;
            alert(`Correct but too slow (${secondsTaken}s). +2 Ammo.`);
        }
    
    }else{
        alert("Incorrect! No ammo for you!");
    }

    isTriviaActive = false;
}

function spawnZombie() {

    const skyHeight = 100;
    const zSize = 120;
    const playArea = canvas.height - skyHeight - zSize;


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
    ctx.textAlign = "left";
   

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

    ctx.font = "bold 20px 'Courier New', Courier, monospace";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText("AMMO: " +ammoCount, 630, 35);
}

function gameLoop() {
    if (!isTriviaActive) {
        updateGameLogic();
        drawGame();
    }
    
    requestAnimationFrame(gameLoop);
}

gameLoop();
});
