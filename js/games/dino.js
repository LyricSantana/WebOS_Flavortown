// Dino Game
const dinoGame = {
    canvas: null,
    ctx: null,
    gameWidth: 600,
    gameHeight: 200,
    dino: {
        x: 50,
        y: 130,
        width: 35,
        height: 40,
        velocityY: 0,
        jumping: false,
        jumpPower: 6,
        color: '#8B4513',
        image: null
    },
    obstacles: [],
    score: 0,
    highScore: 0,
    gameRunning: false,
    gameSpeed: 3,
    baseGameSpeed: 3,
    gravity: 0.15,
    spawnRate: 120,
    frameCount: 0,
    isInitialized: false,

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        this.canvas = document.getElementById('dinoCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadHighScore();
        this.reset();

        this.dino.image = new Image();
        this.dino.image.src = 'icons/dino.png';

        this.setupControls();
        this.setupButtons();
    },

    setupControls() {
        // keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameRunning && !this.dino.jumping) {
                e.preventDefault();
                this.jump();
            }
        });

        // Click/Touch controls
        this.canvas.addEventListener('click', () => {
            if (this.gameRunning && !this.dino.jumping) this.jump();
        });

        this.canvas.addEventListener('touchstart', () => {
            if (this.gameRunning && !this.dino.jumping) this.jump();
        });
    },

    setupButtons() {
        gameUtils.setupGameButtons('dino', () => this.startGame());
    },

    jump() {
        this.dino.velocityY = -this.dino.jumpPower;
        this.dino.jumping = true;
    },

    startGame() {
        this.reset();
        this.baseGameSpeed = 3;
        this.gameSpeed = 3;
        this.gameRunning = true;
        this.gameLoop();
    },

    reset() {
        this.dino.velocityY = 0;
        this.dino.jumping = false;
        this.dino.y = 130;
        this.obstacles = [];
        this.frameCount = 0;
        this.baseGameSpeed = 4;
        this.gameSpeed = 4;
        this.spawnRate = 120;
        this.score = 0;
        this.updateScoreDisplay();
    },

    loadHighScore() {
        this.highScore = parseInt(localStorage.getItem('dinoHighScore')) || 0;
        this.updateHighScoreDisplay();
    },

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dinoHighScore', this.highScore);
            this.updateHighScoreDisplay();
        }
    },

    updateScoreDisplay() {
        gameUtils.updateScoreDisplay('dinoScoreValue', this.score);
    },

    updateHighScoreDisplay() {
        gameUtils.updateScoreDisplay('dinoHighScoreValue', this.highScore);
    },

    spawnObstacleGroup() {
        const groupSize = Math.random() < 0.6 ? 1 : (Math.random() < 0.7 ? 2 : 3);
        const spacing = 25;

        for (let i = 0; i < groupSize; i++) {
            this.obstacles.push({
                x: this.gameWidth + (i * spacing),
                y: 170,
                width: 15,
                height: 30,
                color: '#2ECC71'
            });
        }
    },

    update() {
        if (!this.gameRunning) return;

        this.gameSpeed = this.baseGameSpeed + (this.score * 0.05);

        // physics
        this.dino.velocityY += this.gravity;
        this.dino.y += this.dino.velocityY;

        // ground collision
        if (this.dino.y + this.dino.height >= this.gameHeight) {
            this.dino.y = this.gameHeight - this.dino.height;
            this.dino.jumping = false;
            this.dino.velocityY = 0;
        }

        // obstacles
        this.frameCount++;
        if (this.frameCount >= this.spawnRate) {
            this.spawnObstacleGroup();
            this.frameCount = 0;
        }

        // update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.gameSpeed;

            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
                this.score++;
                this.updateScoreDisplay();
            }
        }

        this.checkCollision();
    },

    checkCollision() {
        const dino = this.dino;
        for (let obstacle of this.obstacles) {
            if (dino.x < obstacle.x + obstacle.width &&
                dino.x + dino.width > obstacle.x &&
                dino.y < obstacle.y + obstacle.height &&
                dino.y + dino.height > obstacle.y) {
                this.gameOver();
                return;
            }
        }
    },

    gameOver() {
        this.gameRunning = false;
        this.saveHighScore();

        const { startBtn, restartBtn } = gameUtils.getButtonElements('dino');
        if (startBtn) startBtn.style.display = 'none';
        if (restartBtn) restartBtn.style.display = 'inline-block';
    },

    draw() {
        // Background
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Dino
        if (this.dino.image?.complete) {
            this.ctx.drawImage(this.dino.image, this.dino.x, this.dino.y, this.dino.width, this.dino.height);
        }

        // Obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        // game over
        if (!this.gameRunning && this.score > 0) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 24px "Poppins", sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.gameWidth / 2, this.gameHeight / 2 - 20);
            this.ctx.font = '16px "Poppins", sans-serif';
            this.ctx.fillText(`Score: ${this.score}`, this.gameWidth / 2, this.gameHeight / 2 + 20);
        }

        if (this.gameRunning) {
            this.update();
            requestAnimationFrame(() => this.draw());
        }
    },

    gameLoop() {
        this.draw();
    }
};

// initialize when window opens
document.querySelector('#dinoIcon').addEventListener('click', () => {
    dinoGame.init();
    dinoGame.draw();
});
