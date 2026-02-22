// Last.fm Music Integration
const musicManager = {
    API_KEY: '66bbe94145bf8ba917f60045593cfa4a',
    USERNAME: 'LyricSantana',
    trackElement: document.querySelector('#musicTrack'),
    albumCover: document.querySelector('#albumCover'),

    init() {
        this.fetchMusic();
        setInterval(() => this.fetchMusic(), 60000);
    },

    formatTrack(track) {
        return {
            artist: track.artist['#text'],
            title: track.name,
            nowPlaying: track['@attr']?.nowplaying === 'true',
            image: track.image?.[track.image.length - 1]?.['#text'] || ''
        };
    },

    escapeHtml(value) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return String(value).replace(/[&<>"']/g, char => map[char]);
    },

    updateUI(track) {
        const title = this.escapeHtml(track.title);
        const artist = this.escapeHtml(track.artist);
        const nowPlayingText = track.nowPlaying ? ' (Now Playing)' : '';

        this.trackElement.innerHTML = `<strong>${title} - ${artist}${nowPlayingText}</strong>`;

        if (track.image) {
            this.albumCover.src = track.image;
            this.albumCover.style.display = 'block';
        } else {
            this.albumCover.style.display = 'none';
        }
    },

    fetchMusic() {
        const params = new URLSearchParams({
            method: 'user.getrecenttracks',
            user: this.USERNAME,
            api_key: this.API_KEY,
            limit: '1',
            format: 'json'
        });

        fetch(`https://ws.audioscrobbler.com/2.0/?${params.toString()}`)
            .then(response => {
                if (!response.ok) throw new Error('Last.fm request failed');
                return response.json();
            })
            .then(data => {
                const tracks = data?.recenttracks?.track;
                const latest = Array.isArray(tracks) ? tracks[0] : tracks;
                this.updateUI(this.formatTrack(latest));
            })
            .catch(error => console.log('Music fetch error:', error));
    }
};

musicManager.init();
