// Snake Game
const snakeGame = {
    canvas: null,
    ctx: null,
    gridSize: 20,
    tileCount: 20,
    snake: [],
    food: { x: 15, y: 15 },
    dx: 0,
    dy: 0,
    score: 0,
    highScore: 0,
    gameLoop: null,
    gameSpeed: 100,
    isInitialized: false,

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadHighScore();
        this.reset();
        this.setupControls();
        this.setupButtons();
    },

    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (windowManager.windows.snake?.element.style.display !== 'flex') return;

            const movements = {
                ArrowUp: { dx: 0, dy: -1, check: () => this.dy === 0 },
                ArrowDown: { dx: 0, dy: 1, check: () => this.dy === 0 },
                ArrowLeft: { dx: -1, dy: 0, check: () => this.dx === 0 },
                ArrowRight: { dx: 1, dy: 0, check: () => this.dx === 0 }
            };

            if (movements[e.key]?.check()) {
                this.dx = movements[e.key].dx;
                this.dy = movements[e.key].dy;
                e.preventDefault();
            }
        });

        // Touch controls
        gameUtils.createTouchControls(this.canvas, (diffX, diffY) => {
            const threshold = 30;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal movement
                if (diffX > threshold && this.dx === 0) {
                    this.dx = 1;
                    this.dy = 0;
                } else if (diffX < -threshold && this.dx === 0) {
                    this.dx = -1;
                    this.dy = 0;
                }
            } else if (Math.abs(diffY) >= threshold) {
                // Vertical movement - only process significant vertical swipes
                if (diffY > threshold && this.dy === 0) {
                    this.dx = 0;
                    this.dy = 1;
                } else if (diffY < -threshold && this.dy === 0) {
                    this.dx = 0;
                    this.dy = -1;
                }
            }
        });
    },

    setupButtons() {
        gameUtils.setupGameButtons('snake', () => this.start(), () => {
            this.reset();
            this.start();
            this.draw();
        });
    },

    reset() {
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.updateScore();
        this.placeFood();
        clearInterval(this.gameLoop);
    },

    start() {
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
    },

    update() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        // Wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }

        // Self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.updateScore();
            this.placeFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    },

    draw() {
        // Background
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }

        // Snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#2E7D32' : '#4CAF50';
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Food
        this.ctx.fillStyle = '#F44336';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 1,
            this.food.y * this.gridSize + 1,
            this.gridSize - 2,
            this.gridSize - 2
        );
    },

    placeFood() {
        let validPosition = false;
        while (!validPosition) {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            validPosition = !this.snake.some(segment =>
                segment.x === this.food.x && segment.y === this.food.y
            );
        }
    },

    updateScore() {
        gameUtils.updateScoreDisplay('snakeScoreValue', this.score);
    },

    loadHighScore() {
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        gameUtils.updateScoreDisplay('snakeHighScoreValue', this.highScore);
    },

    gameOver() {
        clearInterval(this.gameLoop);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            gameUtils.updateScoreDisplay('snakeHighScoreValue', this.highScore);
        }

        // Draw final frame with game over text
        this.draw();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 30px "Poppins", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '20px "Poppins", sans-serif';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
};

// Initialize when window opens
document.querySelector('#snakeIcon').addEventListener('click', () => {
    snakeGame.init();
    snakeGame.draw();
});
