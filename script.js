// Last.fm configuration for last played song
const LASTFM = {
    apiKey: "66bbe94145bf8ba917f60045593cfa4a",
    username: "LyricSantana"
};

// Lock Screen Management - Handles the lock screen 
var lockScreen = document.querySelector('#lockScreen');
var unlockButton = document.querySelector('#unlockButton');
var lockScreenTime = document.querySelector('#lockScreenTime');
var isLocked = true;
var touchStartY = 0;

// Unlock the screen
function unlockScreen() {
    if (!isLocked) return;
    isLocked = false;
    lockScreen.classList.add('hidden');
    setTimeout(function() {
        lockScreen.style.display = 'none';
    }, 500);
}

// Handle unlock button click
if (unlockButton) {
    unlockButton.addEventListener('click', unlockScreen);
}

// handle swipe up getsure
document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
}, false);

document.addEventListener('touchend', function(e) {
    var touchEndY = e.changedTouches[0].clientY;
    if (isLocked && touchEndY < touchStartY - 50) {
        unlockScreen();
    }
}, false);

// Update the clock text in the middle and bottom bar
// This function gets called every second
function updateTime() {
    var date = new Date();
    var dateStr = date.toLocaleDateString();
    var timeStr = date.toLocaleTimeString();
    var displayTime = document.querySelector('#displayTime');
    var bottomDate = document.querySelector('#bottomDate');
    var lockTime = document.querySelector('#lockScreenTime');
    displayTime.innerHTML = "<strong>" + timeStr + "</strong>";
    bottomDate.innerHTML = "<strong>" + dateStr + "</strong>";
    if (lockTime) {
        lockTime.innerHTML = "<strong>" + timeStr + "</strong>";
    }
}

// make the last.fm object into a simpler format
function formatTrack(track) {
    var imageUrl = "";
    if (track.image && track.image.length > 0) {
        // Get the largest image available from the array
        imageUrl = track.image[track.image.length - 1]["#text"];
    }
    return {
        artist: track.artist["#text"],
        title: track.name,
        nowPlaying: track["@attr"] && track["@attr"].nowplaying === "true",
        image: imageUrl
    };
}

