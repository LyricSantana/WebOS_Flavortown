// Flappy Bird Game - Coming Soon
const flappyGame = {
    isInitialized: false,

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        console.log('Flappy Bird game initialized (placeholder)');
    }
};

// Initialize when window opens
if (document.querySelector('#flappyIcon')) {
    document.querySelector('#flappyIcon').addEventListener('click', () => {
        flappyGame.init();
    });
}
