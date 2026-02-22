// Wallpaper Manager
const wallpaperManager = {
    wallpaperUpload: document.querySelector('#wallpaperUpload'),
    wallpaperColor: document.querySelector('#wallpaperColor'),
    applyColorBtn: document.querySelector('#applyColorBtn'),
    presetButtons: document.querySelectorAll('.presetButton'),

    init() {
        this.loadWallpaper();
        this.setupEventListeners();
    },

    setupEventListeners() {
        if (this.wallpaperUpload) {
            this.wallpaperUpload.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        if (this.applyColorBtn) {
            this.applyColorBtn.addEventListener('click', () => this.applyColor());
        }

        this.presetButtons.forEach(button => {
            const presetUrl = button.getAttribute('data-preset');
            button.style.backgroundImage = `url('${presetUrl}')`;
            button.addEventListener('click', () => this.applyWallpaper(presetUrl));
        });
    },

    applyWallpaper(imageUrl) {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundColor = '';
        document.querySelector('.lockScreen').style.backgroundImage = `url('${imageUrl}')`;
        document.querySelector('.lockScreen').style.backgroundColor = '';
        localStorage.setItem('customWallpaper', imageUrl);
        localStorage.removeItem('wallpaperColor');
    },

    applyColor() {
        const color = this.wallpaperColor.value;
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = color;
        document.querySelector('.lockScreen').style.backgroundImage = 'none';
        document.querySelector('.lockScreen').style.backgroundColor = color;
        localStorage.setItem('wallpaperColor', color);
        localStorage.removeItem('customWallpaper');
    },

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => this.applyWallpaper(event.target.result);
        reader.readAsDataURL(file);
    },

    loadWallpaper() {
        const customWallpaper = localStorage.getItem('customWallpaper');
        const wallpaperColorStored = localStorage.getItem('wallpaperColor');

        if (customWallpaper) {
            this.applyWallpaper(customWallpaper);
        } else if (wallpaperColorStored) {
            this.wallpaperColor.value = wallpaperColorStored;
            this.applyColor();
        } else {
            this.applyWallpaper('wallpapers/wallpaper1.png');
        }
    }
};

wallpaperManager.init();
