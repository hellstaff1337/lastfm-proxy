const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Replace 'YOUR_LASTFM_API_KEY' with your Last.fm API key
const LASTFM_API_KEY = 'YOUR_LASTFM_API_KEY';

app.get('/current-track/:user', async (req, res) => {
    const username = req.params.user;
    try {
        const response = await axios.get(`https://ws.audioscrobbler.com/2.0/`, {
            params: {
                method: 'user.getRecentTracks',
                user: username,
                api_key: LASTFM_API_KEY,
                format: 'json',
                limit: 1
            }
        });

        const track = response.data.recenttracks.track[0];
        if (!track) {
            return res.status(404).json({ message: 'No tracks found' });
        }

        const currentTrack = {
            artist: track.artist['#text'],
            name: track.name,
            album: track.album['#text'],
            image: track.image[3]['#text']
        };

        res.json(currentTrack);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching track' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});