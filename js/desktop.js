// Lock Screen Management
const lockScreen = {
    element: document.querySelector('#lockScreen'),
    unlockButton: document.querySelector('#unlockButton'),
    timeDisplay: document.querySelector('#lockScreenTime'),
    isLocked: true,
    touchStartY: 0,

    init() {
        if (this.unlockButton) {
            this.unlockButton.addEventListener('click', () => this.unlock());
        }
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });
        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            if (this.isLocked && touchEndY < this.touchStartY - 50) {
                this.unlock();
            }
        });
    },

    unlock() {
        if (!this.isLocked) return;
        this.isLocked = false;
        this.element.classList.add('hidden');
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 500);
    }
};

// Time Management
const timeManager = {
    displayTime: document.querySelector('#displayTime'),
    bottomDate: document.querySelector('#bottomDate'),

    updateTime() {
        const date = new Date();
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString();

        this.displayTime.innerHTML = `<strong>${timeStr}</strong>`;
        this.bottomDate.innerHTML = `<strong>${dateStr}</strong>`;
        if (lockScreen.timeDisplay) {
            lockScreen.timeDisplay.innerHTML = `<strong>${timeStr}</strong>`;
        }
    },

    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }
};

// Window Manager - Handles all window operations
const windowManager = {
    maxZIndex: 100,
    windows: {},

    register(name, config) {
        const win = {
            element: document.querySelector(config.elementId),
            closeBtn: document.querySelector(config.closeId),
            openBtn: document.querySelector(config.openId),
            header: document.querySelector(config.headerId)
        };

        if (!win.element) return;

        this.windows[name] = win;
        this.setupWindowControls(name);
        if (win.header) this.makeDraggable(name);
    },

    setupWindowControls(name) {
        const win = this.windows[name];

        if (win.closeBtn) {
            win.closeBtn.addEventListener('click', () => this.close(name));
        }
        if (win.openBtn) {
            win.openBtn.addEventListener('click', () => this.open(name));
        }
        win.element.addEventListener('mousedown', () => this.bringToFront(name));
    },

    close(name) {
        const win = this.windows[name];
        if (!win) return;
        win.element.style.display = 'none';
        win.element.style.top = '';
        win.element.style.left = '';
    },

    open(name) {
        const win = this.windows[name];
        if (!win) return;
        win.element.style.display = 'flex';
        this.bringToFront(name);
    },

    bringToFront(name) {
        const win = this.windows[name];
        if (!win) return;
        win.element.style.zIndex = this.maxZIndex++;
    },

    makeDraggable(name) {
        const win = this.windows[name];
        if (!win || !win.header) return;

        let isDragging = false;
        let initialX = 0, initialY = 0;

        const startDrag = (clientX, clientY) => {
            if (event.target.closest('.closebutton')) return;
            isDragging = true;
            initialX = clientX;
            initialY = clientY;
        };

        const endDrag = () => {
            isDragging = false;
        };

        const drag = (clientX, clientY) => {
            if (!isDragging) return;

            const deltaX = clientX - initialX;
            const deltaY = clientY - initialY;
            initialX = clientX;
            initialY = clientY;

            let newTop = win.element.offsetTop + deltaY;
            let newLeft = win.element.offsetLeft + deltaX;

            const maxTop = window.innerHeight - win.element.offsetHeight;
            const maxLeft = window.innerWidth - win.element.offsetWidth;

            newTop = Math.max(0, Math.min(newTop, maxTop));
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));

            win.element.style.top = `${newTop}px`;
            win.element.style.left = `${newLeft}px`;
        };

        win.header.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
        win.header.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
        });

        document.addEventListener('mousemove', (e) => drag(e.clientX, e.clientY));
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length !== 1) return;
            e.preventDefault();
            drag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });

        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }
};

// Register all windows
const windowConfigs = [
    { name: 'aboutMe', elementId: '#aboutMeWindow', closeId: '#aboutMeClose', openId: '#aboutMeIcon', headerId: '#aboutMeHeader' },
    { name: 'music', elementId: '#musicWindow', closeId: '#musicClose', openId: '#musicIcon', headerId: '#musicHeader' },
    { name: 'media', elementId: '#mediaWindow', closeId: '#mediaClose', openId: '#mediaIcon', headerId: '#mediaHeader' },
    { name: 'snake', elementId: '#snakeWindow', closeId: '#snakeClose', openId: '#snakeIcon', headerId: '#snakeHeader' },
    { name: 'flappy', elementId: '#flappyWindow', closeId: '#flappyClose', openId: '#flappyIcon', headerId: '#flappyHeader' },
    { name: 'dino', elementId: '#dinoWindow', closeId: '#dinoClose', openId: '#dinoIcon', headerId: '#dinoHeader' },
    { name: 'interests', elementId: '#interestsWindow', closeId: '#interestsClose', openId: '#interestsIcon', headerId: '#interestsHeader' },
    { name: 'contact', elementId: '#contactWindow', closeId: '#contactClose', openId: '#contactIcon', headerId: '#contactHeader' },
    { name: 'wallpaper', elementId: '#wallpaperWindow', closeId: '#wallpaperClose', openId: '#wallpaperIcon', headerId: '#wallpaperHeader' }
];

windowConfigs.forEach(config => {
    windowManager.register(config.name, config);
});

// Initialize
lockScreen.init();
timeManager.init();