function escapeHtml(value) {
    return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// display the track info
// updates the text and album cover image
function updateMusic(track) {
    var trackText = document.querySelector('#musicTrack');
    var albumCover = document.querySelector('#albumCover');

    var title = escapeHtml(track.title);
    var artist = escapeHtml(track.artist);
    var nowPlayingText = track.nowPlaying ? " (Now Playing)" : "";

    trackText.innerHTML = "<strong>" + title + " - " + artist + nowPlayingText + "</strong>";
    
    // Show album cover if available, hide if not
    if (track.image) {
        albumCover.src = track.image;
        albumCover.style.display = "block";
    } else {
        albumCover.style.display = "none";
    }
}

// get most recent track from last.fm API and display it
function fetchMusic() {
    var params = new URLSearchParams({
        method: "user.getrecenttracks",
        user: LASTFM.username,
        api_key: LASTFM.apiKey,
        limit: "1",
        format: "json"
    });

    // Make the API request
    fetch("https://ws.audioscrobbler.com/2.0/?" + params.toString())
    .then(function(response) {
        // check if the request was successful
        if(!response.ok) {
            throw new Error("last.fm request failed");
        }
        return response.json();
    })
    .then(function(data) {
        var tracks = data && data.recenttracks && data.recenttracks.track;
        var latest = Array.isArray(tracks) ? tracks[0] : tracks;
        updateMusic(formatTrack(latest));
    });
}

// Run once when page loads
updateTime();
fetchMusic();
// Keep the time updated every second 
setInterval(updateTime, 1000);
// Refresh the song every 60 seconds 
setInterval(fetchMusic, 60000);

// window element referecnes and controls
// every window needs a reference to the window itself, its close button, open button, and draggable header

// Get references to the about me window and its controls
var aboutMeWindow = document.querySelector("#aboutMeWindow");
var aboutMeClose = document.querySelector("#aboutMeClose");
var aboutMeOpen = document.querySelector("#aboutMeIcon");
var aboutMeHeader = document.querySelector("#aboutMeHeader");

// Get references to the music window and its controls
var musicWindow = document.querySelector("#musicWindow");
var musicClose = document.querySelector("#musicClose");
var musicOpen = document.querySelector("#musicIcon");
var musicHeader = document.querySelector("#musicHeader");

// Get references to the media window and its controls
var mediaWindow = document.querySelector("#mediaWindow");
var mediaClose = document.querySelector("#mediaClose");
var mediaOpen = document.querySelector("#mediaIcon");
var mediaHeader = document.querySelector("#mediaHeader");

// Get references to the snake window and its controls
var snakeWindow = document.querySelector("#snakeWindow");
var snakeClose = document.querySelector("#snakeClose");
var snakeOpen = document.querySelector("#snakeIcon");
var snakeHeader = document.querySelector("#snakeHeader");

// Get references to the flappy window and its controls
var flappyWindow = document.querySelector("#flappyWindow");
var flappyClose = document.querySelector("#flappyClose");
var flappyOpen = document.querySelector("#flappyIcon");
var flappyHeader = document.querySelector("#flappyHeader");

// Get references to the dino window and its controls
var dinoWindow = document.querySelector("#dinoWindow");
var dinoClose = document.querySelector("#dinoClose");
var dinoOpen = document.querySelector("#dinoIcon");
var dinoHeader = document.querySelector("#dinoHeader")

// Get references to the interests window and its controls
var interestsWindow = document.querySelector("#interestsWindow");
var interestsClose = document.querySelector("#interestsClose");
var interestsOpen = document.querySelector("#interestsIcon");
var interestsHeader = document.querySelector("#interestsHeader");

// Get references to the contact window and its controls
var contactWindow = document.querySelector("#contactWindow");
var contactClose = document.querySelector("#contactClose");
var contactOpen = document.querySelector("#contactIcon");
var contactHeader = document.querySelector("#contactHeader");

// Window management functions
// hide a window element by setting display to none and resetting psoition
function closeWindow(element) {
    element.style.display = "none";
    element.style.top = "";
    element.style.left = "";
}

// Ssow a window element by setting display to flex and bringing it to the front
function openWindow(element) {
    element.style.display = "flex";
    bringToFront(element);
}

// Make an element draggable by clicking and dragging its header
function dragElement(element, handle) {
    if (!element) {
        return;
    }

    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;
    var header = handle;
    var isDragging = false;

    // Mouse events
    header.onmousedown = startDraggingMouse;

    // Touch events for mobile/tablet
    header.addEventListener('touchstart', startDraggingTouch, false);

    function startDraggingMouse(e) {
        // Don't drag if clicking on close button
        if (e.target.closest('.closebutton')) return;
        if (e.button !== 0) return; // Only left mouse button
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        isDragging = true;
        document.onmouseup = stopDragging;
        document.onmousemove = handleDragMouse;
    }

    function startDraggingTouch(e) {
        // Don't drag if touching on close button
        if (e.target.closest('.closebutton')) return;
        if (e.touches.length !== 1) return;
        e.preventDefault();
        var touch = e.touches[0];
        initialX = touch.clientX;
        initialY = touch.clientY;
        isDragging = true;
        document.addEventListener('touchend', stopDragging, false);
        document.addEventListener('touchmove', handleDragTouch, false);
    }

    // Calculate and apply new position as mouse moves
    function handleDragMouse(e) {
        if (!isDragging) return;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        updatePosition();
    }

    function handleDragTouch(e) {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        var touch = e.touches[0];
        currentX = initialX - touch.clientX;
        currentY = initialY - touch.clientY;
        initialX = touch.clientX;
        initialY = touch.clientY;
        updatePosition();
    }

    function updatePosition() {
        var newTop = element.offsetTop - currentY;
        var newLeft = element.offsetLeft - currentX;
        
        // Keep window within viewport bounds
        var maxTop = window.innerHeight - element.offsetHeight;
        var maxLeft = window.innerWidth - element.offsetWidth;
        
        newTop = Math.max(0, Math.min(newTop, maxTop));
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    function stopDragging() {
        isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
        document.removeEventListener('touchend', stopDragging, false);
        document.removeEventListener('touchmove', handleDragTouch, false);
    }
}

// make all windows draggable by their headers
dragElement(aboutMeWindow, aboutMeHeader);

dragElement(snakeWindow, snakeHeader);
dragElement(flappyWindow, flappyHeader);
dragElement(dinoWindow, dinoHeader);

// Z-index stack management for window layering
// Windows that are clicked come to the front
var maxZIndex = 100;
// Bring an element to the front by giving it the highest z-index
function bringToFront(element) {
    element.style.zIndex = maxZIndex++;
}

// add click listeners to bring windows to front when clicked
// window you're interacting with is always on top
// add click listeners to bring windows to front
aboutMeWindow.addEventListener("mousedown", function() {
    bringToFront(aboutMeWindow);
});

snakeWindow.addEventListener("mousedown", function() {
    bringToFront(snakeWindow);
});

flappyWindow.addEventListener("mousedown", function() {
    bringToFront(flappyWindow);
});

dinoWindow.addEventListener("mousedown", function() {
    bringToFront(dinoWindow);
});

musicWindow.addEventListener("mousedown", function() {
    bringToFront(musicWindow);
});

mediaWindow.addEventListener("mousedown", function() {
    bringToFront(mediaWindow);
});

interestsWindow.addEventListener("mousedown", function() {
    bringToFront(interestsWindow);
});

contactWindow.addEventListener("mousedown", function() {
    bringToFront(contactWindow);
});

// event listeners for window controls

// set up event listeners for opening and closing the about me window
if (aboutMeClose) {
    aboutMeClose.addEventListener("click", function() {
        closeWindow(aboutMeWindow);
    });
}

if (aboutMeOpen) {
    aboutMeOpen.addEventListener("click", function() {
        openWindow(aboutMeWindow);
    });
}

// Make music window draggable
dragElement(musicWindow, musicHeader);

// set up event listeners for opening and closing the music window
if (musicClose) {
    musicClose.addEventListener("click", function() {
        closeWindow(musicWindow);
    });
}

if (musicOpen) {
    musicOpen.addEventListener("click", function() {
        openWindow(musicWindow);
    });
}

// set up event listeners for opening and closing the snake window
if (snakeClose) {
    snakeClose.addEventListener("click", function() {
        closeWindow(snakeWindow);
    });
}

if (snakeOpen) {
    snakeOpen.addEventListener("click", function() {
        openWindow(snakeWindow);
    });
}

// set up event listeners for opening and closing the flappy window
if (flappyClose) {
    flappyClose.addEventListener("click", function() {
        closeWindow(flappyWindow);
    });
}

if (flappyOpen) {
    flappyOpen.addEventListener("click", function() {
        openWindow(flappyWindow);
    });
}

// set up event listeners for opening and closing the dino window
if (dinoClose) {
    dinoClose.addEventListener("click", function() {
        closeWindow(dinoWindow);
    });
}

if (dinoOpen) {
    dinoOpen.addEventListener("click", function() {
        openWindow(dinoWindow);
    });
}

// Make media window draggable
dragElement(mediaWindow, mediaHeader);

// set up event listeners for opening and closing the media window
if (mediaClose) {
    mediaClose.addEventListener("click", function() {
        closeWindow(mediaWindow);
    });
}

if (mediaOpen) {
    mediaOpen.addEventListener("click", function() {
        openWindow(mediaWindow);
    });
}

// Make interests window draggable
dragElement(interestsWindow, interestsHeader);

// set up event listeners for opening and closing the interests window
if (interestsClose) {
    interestsClose.addEventListener("click", function() {
        closeWindow(interestsWindow);
    });
}

if (interestsOpen) {
    interestsOpen.addEventListener("click", function() {
        openWindow(interestsWindow);
    });
}

// Make contact window draggable
dragElement(contactWindow, contactHeader);

// set up event listeners for opening and closing the contact window
if (contactClose) {
    contactClose.addEventListener("click", function() {
        closeWindow(contactWindow);
    });
}

if (contactOpen) {
    contactOpen.addEventListener("click", function() {
        openWindow(contactWindow);
    });
}

// Wallpaper changer
var wallpaperWindow = document.querySelector("#wallpaperWindow");
var wallpaperClose = document.querySelector("#wallpaperClose");
var wallpaperOpen = document.querySelector("#wallpaperIcon");
var wallpaperHeader = document.querySelector("#wallpaperHeader");
var wallpaperUpload = document.querySelector("#wallpaperUpload");
var wallpaperColor = document.querySelector("#wallpaperColor");
var applyColorBtn = document.querySelector("#applyColorBtn");

// Function to apply a wallpaper image
function applyWallpaperImage(imageUrl) {
    document.body.style.backgroundImage = "url('" + imageUrl + "')";
    document.body.style.backgroundColor = "";
    document.querySelector(".lockScreen").style.backgroundImage = "url('" + imageUrl + "')";
    document.querySelector(".lockScreen").style.backgroundColor = "";
    localStorage.setItem("customWallpaper", imageUrl);
    localStorage.removeItem("wallpaperColor");
}

// make wallpaper window draggable
dragElement(wallpaperWindow, wallpaperHeader);

// Handle wallpaper window open/close
if (wallpaperClose) {
    wallpaperClose.addEventListener("click", function() {
        closeWindow(wallpaperWindow);
    });
}

if (wallpaperOpen) {
    wallpaperOpen.addEventListener("click", function() {
        openWindow(wallpaperWindow);
    });
}

// Handle preset buttons
var presetButtons = document.querySelectorAll(".presetButton");
presetButtons.forEach(function(button) {
    var presetUrl = button.getAttribute("data-preset");
    button.style.backgroundImage = "url('" + presetUrl + "')";
    button.addEventListener("click", function() {
        applyWallpaperImage(presetUrl);
    });
});

// file upload for custom wallpaper
if (wallpaperUpload) {
    wallpaperUpload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var wallpaperUrl = event.target.result;
                applyWallpaperImage(wallpaperUrl);
            };
            reader.readAsDataURL(file);
        }
    });
}

