// Flappy Bird Game
const flappyGame = {
    canvas: null,
    ctx: null,
    birdImage: null,
    
    // objects
    bird: {
        x: 50,
        y: 250,
        width: 35,
        height: 30,
        velocity: 0,
        flapPower: -8,
        gravity: 0.4
    },
    
    pipes: [],
    pipeWidth: 60,
    pipeGap: 150,
    pipeSpacing: 280,
    
    score: 0,
    highScore: 0,
    gameActive: false,
    gameLoop: null,
    gameSpeed: 60,
    isInitialized: false,

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        this.canvas = document.getElementById('flappyCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Load bird 
        this.birdImage = new Image();
        this.birdImage.src = 'icons/bird.png';
        this.birdImage.onload = () => {
            this.draw();
        };
        
        this.loadHighScore();
        this.reset();
        this.setupControls();
        this.setupButtons();
    },

    setupControls() {
        // controls
        const flap = (e) => {
            if (this.gameActive && (e.key === ' ' || e.code === 'Space')) {
                e.preventDefault();
                this.handleFlap();
            }
        };
        
        document.addEventListener('keydown', flap);

        // Mouse/touch controls
        this.canvas.addEventListener('click', () => {
            if (this.gameActive) this.handleFlap();
        });

        this.canvas.addEventListener('touchstart', () => {
            if (this.gameActive) this.handleFlap();
        });
    },

    handleFlap() {
        this.bird.velocity = this.bird.flapPower;
    },

    setupButtons() {
        gameUtils.setupGameButtons('flappy', () => this.start());
    },

    reset() {
        this.bird.y = 250;
        this.bird.velocity = 0;
        this.pipes = [];
        this.score = 0;
        this.updateScore();
        this.generatePipes();
        clearInterval(this.gameLoop);
        this.gameActive = false;
    },

    generatePipes() {
        let lastPipeX = this.canvas.width;
        
        for (let i = 0; i < 5; i++) {
            const pipeX = lastPipeX + this.pipeSpacing;
            const gapY = Math.random() * (this.canvas.height - this.pipeGap - 100) + 50;
            
            this.pipes.push({
                x: pipeX,
                gapY: gapY,
                scored: false
            });
            
            lastPipeX = pipeX;
        }
    },

    start() {
        this.reset();
        this.gameActive = true;
        
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), 1000 / this.gameSpeed);
    },

    update() {
        // Apply gravity
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;

        // Check collision with ground/ceiling
        if (this.bird.y + this.bird.height > this.canvas.height || this.bird.y < 0) {
            this.gameOver();
            return;
        }

        // Move pipes
        this.pipes.forEach(pipe => {
            pipe.x -= 4;

            // Check if bird passed the pipe
            if (!pipe.scored && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.scored = true;
                this.score++;
                this.updateScore();
            }

            // Check collision with pipe
            if (
                this.bird.x + this.bird.width > pipe.x &&
                this.bird.x < pipe.x + this.pipeWidth
            ) {
                if (
                    this.bird.y < pipe.gapY ||
                    this.bird.y + this.bird.height > pipe.gapY + this.pipeGap
                ) {
                    this.gameOver();
                    return;
                }
            }
        });

        // Generate new pipes when needed
        if (this.pipes[this.pipes.length - 1].x < this.canvas.width - this.pipeSpacing) {
            const gapY = Math.random() * (this.canvas.height - this.pipeGap - 100) + 50;
            this.pipes.push({
                x: this.canvas.width,
                gapY: gapY,
                scored: false
            });
        }

        // Remove off-screen pipes
        this.pipes = this.pipes.filter(pipe => pipe.x > -this.pipeWidth);

        this.draw();
    },

    draw() {
        // Clear and draw background
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ground
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 40);

        // Draw pipes
        this.ctx.fillStyle = '#2F4F2F';
        this.pipes.forEach(pipe => {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.gapY);
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.gapY + this.pipeGap, this.pipeWidth, this.canvas.height - pipe.gapY - this.pipeGap - 40);
        });

        // Draw bird
        if (this.birdImage.complete) {
            this.ctx.save();
            this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
            
            // Rotate bird based on velocity
            const angle = Math.min(this.bird.velocity * 3, 45) * (Math.PI / 180);
            this.ctx.rotate(angle);
            
            this.ctx.drawImage(
                this.birdImage,
                -this.bird.width / 2,
                -this.bird.height / 2,
                this.bird.width,
                this.bird.height
            );
            this.ctx.restore();
        } else {
            // Fallback if image doesn't load
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.width, this.bird.height);
        }
    },

    gameOver() {
        this.gameActive = false;
        clearInterval(this.gameLoop);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        gameUtils.updateScoreDisplay('flappyHighScoreValue', this.highScore);
    },

    updateScore() {
        gameUtils.updateScoreDisplay('flappyScoreValue', this.score);
    },

    saveHighScore() {
        localStorage.setItem('flappyHighScore', this.highScore);
    },

    loadHighScore() {
        this.highScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;
        gameUtils.updateScoreDisplay('flappyHighScoreValue', this.highScore);
    }
};

// Initialize when window opens
if (document.querySelector('#flappyIcon')) {
    document.querySelector('#flappyIcon').addEventListener('click', () => {
        flappyGame.init();
    });
}
