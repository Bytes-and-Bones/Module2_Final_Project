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
            choices: ["Barbie Doll", "Mr.Potato Head", "Nerf Blaster", "Lego Bionicle", "Cabbage Patch Kids"],
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

    const hatMultiplierImg = new Image();
    hatMultiplierImg.src = "Assets/Hat_Multiplier.png";

    const hatShieldImg = new Image();
    hatShieldImg.src = "Assets/Hat_Shield.png";

    const hatInfiniteImg = new Image();
    hatInfiniteImg.src = "Assets/Hat_Infinity.png";

    let activeHat = null;


    if (localStorage.getItem("equipped_multiplier") === "true") activeHat = "multiplier";
    if (localStorage.getItem("equipped_shield") === "true") activeHat = "shield";
    if (localStorage.getItem("equipped_infinite") === "true") activeHat = "infinite";

    let playerY = 180;
    const playerX = 50;
    const playerSpeed = 5;
    const playerSize = 120;

    let bullets = [];
    let zombies = [];
    let ammoCount = 10;
    let scorePoints = 0;
    let zombieKillCount = 0;
    let shieldUsedThisQuiz = false;
    let isGameOver = false;

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

        const hasInfinite = localStorage.getItem("equipped_infinite") === "true";

        if (hasInfinite || ammoCount > 0) {

            bullets.push({
                x: playerX + playerSize,
                y: playerY + (playerSize / 2) - 4,
                width: 10,
                height: 8,
                speed: 8
            });

            if (!hasInfinite) {
                ammoCount--;
                console.log("Ammo left: " + ammoCount);

                if (ammoCount <= 0) {
                    setTimeout(launchTriviaChallenge, 100);
                }
            }
        }
    }

    function triggerGameOver() {
        isGameOver = true;
        clearInterval(spawnTimer);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "bold 45px 'Courier New', Courier, monospace";
        ctx.fillStyle = "#ff4444";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", 300, 180);

        ctx.font = "20px 'Courier New', Courier, monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("The zombies ate your brainz!", 300, 230);
        ctx.fillText("Click 'Not Ready Yet!' or 'Headwear Collection' to refresh and retry.", 300, 260);
    }
    function launchTriviaChallenge() {
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
            } else if (secondsTaken <= 7.0) {
                ammoCount += 7;
                alert(`Correct! Answered in ${secondsTaken}s. +7 Ammo.`);
            } else {
                ammoCount += 2;
                alert(`Correct but too slow (${secondsTaken}s). +2 Ammo.`);
            }
        } else {

            const hasShield = localStorage.getItem("equipped_shield") === "true";

            if (hasShield && !shieldUsedThisQuiz) {
                ammoCount += 5;
                shieldUsedThisQuiz = true;

                alert("WRONG ANSWER! But your Spare Shield Hat cracked to save your life! +5 Emergency Ammo.");
            } else {

                alert("Incorrect choice! No ammo awarded. The horde presses onward!");
            }
        }

        shieldUsedThisQuiz = false;
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

        let difficultyBonus = Math.floor(zombieKillCount / 5) * 0.5;

        for (let z = zombies.length - 1; z >= 0; z--) {

            zombies[z].x -= (zombies[z].speed + difficultyBonus);

            if (zombies[z].x < 0) {
                triggerGameOver();
                return;
            }

            if (playerX < zombies[z].x + zombies[z].width &&
                playerX + playerSize > zombies[z].x &&
                playerY < zombies[z].y + zombies[z].height &&
                playerY + playerSize > zombies[z].y) {
                triggerGameOver();
                return;
            }

            for (let b = bullets.length - 1; b >= 0; b--) {
                if (bullets[b].x < zombies[z].x + zombies[z].width &&
                    bullets[b].x + bullets[b].width > zombies[z].x &&
                    bullets[b].y < zombies[z].y + zombies[z].height &&
                    bullets[b].y + bullets[b].height > zombies[z].y) {

                    zombies.splice(z, 1);
                    bullets.splice(b, 1);


                    let coinReward = 10;
                    if (localStorage.getItem("owned_multiplier") === "true") {
                        coinReward = 20;
                    }


                    scorePoints += coinReward;
                    zombieKillCount++;
                    localStorage.setItem("zombieCoins", scorePoints);

                    break;
                }
            }
        }
    }

    function drawGame() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "left"; 
    
    if (!isGameOver) {
      
        if (playerImg.complete && playerImg.naturalWidth !== 0) {
            ctx.drawImage(playerImg, playerX, playerY, playerSize, playerSize);
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(playerX, playerY, playerSize, playerSize);
        }

        if (activeHat !== null) {
            let hatImgToDraw = null;
            if (activeHat === "multiplier" && hatMultiplierImg.complete) hatImgToDraw = hatMultiplierImg;
            if (activeHat === "shield" && hatShieldImg.complete)         hatImgToDraw = hatShieldImg;
            if (activeHat === "infinite" && hatInfiniteImg.complete)     hatImgToDraw = hatInfiniteImg;

            if (hatImgToDraw) {
                ctx.drawImage(hatImgToDraw, playerX, playerY, playerSize, playerSize);
            }
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
        ctx.fillStyle = "#4af626";
        ctx.textAlign = "right";
        ctx.fillText("AMMO: " + ammoCount, 570, 35);
    }

    if (isGameOver) {

        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "bold 45px 'Courier New', Courier, monospace";
        ctx.fillStyle = "#ff4444";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", 400, 180);
        
        ctx.font = "20px 'Courier New', Courier, monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("The zombies ate your brainz!", 400, 230);
        ctx.fillText("Click 'Main Menu' or 'Shop' to retry.", 400, 260);
    }
}

    function gameLoop() {
        if (!isTriviaActive && !isGameOver) {
            updateGameLogic();
            drawGame();
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
