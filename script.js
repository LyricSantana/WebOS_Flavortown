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

    header.onmousedown = startDragging;

    function startDragging(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = handleDrag;
    }

    // Calculate and apply new position as mouse moves
    function handleDrag(e) {
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
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