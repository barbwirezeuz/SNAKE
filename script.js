document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-board");
    const scoreDisplay = document.getElementById("score");
    const gameOverScreen = document.getElementById("game-over");
    const gameOverText = document.getElementById("game-over-text");
    const restartButton = document.getElementById("restart-button");

    const upButton = document.getElementById("up-button");
    const downButton = document.getElementById("down-button");
    const leftButton = document.getElementById("left-button");
    const rightButton = document.getElementById("right-button");

    upButton.addEventListener("touchstart", () => {
        if (direction !== "down") direction = "up";
    });

    downButton.addEventListener("touchstart", () => {
        if (direction !== "up") direction = "down";
    });

    leftButton.addEventListener("touchstart", () => {
        if (direction !== "right") direction = "left";
    });

    rightButton.addEventListener("touchstart", () => {
        if (direction !== "left") direction = "right";
    });

    const gridSize = 20;
    const cellSize = 25;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let direction = "right";
    let score = 0;
    let gameInterval;  // Variable to store the interval

    function createBoard() {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.dataset.row = row;
                cell.dataset.col = col;
                board.appendChild(cell);
            }
        }
    }

    function drawSnake() {
        clearBoard();
        snake.forEach(segment => {
            const index = segment.x + segment.y * gridSize;
            const cell = board.children[index];
            cell.classList.add("snake");
        });
    }

    function drawFood() {
        const index = food.x + food.y * gridSize;
        const cell = board.children[index];
        cell.classList.add("food");
    }

    function clearBoard() {
        const cells = board.getElementsByClassName("cell");
        Array.from(cells).forEach(cell => {
            cell.classList.remove("snake", "food");
        });
    }

    function moveSnake() {
        const head = { ...snake[0] };

        switch (direction) {
            case "up":
                head.y = (head.y - 1 + gridSize) % gridSize;
                break;
            case "down":
                head.y = (head.y + 1) % gridSize;
                break;
            case "left":
                head.x = (head.x - 1 + gridSize) % gridSize;
                break;
            case "right":
                head.x = (head.x + 1) % gridSize;
                break;
        }

        // Check for collision with self
        if (checkCollision(head, snake.slice(1))) {
            gameOver();
            return;
        }

        snake.unshift(head);

        // Check for collision with food
        if (head.x === food.x && head.y === food.y) {
            score++;
            generateFood();
        } else {
            snake.pop();
        }

        drawSnake();
        drawFood();
        updateScore();
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };

        // Regenerate if the food is on the snake
        while (checkCollision(food, snake)) {
            food = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };
        }
    }

    function checkCollision(point, array) {
        return array.some(segment => segment.x === point.x && segment.y === point.y);
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function gameOver() {
        gameOverText.textContent = `Game Over - Score: ${score}`;
        gameOverScreen.style.display = "flex";
        clearInterval(gameInterval);  // Clear the interval on game over
    }

    function restartGame() {
        clearInterval(gameInterval);  // Clear the existing interval
        snake = [{ x: 10, y: 10 }];
        food = { x: 5, y: 5 };
        direction = "right";
        score = 0;
        gameOverScreen.style.display = "none";
        updateScore();
        moveSnake(); // Initial move to start the game
        gameInterval = setInterval(moveSnake, 200);  // Start a new interval
    }

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                if (direction !== "down") direction = "up";
                break;
            case "ArrowDown":
                if (direction !== "up") direction = "down";
                break;
            case "ArrowLeft":
                if (direction !== "right") direction = "left";
                break;
            case "ArrowRight":
                if (direction !== "left") direction = "right";
                break;
        }
    });

    restartButton.addEventListener("click", restartGame);

    createBoard();
    restartGame();
});