// color-based wallpaper
if (applyColorBtn) {
    applyColorBtn.addEventListener("click", function() {
        var color = wallpaperColor.value;
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = color;
        document.querySelector(".lockScreen").style.backgroundImage = "none";
        document.querySelector(".lockScreen").style.backgroundColor = color;
        localStorage.setItem("wallpaperColor", color);
        localStorage.removeItem("customWallpaper");
    });
}

// load wallpaper stuffs on page load
window.addEventListener("load", function() {
    var customWallpaper = localStorage.getItem("customWallpaper");
    var wallpaperColor = localStorage.getItem("wallpaperColor");
    
    if (customWallpaper) {
        document.body.style.backgroundImage = "url('" + customWallpaper + "')";
        document.querySelector(".lockScreen").style.backgroundImage = "url('" + customWallpaper + "')";
    } else if (wallpaperColor) {
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = wallpaperColor;
        document.querySelector(".lockScreen").style.backgroundImage = "none";
        document.querySelector(".lockScreen").style.backgroundColor = wallpaperColor;
        document.querySelector("#wallpaperColor").value = wallpaperColor;
    } else {
        // Set default wallpaper
        applyWallpaperImage("wallpapers/wallpaper1.png");
    }
});

// Snake Game Logic
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

    init: function() {
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadHighScore();
        this.reset();
        
        // Touch/swipe variables
        let touchStartX = 0;
        let touchStartY = 0;
        
        // Add keyboard controls
        document.addEventListener('keydown', (e) => {
            if (snakeWindow.style.display !== 'flex') return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.dy === 0) { this.dx = 0; this.dy = -1; }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (this.dy === 0) { this.dx = 0; this.dy = 1; }
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    if (this.dx === 0) { this.dx = -1; this.dy = 0; }
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    if (this.dx === 0) { this.dx = 1; this.dy = 0; }
                    e.preventDefault();
                    break;
            }
        });
        
        // Add touch controls for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, false);
        
        this.canvas.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            const threshold = 30;
            
            // Determine swipe direction
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                if (diffX > threshold && this.dx === 0) {
                    // Swipe right
                    this.dx = 1; this.dy = 0;
                } else if (diffX < -threshold && this.dx === 0) {
                    // Swipe left
                    this.dx = -1; this.dy = 0;
                }
            } else {
                // Vertical swipe
                if (diffY > threshold && this.dy === 0) {
                    // Swipe down
                    this.dx = 0; this.dy = 1;
                } else if (diffY < -threshold && this.dy === 0) {
                    // Swipe up
                    this.dx = 0; this.dy = -1;
                }
            }
        }, false);

        // Add start button handler
        document.getElementById('snakeStartBtn').addEventListener('click', () => {
            this.start();
            document.getElementById('snakeStartBtn').style.display = 'none';
            document.getElementById('snakeRestartBtn').style.display = 'inline-block';
        });

        // Add restart button handler
        document.getElementById('snakeRestartBtn').addEventListener('click', () => {
            this.reset();
            this.start();
        });
    },

    reset: function() {
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

    start: function() {
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
    },

    update: function() {
        // Move snake
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }

        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.updateScore();
            this.placeFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    },

    draw: function() {
        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
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

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#2E7D32' : '#4CAF50';
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw food
        this.ctx.fillStyle = '#F44336';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 1,
            this.food.y * this.gridSize + 1,
            this.gridSize - 2,
            this.gridSize - 2
        );
    },

    placeFood: function() {
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

    updateScore: function() {
        document.getElementById('snakeScoreValue').textContent = this.score;
    },

    loadHighScore: function() {
        const saved = localStorage.getItem('snakeHighScore');
        this.highScore = saved ? parseInt(saved) : 0;
        document.getElementById('snakeHighScoreValue').textContent = this.highScore;
    },

    updateHighScore: function() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            document.getElementById('snakeHighScoreValue').textContent = this.highScore;
        }
    },

    gameOver: function() {
        clearInterval(this.gameLoop);
        this.updateHighScore();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 30px "Poppins", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '20px "Poppins", sans-serif';
        this.ctx.fillText('Score: ' + this.score, this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
};

// Initialize snake game when window opens
snakeIcon.addEventListener('click', function() {
    if (!snakeGame.canvas) {
        snakeGame.init();
        snakeGame.draw();
    }
});
