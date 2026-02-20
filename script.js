// Last.fm config
const LASTFM = {
    apiKey: "66bbe94145bf8ba917f60045593cfa4a",
    username: "LyricSantana"
};

// Update the clock text in the top bar

function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector('#time');
    timeText.innerHTML = "<strong>" + currentTime + "</strong>";
}

// Turn the last.fm track object into a simple object i can use
function formatTrack(track) {
    return {
        artist: track.artist["#text"],
        title: track.name,
        nowPlaying: track["@attr"] && track["@attr"].nowplaying === "true"
    };
}

// escape html characters to prevent injection issues
function escapeHtml(value) {
    return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Put the track text on the page
function updateLastPlayed(track) {
    var trackText = document.querySelector('#lastPlayedTrack');


    var title = escapeHtml(track.title);
    var artist = escapeHtml(track.artist);
    var nowPlayingText = track.nowPlaying ? " (Now Playing)" : "";

    trackText.innerHTML = "<strong>" + title + " - " + artist + nowPlayingText + "</strong>";
}

// Get most recent track from last.fm and display it
function fetchLastPlayed() {
    var params = new URLSearchParams({
        method: "user.getrecenttracks",
        user: LASTFM.username,
        api_key: LASTFM.apiKey,
        limit: "1",
        format: "json"
    });

    fetch("https://ws.audioscrobbler.com/2.0/?" + params.toString())
    .then(function(response) {
        if(!response.ok) {
            throw new Error("last.fm request failed");
        }
        return response.json();
    })
    .then(function(data) {
        var tracks = data && data.recenttracks && data.recenttracks.track;
        var latest = Array.isArray(tracks) ? tracks[0] : tracks;
        updateLastPlayed(formatTrack(latest));
    });
}

// Run once when page loads
updateTime();
fetchLastPlayed();
// Keep the time updated every second
setInterval(updateTime, 1000);
// Refresh the song every 60 seconds
setInterval(fetchLastPlayed, 60000);

// Get references to the about me window and its controls
var aboutMeWindow = document.querySelector("#aboutMeWindow");
var aboutMeClose = document.querySelector("#aboutMeClose");
var aboutMeOpen = document.querySelector("#aboutMeIcon");
var aboutMeHeader = document.querySelector("#aboutMeHeader");

// hide a window element
function closeWindow(element) {
    element.style.display = "none";
}

// show a window element
function openWindow(element) {
    element.style.display = "flex";
}

// make an element draggable by its handle or itself
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

dragElement(aboutMeWindow, aboutMeHeader);

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