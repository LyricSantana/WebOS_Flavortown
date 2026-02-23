// Shared Game Utilities
const gameUtils = {
    getButtonElements(prefix) {
        return {
            startBtn: document.getElementById(`${prefix}StartBtn`),
            restartBtn: document.getElementById(`${prefix}RestartBtn`)
        };
    },

    setupGameButtons(prefix, startCallback, restartCallback, endCallback) {
        const { startBtn, restartBtn } = this.getButtonElements(prefix);

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                startCallback();
                startBtn.style.display = 'none';
                restartBtn.style.display = 'inline-block';
            });
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                const callback = restartCallback || startCallback;
                callback();
                restartBtn.style.display = 'inline-block';
            });
        }
    },

    updateScoreDisplay(elementId, score) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = score;
    },

    createTouchControls(element, callback) {
        let touchStartX = 0;
        let touchStartY = 0;

        element.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        element.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            callback(diffX, diffY);
        });
    }
};
