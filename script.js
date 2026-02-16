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
// Refresh the song every 10 seconds
setInterval(fetchLastPlayed, 10000);